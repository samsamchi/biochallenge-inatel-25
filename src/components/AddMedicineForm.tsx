"use client";
import { dosages } from "@/app/services/units";
import { MedicineFormData } from "@/types";
import { Plus } from "@geist-ui/icons";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import {
  Accordion,
  AccordionItem,
  DateInput,
  NumberInput,
  Select,
  SelectItem,
} from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useSession } from "next-auth/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
interface AddMedicineFormProps {
  onMedicineAdded?: () => void;
}

export default function AddMedicineForm({
  onMedicineAdded,
}: AddMedicineFormProps) {
  const { data: session } = useSession();
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MedicineFormData>();

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

      const response = await fetch("/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": session.user.email,
        },
        body: JSON.stringify({
          ...data,
          start: data.start.toString() || null,
          end: data.end?.toString() || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Falha ao cadastrar medicamento");
      }

      addToast({
        title: "Sucesso",
        description: "Medicamento cadastrado com sucesso!",
        color: "success",
      });

      reset();
      if (onMedicineAdded) onMedicineAdded();
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
    <Accordion variant="splitted" className="w-full p-0">
      <AccordionItem key={1} title="Adicionar Medicamento">
        <Card className="mb-6" shadow="none">
          <CardBody>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  label="Nome do Medicamento"
                  variant="bordered"
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
                  className="col-span-full md:col-span-2"
                  {...register("frequency", {
                    required: "A periodicidade de administração é obrigatória",
                  })}
                >
                  <SelectItem key={1}>De 1 em 1 hora</SelectItem>
                  <SelectItem key={2}>De 2 em 2 horas</SelectItem>
                  <SelectItem key={4}>De 4 em 4 horas</SelectItem>
                  <SelectItem key={6}>De 6 em 6 horas</SelectItem>
                  <SelectItem key={8}>De 8 em 8 horas</SelectItem>
                  <SelectItem key={12}>De 12 em 12 horas</SelectItem>
                  <SelectItem key={24}>De 24 em 24 horas</SelectItem>
                </Select>
                <Select
                  label="Unidade de Medida"
                  variant="bordered"
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
                      label="Dosagem"
                      variant="bordered"
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
                      granularity="minute"
                      hourCycle={24}
                      className="col-span-full md:col-span-1"
                      isInvalid={!!errors.end}
                      value={value}
                      onChange={onChange}
                      errorMessage={errors.end?.message}
                      {...field}
                    />
                  )}
                />
                <Textarea
                  label="Observações"
                  variant="bordered"
                  className="col-span-full"
                  placeholder="Observações opcionais sobre o medicamento"
                  minRows={3}
                  {...register("description")}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description?.message}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  startContent={<Plus size={20} />}
                >
                  {isSubmitting ? "Cadastrando..." : "Cadastrar"}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </AccordionItem>
    </Accordion>
  );
}
