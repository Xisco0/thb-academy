'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  isLoading = false,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        'bg-navy-800 border border-navy-700 rounded-xl p-0 max-w-md w-full',
        'backdrop:bg-black/60 backdrop:backdrop-blur-sm',
        'text-navy-100'
      )}
    >
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        {description && <p className="text-navy-300 text-sm">{description}</p>}
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-navy-700">
        <Button variant="ghost" onClick={onClose} disabled={isLoading}>
          {cancelLabel}
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
