"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/form/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Task, Subtask } from "@/models/Task";
import { generateRandomUUID } from "@/utils/uuid";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useFeedback } from "@/hooks/useFeedback";
import { X, Plus } from "lucide-react";
import { cn } from "@/utils/ui";

/**
 * Task Dialog Component - MindEase
 * Create/Edit task modal dialog with intelligent checklist support
 */
export interface TaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  initialTask?: Task;
}

export function TaskDialog({ isOpen, onClose, onSubmit, initialTask }: TaskDialogProps) {
  const { fontSizeClasses, spacingClasses } = useCognitiveSettings();
  const { info } = useFeedback();
  
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [status, setStatus] = useState<number>(initialTask?.status ?? 0);
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialTask?.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [showSubtaskSuggestion, setShowSubtaskSuggestion] = useState(false);

  // Reset form when dialog opens/closes or initialTask changes
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTask?.title || "");
      setDescription(initialTask?.description || "");
      setStatus(initialTask?.status ?? 0);
      setSubtasks(initialTask?.subtasks || []);
      setNewSubtaskTitle("");
      setShowSubtaskSuggestion(false);
    }
  }, [isOpen, initialTask]);

  // Show suggestion to divide task when creating new task without subtasks
  useEffect(() => {
    if (isOpen && !initialTask && title && subtasks.length === 0 && !showSubtaskSuggestion) {
      // Small delay to avoid being too aggressive
      const timer = setTimeout(() => {
        setShowSubtaskSuggestion(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialTask, title, subtasks.length, showSubtaskSuggestion]);

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;

    const newSubtask: Subtask = {
      id: generateRandomUUID(),
      title: newSubtaskTitle.trim(),
      completed: false,
      order: subtasks.length,
    };

    setSubtasks([...subtasks, newSubtask]);
    setNewSubtaskTitle("");
    setShowSubtaskSuggestion(false);
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== subtaskId).map((st, index) => ({ ...st, order: index })));
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setSubtasks(
      subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    );
  };

  const handleDismissSuggestion = () => {
    setShowSubtaskSuggestion(false);
  };

  const handleAcceptSuggestion = () => {
    setShowSubtaskSuggestion(false);
    // Focus on subtask input
    document.getElementById("subtask-input")?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description: description || undefined,
      status,
      subtasks: subtasks.length > 0 ? subtasks : undefined,
    });
    setTitle("");
    setDescription("");
    setStatus(0);
    setSubtasks([]);
    setNewSubtaskTitle("");
    setShowSubtaskSuggestion(false);
    onClose();
  };

  const sortedSubtasks = useMemo(() => {
    return [...subtasks].sort((a, b) => a.order - b.order);
  }, [subtasks]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? "Editar Tarefa" : "Criar Tarefa"}
    >
      <form onSubmit={handleSubmit} className={cn("flex flex-col", spacingClasses.gap)}>
        <Input>
          <Input.Label htmlFor="task-title">Título</Input.Label>
          <Input.Field
            id="task-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
          />
        </Input>

        <Input>
          <Input.Label htmlFor="task-description">Descrição</Input.Label>
          <Input.Field
            id="task-description"
            as="textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Input>

        {/* Subtask suggestion */}
        {showSubtaskSuggestion && (
          <div className={cn("p-3 rounded-md bg-surface-secondary border border-border-subtle", spacingClasses.gap)}>
            <p className={cn("text-text-secondary", fontSizeClasses.sm)}>
              Deseja dividir essa tarefa em etapas menores?
            </p>
            <div className="flex gap-2">
              <Button type="button" variant="primary" size="sm" onClick={handleAcceptSuggestion}>
                <Button.Text>Sim</Button.Text>
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleDismissSuggestion}>
                <Button.Text>Não</Button.Text>
              </Button>
            </div>
          </div>
        )}

        {/* Subtasks section */}
        <div className={cn("flex flex-col", spacingClasses.gap)}>
          <div className="flex items-center justify-between">
            <label className={cn("font-medium text-text-primary", fontSizeClasses.sm)}>
              Etapas (opcional)
            </label>
            {subtasks.length > 0 && (
              <span className={cn("text-text-secondary", fontSizeClasses.xs)}>
                {subtasks.filter((st) => st.completed).length} de {subtasks.length} concluídas
              </span>
            )}
          </div>

          {/* Existing subtasks */}
          {sortedSubtasks.length > 0 && (
            <div className={cn("flex flex-col", spacingClasses.gap)}>
              {sortedSubtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className={cn("flex items-center gap-2 p-2 rounded border border-border-subtle bg-surface-secondary", spacingClasses.gap)}
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(subtask.id)}
                    className="h-4 w-4 rounded border-border-subtle text-action-primary focus:ring-2 focus:ring-action-primary"
                    aria-label={`Marcar etapa "${subtask.title}" como ${subtask.completed ? "não concluída" : "concluída"}`}
                  />
                  <span
                    className={cn(
                      "flex-1 text-text-secondary",
                      fontSizeClasses.sm,
                      subtask.completed && "line-through text-text-tertiary"
                    )}
                  >
                    {subtask.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="text-feedback-error hover:text-feedback-error/80"
                    aria-label={`Remover etapa "${subtask.title}"`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add new subtask */}
          <div className="flex gap-2">
            <Input className="flex-1">
              <Input.Field
                id="subtask-input"
                placeholder="Adicionar etapa..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
            </Input>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddSubtask}
              disabled={!newSubtaskTitle.trim()}
            >
              <Button.Icon icon={Plus} position="left" size="sm" />
              <Button.Text>Adicionar</Button.Text>
            </Button>
          </div>
        </div>

        <RadioGroup
          value={status.toString()}
          onChange={(value) => setStatus(Number(value))}
          label="Status"
        >
          <RadioGroup.Option value="0" label="A Fazer" />
          <RadioGroup.Option value="1" label="Em Progresso" />
          <RadioGroup.Option value="2" label="Concluída" />
        </RadioGroup>

        <div className={cn("flex gap-3 justify-end", spacingClasses.gap)}>
          <Button type="button" variant="ghost" onClick={onClose}>
            <Button.Text>Cancelar</Button.Text>
          </Button>
          <Button type="submit" variant="primary">
            <Button.Text>{initialTask ? "Salvar" : "Criar"}</Button.Text>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

