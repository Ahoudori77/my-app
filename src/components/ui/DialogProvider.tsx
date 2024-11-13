"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';
import Dialog from './Dialog';

// ダイアログのコンテキスト
type DialogContextType = {
  isOpen: boolean;
  openDialog: (content: ReactNode) => void;
  closeDialog: () => void;
  content: ReactNode;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);

  const openDialog = (dialogContent: ReactNode) => {
    setContent(dialogContent);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
    setContent(null);
  };

  return (
    <DialogContext.Provider value={{ isOpen, openDialog, closeDialog, content }}>
      {children}
      <Dialog open={isOpen} onOpenChange={closeDialog}>
        {content}
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
