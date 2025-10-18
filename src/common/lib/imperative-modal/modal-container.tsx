import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ModalInstance } from "./types";
import { useFocusTrap } from "./hooks/use-focus-trap";
import { useScrollLock } from "./hooks/use-scroll-lock";
import { useSwipeToClose } from "./hooks/use-swipe-to-close";

interface ModalContainerProps {
  instance: ModalInstance;
  onClose: (result?: unknown) => void;
}

export function ModalContainer({ instance, onClose }: ModalContainerProps) {
  const modalRef = useFocusTrap();
  useScrollLock(true);

  const swipeHandlers = useSwipeToClose({
    onClose: () => onClose(),
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const getPositionClasses = () => {
    const position = instance.options.position || 'center';
    
    switch (position) {
      case 'top':
        return 'fixed top-12 left-1/2 -translate-x-1/2 pointer-events-none';
      case 'center':
      default:
        return 'fixed inset-0 flex items-center justify-center pointer-events-none';
    }
  };

  const getContentAnimation = () => {
    const position = instance.options.position || 'center';
    
    switch (position) {
      case 'top':
        return {
          initial: { opacity: 0, scale: 0.95, y: -20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: -20 }
        };
      case 'center':
      default:
        return {
          initial: { opacity: 0, scale: 0.95, y: 20 },
          animate: { opacity: 1, scale: 1, y: 0 },
          exit: { opacity: 0, scale: 0.95, y: 20 }
        };
    }
  };

  const contentAnimation = getContentAnimation();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50" style={{ zIndex: instance.zIndex }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="absolute inset-0 bg-black/50"
          onClick={() => onClose()}
        />
        <motion.div
          ref={modalRef}
          initial={contentAnimation.initial}
          animate={contentAnimation.animate}
          exit={contentAnimation.exit}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={`${getPositionClasses()}`}
          {...swipeHandlers}
        >
          <div className={`relative bg-background rounded-lg shadow-lg max-w-[90vw] max-h-[90vh] overflow-hidden pointer-events-auto ${instance.options.className || ""}`}>
            {instance.options.content}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
