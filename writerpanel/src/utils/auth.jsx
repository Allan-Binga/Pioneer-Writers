export function isWriterLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function getWriterRole() {
  return localStorage.getItem("userRole");
}
