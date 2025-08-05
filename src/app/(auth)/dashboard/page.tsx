"use client";
import AddMedicineForm from "@/components/AddMedicineForm";
import MedicineList from "@/components/MedicineList";
import { useState } from "react";

export default function DashboardPage() {
  const [refreshList, setRefreshList] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center gap-8">
      <AddMedicineForm
        onMedicineAdded={() => setRefreshList((prev) => !prev)}
      />
      <MedicineList refreshTrigger={refreshList} />
    </main>
  );
}
