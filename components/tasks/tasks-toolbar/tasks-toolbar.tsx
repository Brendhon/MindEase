"use client";

import { Button } from "@/components/ui/button";
import { useTextDetail } from "@/hooks/useTextDetail";
import { Plus } from "lucide-react";

/**
 * TasksToolbar Component - MindEase
 * Toolbar with "New Task" button
 */
export interface TasksToolbarProps {
  /** Callback when "New Task" button is clicked */
  onNewTask: () => void;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function TasksToolbar({ onNewTask, "data-testid": testId }: TasksToolbarProps) {
  const { getText } = useTextDetail();

  return (
    <div className={styles.container} data-testid={testId || "tasks-toolbar"}>
      <Button
        variant="primary"
        onClick={onNewTask}
        aria-label={getText("tasks_new_aria")}
        data-testid="tasks-toolbar-new-button"
      >
        <Button.Icon icon={Plus} position="left" />
        <Button.Text>
          {getText("tasks_new")}
        </Button.Text>
      </Button>
    </div>
  );
}

TasksToolbar.displayName = "TasksToolbar";

const styles = {
  container: "flex justify-end",
} as const;
