"use client";

import { DialogPanel, DialogTitle, Dialog as HeadlessDialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

/**
 * Dialog Component - MindEase
 * Accessible modal dialog with cognitive accessibility features
 */
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <HeadlessDialog onClose={onClose} className="relative z-50">
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </TransitionChild>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md rounded-lg bg-surface-primary p-6 shadow-lg">
              <DialogTitle className="text-lg font-semibold text-text-primary mb-4">
                {title}
              </DialogTitle>
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}

