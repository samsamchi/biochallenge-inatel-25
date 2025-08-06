import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  onReject?: () => void;
  title?: string;
  description?: React.ReactNode;
  acceptLabel?: string;
  rejectLabel?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onAccept,
  onReject,
  title = "Confirmar",
  description = "Tem certeza de que deseja prosseguir?",
  acceptLabel = "Sim",
  rejectLabel = "Não",
}) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalContent>
        {(close) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{description}</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onPress={() => {
                  if (onReject) onReject();
                  close();
                }}
              >
                {rejectLabel}
              </Button>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onAccept();
                  close();
                }}
              >
                {acceptLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDialog;
