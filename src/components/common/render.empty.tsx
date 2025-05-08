export const renderEmptyCell = (
  value: any,
  fallback: React.ReactNode = "_"
): React.ReactNode => {
  if (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "") ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return fallback;
  }
  return value;
};
