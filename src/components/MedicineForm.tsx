import { useAPI } from "@/hooks/useAPI";
import { sanitizeDate } from "@/services/formatters";
import { qc } from "@/services/queryClient";
import { dosages, frequencies } from "@/services/units";
import { Medicine, MedicineFormData } from "@/types";
import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";

import {
  addToast,
  DateInput,
  NumberInput,
  Select,
  SelectItem,
} from "@heroui/react";
import { CirclePlus, Save } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

interface Props {
  data?: Medicine;
  mode: "create" | "edit" | "view";
  onFinished?: () => void;
}

const MedicineForm = ({
  data: medicine,
  mode,
  onFinished = () => {},
}: Props) => {
  const api = useAPI();
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<MedicineFormData>();
  const watchUnit = watch("unit");

  useEffect(() => {
    if (mode === "create" && watchUnit) {
      setFocus("dosage");
    }
  }, [watchUnit]);

  useEffect(() => {
    if ((mode === "edit" || mode === "view") && medicine) {
      reset({
        name: medicine.name,
        frequency: medicine.frequency,
        unit: medicine.unit,
        dosage: medicine.dosage,
        start: sanitizeDate(medicine.start),
        end: sanitizeDate(medicine.end),
        description: medicine.description || "",
      });
    }
  }, [mode, medicine, reset]);

  const onSubmit: SubmitHandler<MedicineFormData> = async (data) => {
    try {
      if (!session?.user?.email) {
        addToast({
          title: "Erro",
          description: "Você precisa estar logado para cadastrar medicamentos",
          color: "danger",
        });
        return;
      }

      if (mode === "edit") {
        await api.put(`/api/medicines/${medicine?.id}`, {
          ...data,
          start: data.start.toString() || null,
          end: data.end?.toString() || null,
        });
      }

      if (mode === "create") {
        await api.post("/api/medicines", {
          ...data,
          start: data.start.toString() || null,
          end: data.end?.toString() || null,
        });
      }

      addToast({
        title: "Sucesso",
        description: "Medicamento cadastrado com sucesso!",
        color: "success",
      });

      reset({
        name: "",
        frequency: "",
        unit: "",
        dosage: undefined,
        start: undefined,
        end: undefined,
        description: "",
      });

      qc.invalidateQueries({ queryKey: ["medicines"] });
    } catch (err) {
      addToast({
        title: "Erro",
        description:
          err instanceof Error ? err.message : "Erro ao cadastrar medicamento",
        color: "danger",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          label="Nome do Medicamento"
          variant="bordered"
          readOnly={mode === "view"}
          className="col-span-full md:col-span-2"
          {...register("name", {
            required: "Nome do medicamento é obrigatório",
            minLength: {
              value: 2,
              message: "Nome deve ter pelo menos 2 caracteres",
            },
          })}
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
        />
        <Select
          label="Periodicidade"
          variant="bordered"
          disabled={mode === "view"}
          className="col-span-full md:col-span-2"
          {...register("frequency", {
            required: "A periodicidade de administração é obrigatória",
          })}
        >
          {frequencies.map((frequency) => (
            <SelectItem key={frequency.value}>{frequency.label}</SelectItem>
          ))}
        </Select>
        <Select
          id="unit"
          label="Unidade de Medida"
          variant="bordered"
          disabled={mode === "view"}
          className="col-span-full md:col-span-1"
          {...register("unit", {
            required: "Unidade de medida é obrigatória",
          })}
        >
          {dosages.map((unit) => (
            <SelectItem key={unit.value}>{unit.label}</SelectItem>
          ))}
        </Select>
        <Controller
          name="dosage"
          control={control}
          rules={{
            required: "Dosagem é obrigatória",
            minLength: {
              value: 1,
              message: "Dosagem deve ser informada",
            },
          }}
          render={({ field: { onChange, value, ...field } }) => (
            <NumberInput
              id="dosage"
              label="Dosagem"
              variant="bordered"
              readOnly={mode === "view"}
              disabled={!watch("unit")}
              value={value}
              onChange={onChange}
              endContent={
                <div className="h-full flex items-center mr-2">
                  <p className="text-gray-500">{watch("unit")}</p>
                </div>
              }
              isInvalid={!!errors.dosage}
              errorMessage={errors.dosage?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="start"
          control={control}
          rules={{ required: "Data de início é obrigatória" }}
          render={({ field: { onChange, value, ...field } }) => (
            <DateInput
              label="Data de início"
              variant="bordered"
              isReadOnly={mode === "view"}
              granularity="minute"
              hourCycle={24}
              className="col-span-full md:col-span-1"
              isInvalid={!!errors.start}
              value={value}
              onChange={onChange}
              errorMessage={errors.start?.message}
              {...field}
            />
          )}
        />
        <Controller
          name="end"
          control={control}
          render={({ field: { onChange, value, ...field } }) => (
            <DateInput
              label="Data de fim"
              variant="bordered"
              isReadOnly={mode === "view"}
              granularity="minute"
              hourCycle={24}
              className="col-span-full md:col-span-1"
              isInvalid={!!errors.end}
              value={value}
              onChange={mode !== "view" ? onChange : undefined}
              errorMessage={errors.end?.message}
              {...field}
            />
          )}
        />
        <Textarea
          label="Observações"
          variant="bordered"
          readOnly={mode === "view"}
          className="col-span-full"
          placeholder="Observações opcionais sobre o medicamento"
          minRows={3}
          {...register("description")}
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
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

export default MedicineForm;
