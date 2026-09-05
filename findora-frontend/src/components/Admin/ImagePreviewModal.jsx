import { X } from "lucide-react";

export function ImagePreviewModal({ src, title, onClose }) {
  if (!src) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-5 py-3 text-white">
          <p className="text-sm font-semibold truncate max-w-xs sm:max-w-md">
            {title || "Image Preview"}
          </p>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            title="Close preview (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Image Container preserving original aspect ratio */}
        <div className="flex items-center justify-center p-2 sm:p-4 bg-slate-950/50 overflow-auto">
          <img
            src={src}
            alt={title || "Preview"}
            className="max-h-[75vh] max-w-[85vw] object-contain rounded-lg shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default ImagePreviewModal;
