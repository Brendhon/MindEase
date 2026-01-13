"use client";

import { DialogPanel, DialogTitle, Dialog as HeadlessDialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment, ReactNode, useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { styles, getContrastClasses, getTransitionClasses } from "./dialog-styles";

/**
 * Dialog Component - MindEase
 * Accessible modal dialog with cognitive accessibility features
 */
export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Prevent closing by clicking outside or pressing ESC */
  preventClose?: boolean;
  "data-testid"?: string;
}

export function Dialog({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  preventClose = false,
  "data-testid": dataTestId = "dialog" 
}: DialogProps) {
  // Use cognitive settings hook for automatic accessibility class generation
  // These classes automatically update when user preferences change
  const { 
    settings, 
    spacingClasses, // Recalculates when settings.spacing changes
    fontSizeClasses, // Recalculates when settings.fontSize changes
  } = useCognitiveSettings();

  // Generate contrast classes with dialog-specific logic
  const contrastClasses = useMemo(
    () => getContrastClasses(settings.contrast),
    [settings.contrast]
  );

  // Generate transition classes based on animation preference
  const transitionClasses = useMemo(
    () => getTransitionClasses(settings.animations),
    [settings.animations]
  );

  // Generate container classes with spacing preference
  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.padding),
    [spacingClasses.padding]
  );

  // Generate panel classes with spacing and contrast
  const panelClasses = useMemo(
    () => cn(
      styles.panel,
      spacingClasses.padding, // Dynamically updates based on settings.spacing
      contrastClasses.panel
    ),
    [spacingClasses.padding, contrastClasses.panel]
  );

  // Generate title classes with fontSize and contrast
  const titleClasses = useMemo(
    () => cn(
      styles.title,
      fontSizeClasses.lg, // Dynamically updates based on settings.fontSize
      contrastClasses.title,
      "mb-4" // Margin bottom for spacing
    ),
    [fontSizeClasses.lg, contrastClasses.title]
  );

  // Handle close - prevent if preventClose is true
  const handleClose = preventClose ? () => {} : onClose;

  return (
    <Transition show={isOpen} as={Fragment}>
      <HeadlessDialog onClose={handleClose} className={styles.dialog} data-testid={dataTestId}>
        <TransitionChild
          as={Fragment}
          enter={transitionClasses.backdrop.enter}
          enterFrom={transitionClasses.backdrop.enterFrom}
          enterTo={transitionClasses.backdrop.enterTo}
          leave={transitionClasses.backdrop.leave}
          leaveFrom={transitionClasses.backdrop.leaveFrom}
          leaveTo={transitionClasses.backdrop.leaveTo}
        >
          <div className={styles.backdrop} aria-hidden="true" data-testid={`${dataTestId}-backdrop`} />
        </TransitionChild>

        <div className={containerClasses}>
          <TransitionChild
            as={Fragment}
            enter={transitionClasses.panel.enter}
            enterFrom={transitionClasses.panel.enterFrom}
            enterTo={transitionClasses.panel.enterTo}
            leave={transitionClasses.panel.leave}
            leaveFrom={transitionClasses.panel.leaveFrom}
            leaveTo={transitionClasses.panel.leaveTo}
          >
            <DialogPanel className={panelClasses} data-testid={`${dataTestId}-panel`}>
              <DialogTitle className={titleClasses} data-testid={`${dataTestId}-title`}>
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

