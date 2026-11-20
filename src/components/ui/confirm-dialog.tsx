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
        'bg-white border border-[#E7E5DF] rounded-2xl p-0 max-w-md w-full shadow-2xl',
        'backdrop:bg-[#142544]/40 backdrop:backdrop-blur-xs',
        'text-[#17243A]'
      )}
    >
      <div className="p-6">
        <h3 className="text-lg font-heading font-bold text-[#142544] mb-2">{title}</h3>
        {description && <p className="text-[#647084] text-sm leading-relaxed">{description}</p>}
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#E7E5DF] bg-[#F8F7F4]/50 rounded-b-2xl">
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
