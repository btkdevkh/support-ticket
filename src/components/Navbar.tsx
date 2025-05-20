import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center bg-white p-4 sticky top-0 shadow-md">
      <Link href="/" className="text-lg text-blue-700 font-bold">
        SupportTicket
      </Link>

      <div className="flex items-center gap-3">
        <div>
          <Link href="/tickets/new">Ouvrir un Ticket</Link>
        </div>
        <div>
          <Link href="/tickets">Mes Tickets</Link>
        </div>

        <div>
          <Link href="/login">S'identifier</Link>
        </div>
        <div>
          <Link href="/register" className="bg-blue-700 text-white px-3 py-3">
            S'enregistrer
          </Link>
        </div>
        <div>
          <Link href="#" className="bg-red-700 text-white px-3 py-3">
            Déconnexion
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
