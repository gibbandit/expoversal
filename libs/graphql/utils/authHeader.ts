import { decodeGlobalID } from '@pothos/plugin-relay';

export async function parseAuthHeader(authorization: string | null) {
  if (!authorization) {
    return null;
  }
  const decodedId = decodeGlobalID(authorization);
  if (decodedId.typename !== 'User') {
    throw new Error('Invalid authorization header');
  }
  return { id: decodedId.id };
}
