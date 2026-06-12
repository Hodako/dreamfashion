import { Plus } from "lucide-react";

export function FAB({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="fixed mobile-fab-bottom right-3 z-20 size-10 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-lg shadow-primary/25 beveled-button active:scale-95 transition">
      <Plus className="size-4.5" />
    </button>
  );
}
