// lib/auth.js
import { verifyToken } from './jwt';

export async function getToken(req) {
  try {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    const decoded = await verifyToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
}