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
  "data-testid"?: string;
}

export function Dialog({ isOpen, onClose, title, children, "data-testid": dataTestId = "dialog" }: DialogProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <HeadlessDialog onClose={onClose} className={styles.dialog} data-testid={dataTestId}>
        <TransitionChild
          as={Fragment}
          enter={styles.backdropEnter}
          enterFrom={styles.backdropEnterFrom}
          enterTo={styles.backdropEnterTo}
          leave={styles.backdropLeave}
          leaveFrom={styles.backdropLeaveFrom}
          leaveTo={styles.backdropLeaveTo}
        >
          <div className={styles.backdrop} aria-hidden="true" data-testid={`${dataTestId}-backdrop`} />
        </TransitionChild>

        <div className={styles.container}>
          <TransitionChild
            as={Fragment}
            enter={styles.panelEnter}
            enterFrom={styles.panelEnterFrom}
            enterTo={styles.panelEnterTo}
            leave={styles.panelLeave}
            leaveFrom={styles.panelLeaveFrom}
            leaveTo={styles.panelLeaveTo}
          >
            <DialogPanel className={styles.panel} data-testid={`${dataTestId}-panel`}>
              <DialogTitle className={styles.title} data-testid={`${dataTestId}-title`}>
                {title}
              </DialogTitle>
              <div data-testid={`${dataTestId}-content`}>{children}</div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}

const styles = {
  dialog: "relative z-50",
  backdrop: "fixed inset-0 bg-black/30",
  container: "fixed inset-0 flex items-center justify-center p-4",
  panel: "w-full max-w-md rounded-lg bg-surface-primary p-6 shadow-lg",
  title: "text-lg font-semibold text-text-primary mb-4",
  backdropEnter: "ease-out duration-150",
  backdropEnterFrom: "opacity-0",
  backdropEnterTo: "opacity-100",
  backdropLeave: "ease-in duration-150",
  backdropLeaveFrom: "opacity-100",
  backdropLeaveTo: "opacity-0",
  panelEnter: "ease-out duration-150",
  panelEnterFrom: "opacity-0 scale-95",
  panelEnterTo: "opacity-100 scale-100",
  panelLeave: "ease-in duration-150",
  panelLeaveFrom: "opacity-100 scale-100",
  panelLeaveTo: "opacity-0 scale-95",
} as const;
