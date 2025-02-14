export const getToken = (): string | null => {
  try {
    const token = localStorage.getItem("logiEx-token");
    return token ? token.trim() : null;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return null;
  }
};
