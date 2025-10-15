import toast from "react-hot-toast";

export function handleError(err: unknown, context: string) {
  if (err instanceof Error) {
    toast.error(`${context}: ${err.message}`);
    console.error(`${context}:`, err);
  } else {
    toast.error(`${context}: An unexpected error occurred.`);
    console.error(`${context}: Unknown error`, err);
  }
}
