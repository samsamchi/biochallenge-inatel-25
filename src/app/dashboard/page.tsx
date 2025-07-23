"use client";
import { useSession, signOut } from "next-auth/react"; // Adicionei signOut aqui
import { redirect } from "next/navigation";
import MedicineList from "../../components/MedicineList";
import AddMedicineForm from "../../components/AddMedicineForm";

export default function DashboardPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Meus Medicamentos</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Olá, {session?.user?.name}</span>
            <button
              onClick={() => signOut()}
              className="text-blue-500 hover:underline"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <AddMedicineForm />
          <MedicineList />
        </div>
      </main>
    </div>
  );
}