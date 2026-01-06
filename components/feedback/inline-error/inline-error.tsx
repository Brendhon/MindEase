/**
 * Inline Error Component - MindEase
 * Accessible inline error message for form fields
 */
export interface InlineErrorProps {
  message: string;
  id?: string;
}

export function InlineError({ message, id }: InlineErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className="text-sm text-feedback-error mt-1"
    >
      {message}
    </p>
  );
}

