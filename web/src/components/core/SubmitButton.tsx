import { useFormStatus } from "react-dom";
import Button from "./Button";

interface SubmitButtonProps {
  title: string;
}

export default function SubmitButton({ title }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} isLoading={pending}>
      {title}
    </Button>
  );
}
