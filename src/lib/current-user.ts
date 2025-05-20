import { prisma } from "./prisma";
import { getAuthCookie, verifyAuthToken } from "./auth";

type AuthPayload = {
  userId: string;
};

const getCurrentUser = async () => {
  try {
    const token = await getAuthCookie();
    if (!token) return null;

    const payload = (await verifyAuthToken(token)) as AuthPayload;

    if (!payload?.userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return user;
  } catch (error) {
    console.log("Error: ", error);
    return null;
  }
};

export { getCurrentUser };
