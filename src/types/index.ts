import { CalendarDateTime } from "@internationalized/date";

export interface Medicine {
  id: string;
  name: string;
  dosage: number;
  start: string;
  end?: string;
  description: string;
  frequency: string;
  unit: string;
}

export interface MedicineFormData
  extends Omit<Medicine, "id" | "start" | "end"> {
  name: string;
  dosage: number;
  start: CalendarDateTime;
  end?: CalendarDateTime | null;
  description: string;
  frequency: string;
  unit: string;
}

export interface MedicineUpdateData {
  id?: string;
  name?: string;
  dosage?: number;
  start: Date;
  end?: Date | null;
  description?: string;
  frequency?: string;
  unit?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}
