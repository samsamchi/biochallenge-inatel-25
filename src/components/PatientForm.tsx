import { useAPI } from "@/hooks/useAPI";
import { qc } from "@/services/queryClient";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/react";
import { CirclePlus, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface Patient {
  id: string;
  name: string;
  caretakerId: string;
  // medicines: Medicine[]; // Not used in form
}

interface PatientFormData {
  name: string;
  // caretakerId: string; // Set automatically from session
}

interface Props {
  data?: Patient;
  mode: "create" | "edit" | "view";
  onFinished?: () => void;
}

const PatientForm = ({ data: patient, mode, onFinished = () => {} }: Props) => {
  const api = useAPI();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>();

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && patient) {
      reset({
        name: patient.name,
      });
    }
  }, [mode, patient, reset]);

  const onSubmit: SubmitHandler<PatientFormData> = async (data) => {
    try {
      if (!session?.user?.id) {
        addToast({
          title: "Erro",
          description: "Você precisa estar logado para cadastrar pacientes",
          color: "danger",
        });
        return;
      }

      if (mode === "edit") {
        await api.put(`/api/patients/${patient?.id}`, { ...data });
      }

      if (mode === "create") {
        await api.post("/api/patients", {
          ...data,
          caretakerId: session.user.id,
        });
      }

      addToast({
        title: "Sucesso",
        description: "Paciente salvo com sucesso!",
        color: "success",
      });

      reset({ name: "" });
      qc.invalidateQueries({ queryKey: ["patients"] });
      onFinished();
    } catch (err) {
      addToast({
        title: "Erro",
        description:
          err instanceof Error ? err.message : "Erro ao salvar paciente",
        color: "danger",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nome do Paciente"
          variant="bordered"
          readOnly={mode === "view"}
          className="col-span-full"
          {...register("name", {
            required: "Nome do paciente é obrigatório",
            minLength: {
              value: 2,
              message: "Nome deve ter pelo menos 2 caracteres",
            },
          })}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
      </div>
      {mode !== "view" && (
        <div className="flex justify-end my-4">
          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            startContent={
              mode === "edit" ? <Save size={20} /> : <CirclePlus size={20} />
            }
          >
            {mode === "edit" ? "Atualizar" : "Adicionar"}
          </Button>
        </div>
      )}
    </form>
  );
};

export default PatientForm;
