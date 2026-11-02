const latency = Number(process.env.MAIL_LATENCY_MS ?? 60);

export const outbox = [];

/**
 * Development mailer. Messages are kept in memory instead of being sent,
 * with a small delay to mimic a real SMTP round trip.
 */
export async function sendConfirmation(ticket, event) {
  await new Promise((resolve) => setTimeout(resolve, latency));
  outbox.push({
    to: ticket.email,
    subject: `Your ticket for ${event.title} (${ticket.ref})`,
    sentAt: new Date().toISOString(),
  });
}
