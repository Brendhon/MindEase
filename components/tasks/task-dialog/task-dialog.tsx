"use client";

import { Input } from "@/components/form/input";
import { InputError } from "@/components/form/input/input-error";
import { InputField } from "@/components/form/input/input-field";
import { InputLabel } from "@/components/form/input/input-label";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useFeedback } from "@/hooks/useFeedback";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { Subtask, Task } from "@/models/Task";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { generateRandomUUID } from "@/utils/uuid";
import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * TaskDialog Component - MindEase
 * Dialog for creating or editing tasks
 */
export interface TaskDialogProps {
  /** Whether dialog is open */
  isOpen: boolean;

  /** Callback when dialog is closed */
  onClose: () => void;

  /** Task to edit (undefined for new task) */
  task?: Task;

  /** Callback when task is saved */
  onSave: (taskData: {
    title: string;
    description?: string;
    subtasks?: Subtask[];
  }) => void;

  /** Test ID for testing */
  "data-testid"?: string;
}

export function TaskDialog({
  isOpen,
  onClose,
  task,
  onSave,
  "data-testid": testId,
}: TaskDialogProps) {
  const { spacingClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();
  const { info } = useFeedback();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [titleError, setTitleError] = useState("");

  const isEditing = !!task;

  // Initialize form when task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || "");
        setDescription(task.description || "");
        setSubtasks(task.subtasks || []);
      } else {
        setTitle("");
        setDescription("");
        setSubtasks([]);
      }
      setTitleError("");
    }
  }, [isOpen, task]);

  const handleAddSubtask = useCallback(() => {
    setSubtasks((prevSubtasks) => {
      const newSubtask: Subtask = {
        id: generateRandomUUID(),
        title: "",
        completed: false,
        order: prevSubtasks.length,
      };
      return [...prevSubtasks, newSubtask];
    });
    info("tasks_checklist_added");
  }, [info]);

  const handleRemoveSubtask = useCallback((id: string) => {
    setSubtasks((prevSubtasks) => prevSubtasks.filter((st) => st.id !== id));
    info("tasks_checklist_removed");
  }, [info]);

  const handleSubtaskChange = useCallback((id: string, title: string) => {
    setSubtasks((prevSubtasks) => prevSubtasks.map((st) => (st.id === id ? { ...st, title } : st)));
  }, [info]);

  const handleSave = useCallback(() => {
    // Validate
    if (!title.trim()) {
      setTitleError(getText("tasks_dialog_field_title"));
      return;
    }

    // Filter out empty subtasks
    const validSubtasks = subtasks
      .filter((st) => st.title.trim())
      .map((st, index) => ({
        ...st,
        order: index,
      }));

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      subtasks: validSubtasks,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setSubtasks([]);
    setTitleError("");
    onClose();
  }, [title, description, subtasks, onSave, onClose, getText]);

  const handleCancel = useCallback(() => {
    setTitle("");
    setDescription("");
    setSubtasks([]);
    setTitleError("");
    onClose();
  }, [onClose]);

  const dialogTitle = useMemo(() => {
    return isEditing
      ? getText("tasks_dialog_edit_title")
      : getText("tasks_dialog_create_title");
  }, [isEditing, getText]);

  const formClasses = useMemo(
    () => cn(styles.form, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const checklistClasses = useMemo(
    () => cn(styles.checklist, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleCancel}
      title={dialogTitle}
      data-testid={testId || "task-dialog"}
    >
      <form
        className={formClasses}
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Title */}
        <Input>
          <InputLabel htmlFor="task-title">
            {getText("tasks_dialog_field_title")}
          </InputLabel>
          <InputField
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
            }}
            placeholder={getText("tasks_dialog_field_title_placeholder")}
            required
            data-testid="task-dialog-title-input"
          />
          {titleError && <InputError>{titleError}</InputError>}
        </Input>

        {/* Description */}
        <Input>
          <InputLabel htmlFor="task-description">
            {getText("tasks_dialog_field_description")}
          </InputLabel>
          <InputField
            id="task-description"
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={getText("tasks_dialog_field_description_placeholder")}
            rows={3}
            data-testid="task-dialog-description-input"
          />
        </Input>

        {/* Checklist */}
        <div className={styles.checklistSection}>
          <div className={styles.checklistHeader}>
            <InputLabel>
              {getText("tasks_dialog_field_checklist")}
            </InputLabel>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleAddSubtask}
              data-testid="task-dialog-add-subtask"
            >
              <Button.Icon icon={Plus} position="left" />
              <Button.Text>
                {getText("tasks_checklist_add")}
              </Button.Text>
            </Button>
          </div>

          {subtasks.length > 0 && (
            <div className={checklistClasses}>
              {subtasks.map((subtask, index) => (
                <div key={subtask.id} className={styles.checklistItem}>
                  <InputField
                    type="text"
                    value={subtask.title}
                    onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                    placeholder={`${getText("tasks_checklist_placeholder")} ${index + 1}`}
                    data-testid={`task-dialog-subtask-${subtask.id}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    aria-label={getText("tasks_checklist_remove_aria")}
                    data-testid={`task-dialog-remove-subtask-${subtask.id}`}
                  >
                    <Button.Icon icon={X} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button
            type="button"
            variant="ghost"
            onClick={handleCancel}
            data-testid="task-dialog-cancel"
          >
            <Button.Text>
              {getText("button_cancel")}
            </Button.Text>
          </Button>
          <Button
            type="submit"
            variant="primary"
            data-testid="task-dialog-save"
          >
            <Button.Text>
              {isEditing
                ? getText("button_save")
                : getText("button_create")}
            </Button.Text>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

TaskDialog.displayName = "TaskDialog";

const styles = {
  form: "flex flex-col",
  checklistSection: "flex flex-col",
  checklistHeader: "flex items-center justify-between mb-2",
  checklist: "flex flex-col",
  checklistItem: "flex items-center gap-2",
  actions: "flex justify-end gap-2 mt-4",
} as const;
