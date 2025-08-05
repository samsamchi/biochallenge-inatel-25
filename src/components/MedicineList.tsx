"use client";
import { Medicine } from "@/types";
import {
  Card,
  CardBody,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { CalendarDateTime } from "@internationalized/date";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

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
            "X-User-Email": session.user.email,
          },
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

  const formatDateTime = (
    dateTime: CalendarDateTime | string | Date | null | undefined,
  ) => {
    if (!dateTime) return "N/A";

    // If it's a CalendarDateTime object, convert to Date first using system timezone
    if (
      typeof dateTime === "object" &&
      dateTime !== null &&
      "toDate" in dateTime
    ) {
      try {
        return format(dateTime.toDate("UTC"), "dd/MM/yyyy HH:mm");
      } catch {
        return "Data inválida";
      }
    }

    // If it's already a Date or string that can be parsed
    try {
      return format(new Date(dateTime as string | Date), "dd/MM/yyyy HH:mm");
    } catch {
      return "Data inválida";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-4 pb-0">
        <h2 className="font-semibold mb-4 text-gray-700">
          Medicamentos Cadastrados
        </h2>
      </CardHeader>
      <CardBody className="p-0">
        {medicines.length === 0 ? (
          <p className="text-gray-500">Nenhum medicamento cadastrado.</p>
        ) : (
          <Table
            aria-label="Lista de medicamentos"
            className="min-w-full"
            shadow="none"
          >
            <TableHeader>
              <TableColumn>Nome</TableColumn>
              <TableColumn>Frequência</TableColumn>
              <TableColumn>Dosagem</TableColumn>
              <TableColumn>Próxima administração</TableColumn>
              <TableColumn>Fim da administração</TableColumn>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>
                    {medicine.frequency || "N/A"}
                    {medicine.unit}
                  </TableCell>
                  <TableCell>{medicine.dosage}</TableCell>
                  <TableCell>--</TableCell>
                  <TableCell>
                    {medicine.end ? formatDateTime(medicine.end) : "Nunca"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardBody>
    </Card>
  );
}
