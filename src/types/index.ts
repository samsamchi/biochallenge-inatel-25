import { CalendarDateTime } from "@internationalized/date";

export type Medicine = {
  id: string;
  name: string;
  dosage: number;
  start: CalendarDateTime;
  end?: CalendarDateTime;
  description: string;
  frequency: string;
  unit: string;
};

export interface MedicineFormData {
  name: string;
  dosage: number;
  start: CalendarDateTime;
  end: CalendarDateTime | null;
  description: string;
  frequency: string;
  unit: string;
}
