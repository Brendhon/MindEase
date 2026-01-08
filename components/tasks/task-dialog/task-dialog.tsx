"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/form/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Task } from "@/models/Task";

/**
 * Task Dialog Component - MindEase
 * Create/Edit task modal dialog
 */
export interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  initialTask?: Task;
}

export function TaskDialog({ isOpen, onClose, onSubmit, initialTask }: TaskDialogProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [status, setStatus] = useState<number>(initialTask?.status ?? 0);

  // Reset form when dialog opens/closes or initialTask changes
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTask?.title || "");
      setDescription(initialTask?.description || "");
      setStatus(initialTask?.status ?? 0);
    }
  }, [isOpen, initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      status,
    });
    setTitle("");
    setDescription("");
    setStatus(0);
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? "Edit Task" : "Create Task"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input>
          <Input.Label htmlFor="task-title">Title</Input.Label>
          <Input.Field
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </Input>
        <Input>
          <Input.Label htmlFor="task-description">Description</Input.Label>
          <Input.Field
            id="task-description"
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Input>
        <RadioGroup
          value={status.toString()}
          onChange={(value) => setStatus(Number(value))}
          label="Status"
        >
          <RadioGroup.Option value="0" label="To Do" />
          <RadioGroup.Option value="1" label="In Progress" />
          <RadioGroup.Option value="2" label="Done" />
        </RadioGroup>
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="ghost" onClick={onClose}>
            <Button.Text>Cancel</Button.Text>
          </Button>
          <Button type="submit" variant="primary">
            <Button.Text>{initialTask ? "Save" : "Create"}</Button.Text>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

