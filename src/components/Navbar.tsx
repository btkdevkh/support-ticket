import { getCurrentUser } from "@/lib/current-user";
import Link from "next/link";
import Image from "next/image";
import DisconnectButton from "./DisconnectButton";

const Navbar = async () => {
  const currentUser = await getCurrentUser();

  return (
    <nav className="flex justify-between items-center bg-white p-4 sticky top-0 shadow-md">
      <div className="flex gap-2">
        <Image src="/circuit.png" width={30} height={20} alt="Logo" priority />
        <Link href="/" className="text-lg text-blue-700 font-bold">
          Ticket
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {currentUser && (
          <>
            <div>
              <Link href="/tickets/new">Créer</Link>
            </div>
            <div>
              <Link href="/tickets">Tickets</Link>
            </div>
            <div>
              <DisconnectButton />
            </div>
          </>
        )}

        {!currentUser && (
          <>
            <div>
              <Link href="/login">S'identifier</Link>
            </div>
            <div>
              <Link
                href="/register"
                className="bg-blue-700 text-white px-3 py-3"
              >
                S'enregistrer
              </Link>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
