import { getTickets } from "@/actions/ticket.actions";
import TicketItem from "@/components/TicketItem";
import { getCurrentUser } from "@/lib/current-user";
import { redirect } from "next/navigation";

const TicketsPage = async () => {
  const tickets = await getTickets();
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <>
      <div className="min-h-screen p-3">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Support Tickets
        </h1>

        {tickets.length === 0 ? (
          <p className="text-center text-gray-600">Il n'y a pas de tickets</p>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {tickets.map((ticket) => (
              <TicketItem key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TicketsPage;
