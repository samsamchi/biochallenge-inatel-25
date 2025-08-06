"use client";
import { debounce } from "@/app/services/debouncer";
import { formatDate, hashOptions } from "@/app/services/formatters";
import { frequencies } from "@/app/services/units";
import { useAPI } from "@/hooks/useAPI";
import { Medicine } from "@/types";
import {
  addToast,
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from "@heroui/react";
import { ClipboardList, Edit, Search, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import ConfirmDialog from "./ConfirmDialog";
import MedicineModal from "./MedicineModal";

export default function MedicineList({
  refetchTrigger,
}: {
  refetchTrigger?: boolean;
}) {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState("");
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useAPI();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine>();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const triggerDelete = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsConfirmDialogOpen(true);
  };

  const editMedicine = (medicine: Medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const fetchMedicines = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!session?.user?.email) {
        setIsLoading(false);
        return;
      }
      const response = await api.get<Medicine[]>("/api/medicines");
      setMedicines(response);
      setFilteredMedicines(response);
    } catch {
      addToast({
        title: "Erro",
        description: "Falha ao carregar medicamentos",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, api]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const deleteMedicine = async (medicineId: string) => {
    try {
      await api.delete(`/api/medicines/${medicineId}`);
      fetchMedicines();
      addToast({
        title: "Sucesso",
        description: "Medicamento excluído com sucesso.",
        color: "success",
      });
    } catch {
      addToast({
        title: "Erro",
        description: "Falha ao excluir medicamento.",
        color: "danger",
      });
    }
  };

  const onModalClose = () => {
    setSelectedMedicine(undefined);
    setIsModalOpen(false);
    fetchMedicines();
  };

  const onSearch = useCallback(
    (term: string) => {
      if (term.trim() === "") {
        setFilteredMedicines(medicines);
        return;
      }

      const filtered = medicines.filter((medicine) =>
        medicine.name.toLowerCase().includes(term.toLowerCase()),
      );

      setFilteredMedicines(filtered);
    },
    [medicines],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((e: React.ChangeEvent<HTMLInputElement>) => {
        onSearch(e.target.value);
      }, 300),
    [onSearch],
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader className="px-4 pb-0 flex flex-row items-center gap-2 mb-6">
          <ClipboardList size={20} />
          <h2 className="font-semibold">Medicamentos</h2>
        </CardHeader>
        <CardBody className="p-0 flex flex-col gap-0 pt-1">
          <div className="px-4">
            <Input
              placeholder="Buscar medicamento..."
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                debouncedSearch(e);
              }}
              startContent={<Search size={20} className="text-gray-500" />}
            />
          </div>
          <Table
            aria-label="Lista de medicamentos"
            className="min-w-full"
            shadow="none"
          >
            <TableHeader>
              <TableColumn className="w-[400px]">Nome</TableColumn>
              <TableColumn>Dosagem</TableColumn>
              <TableColumn>Frequência</TableColumn>
              <TableColumn>Próxima administração</TableColumn>
              <TableColumn>Fim da administração</TableColumn>
              <TableColumn>Ações</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="Nenhum medicamento encontrado."
              isLoading={isLoading}
            >
              {medicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <TableRow key={medicine.id}>
                    <TableCell className="font-medium w-[400px]">
                      {medicine.name}
                    </TableCell>
                    <TableCell>
                      {medicine.dosage || "N/A"}
                      {medicine.unit}
                    </TableCell>
                    <TableCell>
                      {hashOptions(frequencies)[medicine.frequency]}
                    </TableCell>
                    <TableCell>--</TableCell>
                    <TableCell>
                      {medicine.end ? formatDate(medicine.end) : "Nunca"}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-row items-center gap-1">
                        <Tooltip content="Editar medicamento">
                          <Button
                            variant="light"
                            isIconOnly
                            size="sm"
                            aria-label="Editar"
                            onPress={() => editMedicine(medicine)}
                          >
                            <Edit size={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip content="Excluir medicamento">
                          <Button
                            variant="light"
                            isIconOnly
                            size="sm"
                            onPress={() => triggerDelete(medicine)}
                            aria-label="Excluir"
                          >
                            <Trash size={18} />
                          </Button>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum medicamento cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
      <MedicineModal
        mode="edit"
        isOpen={isModalOpen}
        onOpenChange={onModalClose}
        medicine={selectedMedicine}
      />
      <ConfirmDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onAccept={() => deleteMedicine(selectedMedicine?.id || "")}
        title="Excluir medicamento?"
        description={`Tem certeza de que deseja excluir ${selectedMedicine ? `"${selectedMedicine.name}"` : "este medicamento"}? Esta ação não pode ser desfeita.`}
      />
    </>
  );
}
