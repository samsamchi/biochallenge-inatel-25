"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import MedicineList from "../../components/MedicineList";
import AddMedicineForm from "../../components/AddMedicineForm";

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });
  const [refreshList, setRefreshList] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Olá, {session?.user?.name}. Você está no Controle de Medicamentos.</h2>
          <div className="flex items-center space-x-4">
            <button
            type="submit"
              onClick={() => signOut()}
              className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300 cursor-pointer px-4, px-6"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <AddMedicineForm onMedicineAdded={() => setRefreshList(prev => !prev)} />
          <MedicineList refreshTrigger={refreshList} />
        </div>
      </main>
    </div>
  );
}