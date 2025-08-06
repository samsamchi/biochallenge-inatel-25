"use client";

import { Medicine } from "@/types";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import MedicineForm from "./MedicineForm";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  medicine?: Medicine;
  mode?: "view" | "edit";
}

const MedicineModal = ({
  isOpen,
  onOpenChange,
  medicine,
  mode = "view",
}: Props) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="lg"
      className="max-w-4xl"
    >
      <ModalContent>
        {(onClose) => (
          <>
            {" "}
            <ModalHeader className="flex flex-col gap-1">
              Medicamento
            </ModalHeader>
            <ModalBody>
              <MedicineForm data={medicine} mode={mode} onFinished={onClose} />
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default MedicineModal;
