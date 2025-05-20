import { getTickets } from "@/actions/ticket.actions";
import { getPriorityClass, getPriorityTranslateFR } from "@/utils/ui";
import Link from "next/link";

const TicketsPage = async () => {
  const tickets = await getTickets();
  console.log(tickets);

  return (
    <>
      <main className="min-h-screen bg-blue-50 p-8">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Support Tickets
        </h1>

        {tickets.length === 0 ? (
          <p className="text-center text-gray-600">Il n'y a pas de tickets</p>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex justify-between items-center bg-white shadow border border-gray-200 p-6"
              >
                {/* Left side */}
                <div>
                  <h2 className="text-xl font-semibold text-blue-600">
                    {ticket.subject}
                  </h2>
                </div>

                {/* Right side */}
                <div className="text-right space-y-2">
                  <div className="text-sm- text-gray-500 text-center">
                    Priorité:{" "}
                    <span className={getPriorityClass(ticket.priority)}>
                      {getPriorityTranslateFR(ticket.priority)}
                    </span>
                  </div>
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="inline-block mt-2 bg-blue-600 text-white text-sm px-3 py-2 hover:bg-blue-700 transition text-center"
                  >
                    Visualiser le ticket
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default TicketsPage;
