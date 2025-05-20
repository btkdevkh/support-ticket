import Link from "next/link";
import { FaTicketAlt } from "react-icons/fa";

const HomePage = () => {
  return (
    <main className="container mx-auto">
      <div className="min-h-screen flex flex-col justify-center items-center gap-6">
        <FaTicketAlt className="mx-auto text-red-600" size={60} />

        <h1 className="text-blue-700 text-2xl">
          Bienvenue sur le Support Ticket
        </h1>
        <p>Une première et simple d'un support du système management.</p>

        <div className="flex flex-col gap-2 animate-slide opacity-0 text-center">
          <Link href="/tickets/new" className="bg-blue-700 p-3 text-white">
            Ouvrir un Ticket
          </Link>
          <Link href="/tickets" className="bg-blue-200 p-3 text-black">
            Visualiser des Tickets
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
