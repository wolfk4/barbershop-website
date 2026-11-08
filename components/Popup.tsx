'use client'
 
interface PopupProps {
  message: string;
  onClose: () => void;
  buttonText?: string;
}
 
export default function Popup({ message, onClose, buttonText = "OK" }: PopupProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-900">{message}</p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-black px-4 py-3 font-bold uppercase tracking-wide text-white transition hover:bg-gray-800"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
