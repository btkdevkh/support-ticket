import Image from "next/image";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-6 p-3">
      <Image src="/circuit.png" width={100} height={100} alt="Logo" priority />

      <h1 className="text-blue-700 text-2xl">Bienvenue au Support Ticket</h1>

      <p className="text-center">
        Une première et simple d'un système de Support de Ticket.
      </p>

      <div className="flex flex-col gap-2 animate-slide opacity-0 text-center">
        <Link href="/tickets/new" className="bg-blue-700 p-3 text-white">
          Ouvrir un Ticket
        </Link>
        <Link href="/tickets" className="bg-blue-200 p-3 text-black">
          Visualiser des Tickets
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
