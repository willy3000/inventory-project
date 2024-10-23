export const BASE_URL = "http://192.168.3.184:5000";
// export const BASE_URL = "http://localhost:5000";

export const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long", // 'short', 'narrow' for shorter names
    year: "numeric",
    month: "long", // 'short' for abbreviated month names
    day: "numeric",
  });
};
