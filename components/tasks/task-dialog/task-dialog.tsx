"use client";

import { FormInput } from "@/components/form/form-input";
import { InputField } from "@/components/form/input/input-field";
import { InputLabel } from "@/components/form/input/input-label";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useFeedback } from "@/hooks/useFeedback";
import { useTextDetail } from "@/hooks/useTextDetail";
import { Subtask, Task } from "@/models/Task";
import { taskDialogOutputSchema, taskDialogSchema, TaskDialogFormData } from "@/schemas/task-dialog.schema";
import { cn } from "@/utils/ui";
import { generateRandomUUID } from "@/utils/uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

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

  const isEditing = !!task;

  // Initialize form with react-hook-form
  const methods = useForm({
    resolver: zodResolver(taskDialogSchema),
    defaultValues: {
      title: "",
      description: "",
      subtasks: [],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "subtasks",
  });

  const resetForm = useCallback((task?: Task) => {
    methods.reset({
      title: task?.title || "",
      description: task?.description || "",
      subtasks: task?.subtasks || [],
    });
  }, [methods]);

  // Initialize form when task changes
  useEffect(() => {
    isOpen && resetForm(task);
  }, [isOpen, task, resetForm]);

  const handleAddSubtask = useCallback(() => {
    append({
      id: generateRandomUUID(),
      title: "",
      completed: false,
      order: fields.length,
    });
    info("tasks_checklist_added");
  }, [append, fields.length, info]);

  const handleRemoveSubtask = useCallback(
    (index: number) => {
      remove(index);
      info("tasks_checklist_removed");
    },
    [remove, info]
  );

  const handleSave = useCallback(
    (data: TaskDialogFormData) => {
      // Transform data using output schema
      const result = taskDialogOutputSchema.safeParse(data);

      if (!result.success) {
        // This should not happen as zodResolver validates before submit
        console.error("Validation error:", result.error);
        return;
      }

      onSave({
        title: result.data.title,
        description: result.data.description,
        subtasks: result.data.subtasks,
      });

      // Reset form
      resetForm();
      onClose();
    },
    [onSave, onClose, resetForm]
  );

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

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
      title={getText(isEditing ? "tasks_dialog_edit_title" : "tasks_dialog_create_title")}
      data-testid={testId || "task-dialog"}
    >
      <FormProvider {...methods}>
        <form
          className={formClasses}
          onSubmit={methods.handleSubmit(handleSave)}
        >
          {/* Title */}
          <FormInput
            name="title"
            label={getText("tasks_dialog_field_title")}
            type="text"
            placeholder={getText("tasks_dialog_field_title_placeholder")}
            required
          />

          {/* Description */}
          <FormInput
            name="description"
            label={getText("tasks_dialog_field_description")}
            as="textarea"
            placeholder={getText("tasks_dialog_field_description_placeholder")}
            rows={3}
          />

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

            {fields.length > 0 && (
              <div className={checklistClasses}>
                {fields.map((field, index) => (
                  <div key={field.id} className={styles.checklistItem}>
                    <InputField
                      type="text"
                      {...methods.register(`subtasks.${index}.title`)}
                      placeholder={`${getText("tasks_checklist_placeholder")} ${index + 1}`}
                      data-testid={`task-dialog-subtask-${field.id}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSubtask(index)}
                      aria-label={getText("tasks_checklist_remove_aria")}
                      data-testid={`task-dialog-remove-subtask-${field.id}`}
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
      </FormProvider>
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
