export function authHeader(secured = false) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (secured && user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  }
  return {};
}
