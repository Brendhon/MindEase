"use client";

import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      completed: initialTask?.completed || false,
    });
    setTitle("");
    setDescription("");
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? "Edit Task" : "Create Task"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          autoFocus
        />
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="textarea"
        />
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

