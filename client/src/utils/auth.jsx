export function isUserLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

export function getUserRole() {
  return localStorage.getItem("userRole");
}