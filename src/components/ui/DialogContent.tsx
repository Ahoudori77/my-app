import { ReactNode } from 'react';

type DialogContentProps = {
  children: ReactNode;
};

export default function DialogContent({ children }: DialogContentProps) {
  return <div className="dialog-content">{children}</div>;
}
