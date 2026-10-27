import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    if (!error.response) return "אין חיבור לשרת. בדקי שהשרת פועל";
    const message = error.response.data?.message;
    if (typeof message === "string") return message;
  }
  return "אירעה שגיאה, נסי שוב";
}
