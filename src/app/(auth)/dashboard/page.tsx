"use client";
import MedicineAccordion from "@/components/MedicineAccordion";
import MedicineList from "@/components/MedicineList";

export default function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <MedicineAccordion />
      <MedicineList />
    </main>
  );
}
