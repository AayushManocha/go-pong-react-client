import { useEffect, useState } from "react";

export default function PlayerInviteModal({ open }: { open: boolean }) {
  const [copied, setCopied] = useState(false);
  const [internalOpen, setInternalOpen] = useState(open);

  useEffect(() => {
    setInternalOpen(open);
  }, [open]);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setInternalOpen(false);
  };

  if (!internalOpen) return null;

  return (
    <div className="fixed h-full w-full backdrop-blur-sm bg-op text-[var(--secondary-color)]  flex items-center justify-center z-50">
      <div className="bg-[var(--primary-color)] rounded-2xl shadow-xl p-6 px-16 border-1 border-[var(--secondary-color)] flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Share this link</h2>
        <span className="text-white">{window.location.href}</span>
        <button
          onClick={handleCopy}
          className="mt-2 bg-[var(--primary-color)] text-[var(--secondary-color)] border-[var(--secondary-color)] border-2 py-2 px-4 rounded-lg font-semibold  hover:translate-y-1 cursor-pointer"
        >
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
