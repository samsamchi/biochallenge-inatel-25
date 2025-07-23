"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

// Defina o tipo Medicine localmente
type Medicine = {
  id: string;
  name: string;
  dosage: string;
  time: string | Date;
  description?: string | null;
  userId: string;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export default function MedicineList() {
  const { data: session } = useSession();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        if (!session?.user?.id) return;
        
        const response = await fetch(`/api/medicines?userId=${session.user.id}`);
        if (!response.ok) throw new Error("Erro ao carregar medicamentos");
        
        const data = await response.json();
        setMedicines(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, [session]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/medicines/${id}`, { 
        method: "DELETE" 
      });
      
      if (!response.ok) throw new Error("Erro ao excluir medicamento");
      
      setMedicines(prev => prev.filter(medicine => medicine.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Meus Medicamentos</h2>
      {medicines.length === 0 ? (
        <p>Nenhum medicamento cadastrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Cabeçalho da tabela permanece igual */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosagem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horário
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Observações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicines.map((medicine) => (
                <tr key={medicine.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {medicine.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.dosage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(medicine.time), "dd/MM/yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medicine.description || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleDelete(medicine.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}