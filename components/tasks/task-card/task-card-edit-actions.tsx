"use client";

import { Button } from "@/components/ui/button";
import { useTextDetail } from "@/hooks/accessibility";
import type { TaskCardEditActionsProps } from "@/models/task-card-props";
import { Edit, Trash2 } from "lucide-react";

/**
 * TaskCardEditActions Component - MindEase
 * Displays edit and delete action buttons
 */
export function TaskCardEditActions({
  task,
  onEdit,
  onDelete,
  "data-testid": testId,
}: TaskCardEditActionsProps) {
  const { getText } = useTextDetail();

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onEdit}
        aria-label={getText("tasks_action_edit_aria")}
        data-testid={testId || `task-card-edit-${task.id}`}
      >
        <Button.Icon icon={Edit} position="left" />
        <Button.Text>
          {getText("tasks_action_edit")}
        </Button.Text>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        aria-label={getText("tasks_action_delete_aria")}
        data-testid={testId || `task-card-delete-${task.id}`}
      >
        <Button.Icon icon={Trash2} position="left" />
        <Button.Text>
          {getText("tasks_action_delete")}
        </Button.Text>
      </Button>
    </>
  );
}

TaskCardEditActions.displayName = "TaskCardEditActions";
