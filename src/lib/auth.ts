import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { logSentryEvent } from "@/utils/sentry";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
const cookieName = "auth-token";

const signAuthToken = async (payload: any) => {
  try {
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return token;
  } catch (error) {
    logSentryEvent("Token signing failed", "auth", { payload }, "error", error);
    throw new Error("Token signing failed");
  }
};

const verifyAuthToken = async <T>(token: string): Promise<T> => {
  try {
    const { payload } = await jwtVerify(token, secret);

    return payload as T;
  } catch (error) {
    logSentryEvent(
      "Token decryption failed",
      "auth",
      { tokenSnippet: token.slice(0, 10) },
      "error",
      error
    );
    throw new Error("Token decryption failed");
  }
};

const setAuthCookie = async (token: string) => {
  try {
    const cookieStore = await cookies();
    cookieStore.set(cookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (error) {
    logSentryEvent("Cookie setting failed", "auth", { token }, "error", error);
    throw new Error("Cookie setting failed");
  }
};

const getAuthCookie = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(cookieName);

    return token?.value;
  } catch (error) {
    logSentryEvent("Cookie getting failed", "auth", {}, "error", error);
    throw new Error("Cookie getting failed");
  }
};

const removeAuthCookie = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(cookieName);
  } catch (error) {
    logSentryEvent("Cookie removing failed", "auth", {}, "error", error);
    throw new Error("Cookie removing failed");
  }
};

export {
  signAuthToken,
  verifyAuthToken,
  setAuthCookie,
  getAuthCookie,
  removeAuthCookie,
};
