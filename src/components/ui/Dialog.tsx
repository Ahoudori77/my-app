import { ReactNode } from 'react';

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  children: ReactNode;
};

export default function Dialog({ open, onOpenChange, children }: DialogProps) {
  return open ? (
    <div className="dialog-backdrop" onClick={onOpenChange}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null;
}
