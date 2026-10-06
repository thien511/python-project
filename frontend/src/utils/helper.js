export const formatPrice = (price) => {
  if (!price) return "N/A";
  return new Intl.NumberFormat("vi-VN").format(price);
};
