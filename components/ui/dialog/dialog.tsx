"use client";

import { Fragment, ReactNode } from "react";
import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";

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
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-150"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-150"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessDialog.Panel className="w-full max-w-md rounded-lg bg-surface-primary p-6 shadow-lg">
              <HeadlessDialog.Title className="text-lg font-semibold text-text-primary mb-4">
                {title}
              </HeadlessDialog.Title>
              {children}
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}

