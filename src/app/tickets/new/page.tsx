import { getCurrentUser } from "@/lib/current-user";
import NewTicketForm from "./ticket-form";
import { redirect } from "next/navigation";

const NewTicketPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex flex-col justify-center items-center p-3">
      <NewTicketForm />
    </main>
  );
};

export default NewTicketPage;
