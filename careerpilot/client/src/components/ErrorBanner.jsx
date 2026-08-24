import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export default function ErrorBanner({ message, onClose }) {
  const [show, setShow] = useState(true);

  if (!show) return null;

  const handleClose = () => {
    setShow(false);
    onClose?.();
  };

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-800">{message}</p>
      </div>
      <button
        onClick={handleClose}
        className="text-red-600 hover:text-red-800 flex-shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
