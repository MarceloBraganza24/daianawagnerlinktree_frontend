// utils/authHeaders.js
export function authHeaders(json = true) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
