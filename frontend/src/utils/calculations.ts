export const calculateSubscriptionPrice = (
  planPrice: number,
  mealTypes: string[],
  deliveryDays: string[]
): number => {
  return planPrice * mealTypes.length * deliveryDays.length * 4.3;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};
