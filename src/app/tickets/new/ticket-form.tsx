"use client";

import { useActionState, useEffect } from "react";
import { createTicket } from "@/actions/ticket.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NewTicketForm = () => {
  const router = useRouter();

  const [state, formAction] = useActionState(createTicket, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      toast.success("Ticket sumitted successfully!");
      router.push("/tickets");
    }
  }, [state.success, router]);

  return (
    <>
      <div className="w-full max-w-md bg-white p-6 shadow-md">
        <h1 className="text-blue-700 text-2xl mb-5 text-center">
          Créer un Support Ticket
        </h1>

        {state.message && !state.success && (
          <p className="text-red-500 mb-4 text-center">{state.message}</p>
        )}

        <form action={formAction} className="space-y-5">
          <input
            className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Sujet"
            name="subject"
          />

          <textarea
            className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={5}
            placeholder="Décrivez votre problème"
            name="description"
          />

          <select
            className="w-full p-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="priority"
          >
            <option value="Low">Priorité Normal</option>
            <option value="Medium">Priorité Moyenne</option>
            <option value="High">Priorité Haute</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-700 p-3 text-white cursor-pointer"
          >
            Valider
          </button>
        </form>
      </div>
    </>
  );
};

export default NewTicketForm;
