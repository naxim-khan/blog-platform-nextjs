import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export function getUserFromCookie() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const user = verifyToken(token);
    return user;
  } catch {
    return null;
  }
}
