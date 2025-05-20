import { getTicketById } from "@/actions/ticket.actions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { logSentryEvent } from "@/utils/sentry";
import { getPriorityClass, getPriorityTranslateFR } from "@/utils/ui";
import { IoIosArrowRoundBack } from "react-icons/io";
import CloseTicketButton from "@/components/CloseTicketButton";
import { getCurrentUser } from "@/lib/current-user";

const TicketDetailsPage = async (props: {
  params: Promise<{ id: string }>;
}) => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  const { id } = await props.params;
  const ticket = await getTicketById(+id);

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
    <div className="min-h-screen p-3">
      <div className="max-w-3xl mx-auto flex flex-col gap-4 bg-white p-6 shadow-md">
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

        <div className="flex justify-between items-center">
          <div className="w-fit bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition flex items-center gap-3">
            <IoIosArrowRoundBack size={20} />
            <Link href="/tickets" className="text-white">
              Retour
            </Link>
          </div>

          <CloseTicketButton
            ticketId={ticket.id}
            isClosed={ticket.status === "Closed"}
          />
        </div>
      </div>
    </div>
  );
};

export default TicketDetailsPage;
