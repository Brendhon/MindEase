import { z } from "zod";

/**
 * Schema for subtask validation
 */
export const subtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  order: z.number(),
});

/**
 * Schema for task dialog form validation (input)
 * Used with react-hook-form and zodResolver
 */
export const taskDialogSchema = z.object({
  title: z
    .string()
    .min(1, "O título é obrigatório")
    .trim(),
  description: z
    .string()
    .default(""),
  subtasks: z
    .array(subtaskSchema)
    .default([]),
});

/**
 * Schema for task dialog output (after transformation)
 * Used to transform data before saving
 */
export const taskDialogOutputSchema = taskDialogSchema.transform((data) => ({
  title: data.title,
  description: data.description?.trim() || undefined,
  subtasks: data.subtasks
    .filter((item) => item.title.trim())
    .map((item, index) => ({
      ...item,
      order: index,
    })),
}));

/**
 * Type inferred from task dialog schema (form input)
 */
export type TaskDialogFormData = z.infer<typeof taskDialogSchema>;

/**
 * Type inferred from task dialog output schema (after transformation)
 */
export type TaskDialogOutputData = z.infer<typeof taskDialogOutputSchema>;
