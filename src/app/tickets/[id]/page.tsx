import { getTicketById } from "@/actions/ticket.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { logSentryEvent } from "@/utils/sentry";
import { getPriorityClass, getPriorityTranslateFR } from "@/utils/ui";
import { IoIosArrowRoundBack } from "react-icons/io";

const TicketDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await props.params;
  const ticket = await getTicketById(+id);
  console.log(ticket);

  if (!ticket) {
    notFound();
  }

  logSentryEvent(
    "Viewing ticket details",
    "ticket",
    { ticketId: ticket.id },
    "info"
  );

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto bg-white p-6 shadow-md mt-6">
      <h1 className="text-blue-700 text-2xl">{ticket.subject}</h1>

      <div className="text-gary-700 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Déscription</h2>
        <p>{ticket.description}</p>
      </div>

      <div className="text-gary-700 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Priorité</h2>
        <p className={getPriorityClass(ticket.priority)}>
          {getPriorityTranslateFR(ticket.priority)}
        </p>
      </div>

      <div className="text-gary-700 flex flex-col gap-2">
        <h2 className="text-lg font-semibold">Date de création</h2>
        <p>{new Date(ticket.createdAt).toLocaleString()}</p>
      </div>

      <div className="w-fit bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition flex items-center gap-3">
        <IoIosArrowRoundBack size={20} />
        <Link href="/tickets" className="text-white">
          Retour aux Tickets
        </Link>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
