import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { RoughBox } from "../components/RoughBox";

type Props = {
  sender: string;
  bookId: string | null;
  onDismiss: () => void;
};

export function GiftBackPrompt({ sender, bookId, onDismiss }: Props) {
  const router = useRouter();

  const sendGiftBack = () => {
    if (bookId) {
      void fetch("/api/events/gift-back-clicked", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      }).catch(() => {});
    }
    router.push("/compose");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-40 flex items-center justify-center px-5 bg-ink/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="relative bg-paper p-8 max-w-md w-full text-center"
        style={{ transform: "rotate(-0.6deg)" }}
      >
        <RoughBox seed={222} roughness={1.9} strokeWidth={1.8} />
        <h2 className="font-display text-3xl mb-2">Loved this?</h2>
        <p className="font-hand text-lg text-ink/75 mb-6">
          Send {sender || "them"} a little gift back.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={sendGiftBack}
            className="font-ui bg-ink text-paper px-5 py-3 rounded-full hover:bg-sketchPink pencil-cursor transition-colors"
          >
            Make a card →
          </button>
          <button
            type="button"
            onClick={onDismiss}
            className="font-ui text-ink/55 hover:text-ink"
          >
            Maybe later
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
