// lib/jwt.js
import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET;

export async function createToken(user) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  
  return new SignJWT({ 
    id: user._id.toString(),
    email: user.email,
    username: user.username 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(secret);
}

export async function verifyToken(token) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}