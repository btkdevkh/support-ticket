"use client";

import { closeTicket } from "@/actions/ticket.actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

type CloseTicketButtonProps = {
  ticketId: number;
  isClosed: boolean;
};

const CloseTicketButton = ({ ticketId, isClosed }: CloseTicketButtonProps) => {
  const router = useRouter();

  const initialState = {
    success: false,
    message: "",
  };

  const [state, formAction] = useActionState(closeTicket, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/tickets");
    } else if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, router]);

  if (isClosed) return null;

  return (
    <>
      <form action={formAction}>
        <input type="hidden" name="ticketId" value={ticketId} />

        <button
          type="submit"
          className="bg-red-700 text-white px-3 py-2 cursor-pointer"
        >
          Fermer le ticket
        </button>
      </form>
    </>
  );
};

export default CloseTicketButton;
