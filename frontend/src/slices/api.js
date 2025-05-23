export const url = "http://localhost:5000";

export const setHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found in localStorage");
  }
  return {
    headers: {
      "x-auth-token": token,
    },
  };
};
