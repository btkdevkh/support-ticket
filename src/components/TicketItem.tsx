import { Ticket } from "@/generated/prisma";
import {
  getPriorityClass,
  getPriorityTranslateFR,
  getStatusClass,
  getStatusTranslateFR,
} from "@/utils/ui";
import Link from "next/link";

type TicketItemProps = { ticket: Ticket };

const TicketItem = ({ ticket }: TicketItemProps) => {
  const isClosed = ticket.status === "Closed";

  return (
    <div
      className={`flex justify-between items-center bg-white shadow border border-gray-200 p-6 ${
        isClosed ? "opacity-50" : ""
      }`}
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
          État:{" "}
          <span className={getStatusClass(ticket.status)}>
            {getStatusTranslateFR(ticket.status)}
          </span>
          {", "}
          Priorité:{" "}
          <span className={getPriorityClass(ticket.priority)}>
            {getPriorityTranslateFR(ticket.priority)}
          </span>
        </div>
        <Link
          href={`/tickets/${ticket.id}`}
          className={`inline-block mt-2 text-sm px-3 py-2 transition text-center ${
            isClosed
              ? "bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Visualiser le ticket
        </Link>
      </div>
    </div>
  );
};

export default TicketItem;
