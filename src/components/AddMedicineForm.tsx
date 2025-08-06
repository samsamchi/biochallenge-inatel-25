"use client";
import { Accordion, AccordionItem } from "@heroui/react";
import { PillBottle } from "lucide-react";
import MedicineForm from "./MedicineForm";

export default function AddMedicineForm() {
  return (
    <Accordion variant="splitted" className="w-full p-0">
      <AccordionItem
        key={1}
        title={
          <div className="flex flex-row gap-2 items-center">
            <PillBottle size={20} />
            <p className="font-semibold">Adicionar medicamento</p>
          </div>
        }
      >
        <MedicineForm mode="create" />
      </AccordionItem>
    </Accordion>
  );
}
