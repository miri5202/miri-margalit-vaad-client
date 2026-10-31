interface ErrorMessageProps {
  message: string;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="my-3 flex items-start gap-2 rounded-2xl border-2 border-ink bg-late/40 px-4 py-3 font-medium" role="alert">
      <span aria-hidden="true">⚠️</span>
      {message}
    </div>
  );
}

export default ErrorMessage;
