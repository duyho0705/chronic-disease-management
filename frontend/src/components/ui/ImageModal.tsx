import { useEffect } from 'react';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    title?: string;
}

export default function ImageModal({
    isOpen,
    onClose,
    imageUrl,
    title = 'Xem hình ảnh'
}: ImageModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
            {/* Backdrop with heavy blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl max-h-full flex flex-col items-center justify-center z-10 animate-in zoom-in-95 duration-300">
                {/* Close Button - Premium Floating Style */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 md:-right-12 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all group"
                >
                    <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">close</span>
                </button>

                {/* Image Container */}
                <div className="bg-white/5 p-2 rounded-3xl border border-white/20 shadow-2xl overflow-hidden group">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-inner cursor-zoom-out"
                        onClick={onClose}
                    />
                </div>

                {/* Caption / Title */}
                <div className="mt-6 px-6 py-2 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10">
                    <p className="text-white text-sm font-bold tracking-wide italic-none flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        {title}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 flex items-center gap-4">
                    <a
                        href={imageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-black hover:bg-primary hover:text-white transition-all shadow-lg"
                    >
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        Mở trong tab mới
                    </a>
                </div>
            </div>
        </div>
    );
}
