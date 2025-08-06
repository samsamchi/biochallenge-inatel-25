"use client";
import AddMedicineForm from "@/components/AddMedicineForm";
import MedicineList from "@/components/MedicineList";
import { useState } from "react";

export default function DashboardPage() {
  const [refetchTrigger, setRefetchTrigger] = useState(false);

  const triggerRefetch = () => {
    setRefetchTrigger((prev) => !prev);
  };

  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <AddMedicineForm onFinished={triggerRefetch} />
      <MedicineList refetchTrigger={refetchTrigger} />
    </main>
  );
}
