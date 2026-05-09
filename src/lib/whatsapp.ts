/**
 * Build a wa.me deep link to the admin's WhatsApp with a prefilled message
 * containing payment-confirmation context. Returns null if the number env
 * var isn't configured, so callers can hide the CTA gracefully.
 */
export function buildAdminWhatsAppLink(args: {
  noteId: string;
  sender: string;
  recipient: string;
  key: string;
}): string | null {
  const number = (process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER ?? "")
    .replace(/[^0-9]/g, "");
  if (!number) return null;

  const message = [
    `Hi! I just submitted a sketch note and want to confirm payment.`,
    ``,
    `Note ID: ${args.noteId}`,
    `From: ${args.sender}`,
    `To: ${args.recipient}`,
    `Key: ${args.key}`,
    ``,
    `Payment proof attached above ↑`,
  ].join("\n");

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
