export function getHeaders(token: string | null) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
