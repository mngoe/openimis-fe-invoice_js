// Builds the search criteria payload of a decimal amount filter. The entry is already parsed by the
// NumberInput of fe-core, the sanitizing below only covers filter states built by hand.
export const buildDecimalFilter = (filterName, value) => {
  const raw = String(value ?? "")
    .replace(/\s/g, "")
    .replace(",", ".");
  if (!raw) {
    return [{ id: filterName, value: null, filter: null }];
  }
  const parsed = Number(raw);
  // The amounts are DecimalField(..., decimal_places=2) on the backend: two decimals is the API contract.
  const decimalValue = Number.isFinite(parsed) ? parsed.toFixed(2) : null;
  return [
    {
      id: filterName,
      value: decimalValue,
      filter: decimalValue ? `${filterName}: "${decimalValue}"` : null,
    },
  ];
};
