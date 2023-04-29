export async function parseAuthHeader(authorization: string | null) {
  if (!authorization || authorization === '') {
    return null;
  }
  return { id: authorization };
}
