"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { registerUser } from "@/actions/auth.actions";

const RegisterForm = () => {
  const router = useRouter();

  const [state, formAction] = useActionState(registerUser, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Compte crée!");
      router.push("/tickets");
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state.success, router]);

  return (
    <>
      <div className="w-full max-w-md bg-white p-6 shadow-md">
        <h1 className="text-blue-700 text-2xl mb-5 text-center">
          S'enregistrer
        </h1>

        {state.message && !state.success && (
          <p className="text-red-500 mb-4 text-center">{state.message}</p>
        )}

        <form action={formAction} className="space-y-5">
          <input
            className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Prénom et NOM"
            name="name"
          />
          <input
            className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="Email"
            name="email"
          />
          <input
            className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="Mot de passe"
            name="password"
          />

          <button
            type="submit"
            className="w-full bg-blue-700 p-3 text-white cursor-pointer"
          >
            S'enregistrer
          </button>
        </form>
      </div>
    </>
  );
};

export default RegisterForm;
