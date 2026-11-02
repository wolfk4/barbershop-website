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
        className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-gray-900">{message}</p>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
