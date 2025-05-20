"use server";

import { prisma } from "@/lib/prisma";
import { logSentryEvent } from "@/utils/sentry";
import { revalidatePath } from "next/cache";

const createTicket = async (
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> => {
  try {
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
        message: "All fields are required",
      };
    }

    // Create ticket
    const ticket = await prisma.ticket.create({
      data: { subject, description, priority },
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
      message: "Ticket created successfully!",
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
      message: "An error occured while creating the ticket",
    };
  }
};

const getTickets = async () => {
  try {
    // Get tickets
    const tickets = await prisma.ticket.findMany({
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
    console.log("Error: ", error);

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
      // Sentry stuffs
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

export { createTicket, getTickets, getTicketById };
