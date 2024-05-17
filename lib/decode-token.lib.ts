import { jwtVerify } from "jose";

export const getAccessJwtSecretKey = () => {
  const secretKey = process.env.ACCESS_JWT_SECRET_KEY;
  if (!secretKey) throw new Error("Access Jwt secret key is not available");

  return new TextEncoder().encode(secretKey);
};

export async function verifyJwtAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getAccessJwtSecretKey);

    return payload;
  } catch (error) {
    return null;
  }
}

export const getRefreshJwtSecretKey = () => {
  const secretKey = process.env.REFRESH_JWT_SECRET_KEY;
  if (!secretKey) throw new Error("Refresh Jwt secret key is not available");

  return new TextEncoder().encode(secretKey);
};

export async function verifyJwtRefreshToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getRefreshJwtSecretKey());
    
    return payload;
  } catch (error) {
    return null;
  }
}