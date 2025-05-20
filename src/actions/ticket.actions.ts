"use server";

import { getCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { logSentryEvent } from "@/utils/sentry";
import { revalidatePath } from "next/cache";

const createTicket = async (
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      logSentryEvent(
        "Unauthorized : Current user not found",
        "auth",
        {},
        "warning"
      );

      return {
        success: false,
        message: "Absent d'identification de l'utilisateur",
      };
    }

    const subject = formData.get("subject") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

    // Validations
    if (!subject || !description || !priority) {
      logSentryEvent(
        "Validation Error: Missing ticket fields",
        "ticket",
        { subject, description, priority },
        "warning"
      );

      return {
        success: false,
        message: "Veuillez remplir tous les champs",
      };
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        subject,
        description,
        priority,
        user: { connect: { id: currentUser.id } },
      },
    });

    // Sentry stuffs
    logSentryEvent(
      `Ticket was created successfully: ${ticket.id}`,
      "ticket",
      { ticketId: ticket.id },
      "info"
    );

    revalidatePath("/tickets");

    return {
      success: true,
      message: "Ticket crée!",
    };
  } catch (error) {
    console.log("Error: ", error);

    logSentryEvent(
      "An error occured while creating the ticket",
      "ticket",
      {
        formData: Object.fromEntries(formData.entries()),
      },
      "error",
      error
    );

    return {
      success: false,
      message: "Une erreur s'est produit, veuillez rééssayer plus tard!",
    };
  }
};

const getTickets = async () => {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      logSentryEvent(
        "Unauthorized : Current user not found",
        "auth",
        {},
        "warning"
      );

      return [];
    }

    // Get tickets
    const tickets = await prisma.ticket.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    });

    // Sentry stuffs
    logSentryEvent(
      `Fetched ticket list`,
      "ticket",
      { count: tickets.length },
      "info"
    );

    return tickets;
  } catch (error) {
    logSentryEvent(
      "An error occured while fetching the tickets",
      "ticket",
      {},
      "error",
      error
    );

    return [];
  }
};

const getTicketById = async (id: number) => {
  try {
    // Get ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: +id },
    });

    if (!ticket) {
      logSentryEvent(`Ticket not found`, "ticket", { ticketId: id }, "warning");
    }

    return ticket;
  } catch (error) {
    console.log("Error: ", error);

    logSentryEvent(
      "An error occured while fetching the ticket",
      "ticket",
      { ticketId: id },
      "error",
      error
    );

    return null;
  }
};

const closeTicket = async (
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
    const ticketId = formData.get("ticketId");

    if (!ticketId) {
      logSentryEvent(`Ticket ID not found`, "ticket", {}, "warning");

      return {
        success: false,
        message: "Absent d'identification du ticket",
      };
    }

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      logSentryEvent(`User not found`, "auth", {}, "warning");

      return {
        success: false,
        message: "Absent d'identification de l'utilisateur",
      };
    }

    // Get ticket
    const ticket = await prisma.ticket.findUnique({
      where: { id: +ticketId },
    });

    if (!ticket || ticket.userId !== currentUser.id) {
      logSentryEvent(
        `Ticket not found`,
        "ticket",
        { ticketId, userId: currentUser.id },
        "warning"
      );

      return {
        success: false,
        message: "Absent d'identification du ticket",
      };
    }

    await prisma.ticket.update({
      where: {
        id: ticket.id,
      },
      data: {
        status: "Closed",
      },
    });

    revalidatePath("/tickets");
    revalidatePath(`/tickets/${ticketId}`);

    return {
      success: true,
      message: "Le ticket a bien été fermé!",
    };
  } catch (error) {
    logSentryEvent(
      "An error occured while closing the ticket",
      "ticket",
      {},
      "error",
      error
    );

    return {
      success: false,
      message: "Une erreur s'est produit, veuillez rééssayer plus tard!",
    };
  }
};

export { createTicket, getTickets, getTicketById, closeTicket };
