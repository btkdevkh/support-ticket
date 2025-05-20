"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { logSentryEvent } from "@/utils/sentry";
import { removeAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";

type ResponseResult = {
  success: boolean;
  message: string;
};

const registerUser = async (
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> => {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      logSentryEvent(
        "Validation error: Missing register fields",
        "auth",
        { name, email },
        "warning"
      );

      return {
        success: false,
        message: "Veuillez remplir tous les champs",
      };
    }

    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      logSentryEvent(
        `Registration failed: User already exists - ${email}`,
        "auth",
        { email },
        "warning"
      );

      return {
        success: false,
        message: "L'utilisateur déja existant",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Sign & set auth token
    const token = await signAuthToken({ userId: user.id });
    await setAuthCookie(token);

    logSentryEvent(
      `User registered successfully: ${email}`,
      "auth",
      { userId: user.id },
      "info"
    );

    return {
      success: true,
      message: "Compte crée!",
    };
  } catch (error) {
    logSentryEvent(
      `An error occured while registering user`,
      "auth",
      {},
      "error",
      error
    );

    return {
      success: false,
      message: "Une erreur s'est produit, veuillez réessayer plus tard!",
    };
  }
};

const logInUser = async (
  prevState: ResponseResult,
  formData: FormData
): Promise<ResponseResult> => {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      logSentryEvent(
        "Validation error: Missing register fields",
        "auth",
        { email },
        "warning"
      );

      return {
        success: false,
        message: "Veuillez remplir tous les champs",
      };
    }

    // Find existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      logSentryEvent(
        `Login failed: User not found - ${email}`,
        "auth",
        { email },
        "warning"
      );

      return {
        success: false,
        message: "L'email ou le mot de passe est incorrect",
      };
    }

    // Compare hashed password
    const compareHashedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!compareHashedPassword) {
      logSentryEvent(
        `Login failed: Incorrect password`,
        "auth",
        { password },
        "warning"
      );

      return {
        success: false,
        message: "L'email ou le mot de passe est incorrect",
      };
    }

    // Sign & set auth token
    const token = await signAuthToken({ userId: existingUser.id });
    await setAuthCookie(token);

    logSentryEvent(
      `Login successful: ${email}`,
      "auth",
      { userId: existingUser.id },
      "info"
    );

    return {
      success: true,
      message: "Vous vous êtes bien connecté!",
    };
  } catch (error) {
    logSentryEvent(`An error occured while login`, "auth", {}, "error", error);

    return {
      success: false,
      message: "Une erreur s'est produit, veuillez rééssayer plus tard!",
    };
  }
};

const logOutUser = async (): Promise<{ success: boolean; message: string }> => {
  try {
    await removeAuthCookie();

    logSentryEvent(`User logged out successfully: `, "auth", {}, "info");

    return {
      success: true,
      message: "Vous vous êtes bien déconnecté",
    };
  } catch (error) {
    logSentryEvent(
      `An error occured while logout user`,
      "auth",
      {},
      "error",
      error
    );

    return {
      success: false,
      message: `Une erreur s'est produit, veuillez rééssayer plus tard!`,
    };
  }
};

export { registerUser, logOutUser, logInUser };
