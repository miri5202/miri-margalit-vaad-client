interface ErrorMessageProps {message: string;}

function ErrorMessage({ message }: ErrorMessageProps) {
  return <div className="alert alert--error">{message}</div>;
}

export default ErrorMessage;