"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "date-fns";

type Medicine = {
  id: string;
  name: string;
  dosage: string;
  time: Date;
  description?: string;
  userId: string;
};

interface MedicineListProps {
  refreshTrigger?: boolean;
}

export default function MedicineList({ refreshTrigger }: MedicineListProps) {
  const { data: session } = useSession();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        if (!session?.user?.email) {
          setIsLoading(false);
          return;
        }

        const response = await fetch("/api/medicines", {
          headers: {
            "X-User-Email": session.user.email
          }
        });

        if (!response.ok) {
          throw new Error("Falha ao carregar medicamentos");
        }

        const data = await response.json();
        setMedicines(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedicines();
  }, [session, refreshTrigger]);

  if (isLoading) return <p className="p-4">Carregando medicamentos...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Medicamentos Cadastrados</h2>

      {medicines.length === 0 ? (
        <p className="text-gray-500">Nenhum medicamento cadastrado.</p>
      ) : (
        <div className="space-y-4">
          {medicines.map(medicine => (
            <div key={medicine.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg text-gray-700">{medicine.name}</h3>
                  <p className="text-gray-700">Dosagem: {medicine.dosage}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {format(medicine.time, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
              
              {medicine.description && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Observações:</span> {medicine.description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}