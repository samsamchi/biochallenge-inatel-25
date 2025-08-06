import { SelectOption } from "@/types";
import { parseDateTime } from "@internationalized/date";

export const formatDate = (date: string | Date): string => {
  if (typeof date === "string") {
    date = new Date(date);
  }

  return date.toLocaleDateString("pt-BR");
};

export const hashOptions = (options: SelectOption[]) => {
  const obj: { [key: string]: string } = {};
  options.map((option) => {
    obj[option.value] = option.label;
  });
  return obj;
};

export const cleanISODate = (date: string) => {
  return date.replace(/\.[0-9]{3}Z$/, "").replace(/Z$/, "");
};

export const sanitizeDate = (date: string | Date | undefined) => {
  if (!date) return undefined;
  if (typeof date === "string") {
    return parseDateTime(cleanISODate(date));
  }
  return parseDateTime(cleanISODate(date.toISOString()));
};
