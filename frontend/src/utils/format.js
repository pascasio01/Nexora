export const formatDate = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString();
};
