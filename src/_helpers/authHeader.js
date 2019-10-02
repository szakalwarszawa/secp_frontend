export function authHeader(secured = false) {
  const token = JSON.parse(sessionStorage.getItem('token'));

  if (secured && token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
