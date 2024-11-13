"use client";

import { ReactNode } from 'react';

type DialogProps = {
  open: boolean;
  onOpenChange: () => void;
  children: ReactNode;
};

export default Dialog;

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return open ? (
    <div className="dialog-backdrop" onClick={onOpenChange}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  ) : null;
}

export function DialogContent({ children }: { children: ReactNode }) {
  return <div className="dialog-content">{children}</div>;
}

export function DialogHeader({ children }: { children: ReactNode }) {
  return <div className="dialog-header">{children}</div>;
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return <div className="dialog-footer">{children}</div>;
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return <h2 className="dialog-title">{children}</h2>;
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return <p className="dialog-description">{children}</p>;
}