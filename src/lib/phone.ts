const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

function toLatinDigits(value: string): string {
  return value.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (digit) => {
    const code = digit.charCodeAt(0);
    if (code >= 0x06f0 && code <= 0x06f9) return String(code - 0x06f0);
    if (code >= 0x0660 && code <= 0x0669) return String(code - 0x0660);
    return digit;
  });
}

function toPersianDigits(value: string): string {
  return value.replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);
}

/**
 * Turn an admin-entered phone into the label and `tel:` value used on
 * «تماس با وکیل این پرونده». Iranian numbers become ۰۲۱… / ۰۹۱۲… and +98….
 */
export function formatCallPhone(
  raw: string,
): { label: string; tel: string } | null {
  const digits = toLatinDigits(raw).replace(/\D/g, "");
  if (digits.length < 8) return null;

  const significant = iranianSignificant(digits);
  if (significant) {
    return {
      label: toPersianDigits(`0${significant}`),
      tel: `+98${significant}`,
    };
  }

  return {
    label: toPersianDigits(digits),
    tel: `+${digits}`,
  };
}

function iranianSignificant(digits: string): string | null {
  let national = digits;
  if (national.startsWith("0098")) national = national.slice(4);
  else if (national.startsWith("98") && national.length >= 12) {
    national = national.slice(2);
  } else if (national.startsWith("0")) national = national.slice(1);
  else if (national.length === 10) {
    // Already a national number without the trunk 0.
  } else return null;

  national = national.replace(/^0+/, "");
  if (!/^[1-9]\d{7,10}$/.test(national)) return null;
  return national;
}
