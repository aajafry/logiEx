export const priceValidation = (value: number | string): boolean => {
  // Convert value to string
  const strValue = typeof value === "number" ? value.toString() : value.trim();

  // Ensure it's a valid number
  if (!/^\d+(\.\d+)?$/.test(strValue)) return false;

  const [integerPart, fractionPart] = strValue.split(".");
  const totalDigits =
    integerPart.length + (fractionPart ? fractionPart.length : 0);

  return totalDigits <= 10 && (!fractionPart || fractionPart.length <= 3);
};
