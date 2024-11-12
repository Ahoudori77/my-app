// src/components/Dashboard/Modal.tsx
import Dialog from "@/components/ui/Dialog";
import DialogOverlay from "@/components/ui/DialogOverlay";
import DialogContent from "@/components/ui/DialogContent";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay />
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}
