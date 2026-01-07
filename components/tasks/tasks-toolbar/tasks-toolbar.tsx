"use client";

import { useState } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Button } from "@/components/ui/button";
import { TaskTimer } from "@/components/tasks/task-timer";
import { Plus } from "lucide-react";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

/**
 * TasksToolbar Component - MindEase
 * Toolbar with add button and focus timer
 */
export interface TasksToolbarProps {
  /** Handler for add task button */
  onAddTask: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksToolbar({ onAddTask, "data-testid": testId }: TasksToolbarProps) {
  const [showTimer, setShowTimer] = useState(false);
  const { spacingClasses, textDetail } = useCognitiveSettings();

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <div className={containerClasses} data-testid={testId || "tasks-toolbar"}>
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          onClick={onAddTask}
          aria-label={textDetail.getText("button_add")}
          data-testid={testId ? `${testId}-add-button` : "tasks-toolbar-add-button"}
        >
          <Button.Icon icon={Plus} position="left" size="md" />
          <Button.Text>{textDetail.getText("button_add")}</Button.Text>
        </Button>
        
        <Button
          variant="secondary"
          size="md"
          onClick={() => setShowTimer(!showTimer)}
          aria-label={showTimer ? "Hide timer" : "Show timer"}
          data-testid={testId ? `${testId}-timer-toggle` : "tasks-toolbar-timer-toggle"}
        >
          <Button.Text>{showTimer ? "Hide Timer" : "Show Timer"}</Button.Text>
        </Button>
      </div>

      {showTimer && (
        <div className={styles.timer} data-testid={testId ? `${testId}-timer` : "tasks-toolbar-timer"}>
          <TaskTimer
            initialMinutes={25}
            onComplete={() => {
              // Could show a notification or feedback here
              console.log("Timer completed");
            }}
          />
        </div>
      )}
    </div>
  );
}

TasksToolbar.displayName = "TasksToolbar";

/**
 * TasksToolbar Styles - MindEase
 * Centralized styles for tasks toolbar component
 */

export const styles = {
  container: "flex flex-col",
  actions: "flex gap-3",
  timer: "mt-4",
} as const;

