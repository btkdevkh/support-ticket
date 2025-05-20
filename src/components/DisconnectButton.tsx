"use client";

import { toast } from "sonner";
import { useActionState, useEffect } from "react";
import { logOutUser } from "@/actions/auth.actions";

const DisconnectButton = () => {
  const [state, formAction] = useActionState(logOutUser, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <button className="bg-red-700 text-white px-3 py-2 cursor-pointer">
        Déconnexion
      </button>
    </form>
  );
};

export default DisconnectButton;
