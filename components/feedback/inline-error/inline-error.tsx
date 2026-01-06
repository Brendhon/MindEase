/**
 * Inline Error Component - MindEase
 * Accessible inline error message for form fields
 */
export interface InlineErrorProps {
  message: string;
  id?: string;
  "data-testid"?: string;
}

export function InlineError({ message, id, "data-testid": dataTestId = "inline-error" }: InlineErrorProps) {
  return (
    <p
      id={id}
      role="alert"
      className="text-sm text-feedback-error mt-1"
      data-testid={dataTestId}
    >
      {message}
    </p>
  );
}

