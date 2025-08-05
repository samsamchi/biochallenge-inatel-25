"use client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

interface CadastroFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CadastroPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>();

  const password = watch("password");

  const onSubmit: SubmitHandler<CadastroFormData> = async (data) => {
    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        addToast({
          title: "Erro",
          description: responseData.error || "Erro ao criar conta.",
          color: "danger",
        });
        return;
      }
      addToast({
        title: "Sucesso",
        description: "Conta criada com sucesso!",
        color: "success",
      });
      setTimeout(() => router.push("/login"), 1000);
    } catch (err) {
      console.error(err);
      addToast({
        title: "Erro",
        description: "Erro ao criar conta. Tente novamente.",
        color: "danger",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-bg">
      <Card className="w-[360px] gap-2">
        <CardHeader className="text-gray-700 pt-6 justify-center">
          <h1 className="text-xl font-bold text-center">Cadastro</h1>
        </CardHeader>
        <CardBody className="px-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4 w-full">
              <Input
                label="Nome"
                type="text"
                variant="bordered"
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 2,
                    message: "Nome deve ter pelo menos 2 caracteres",
                  },
                })}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
              <Input
                label="Email"
                type="email"
                variant="bordered"
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Email inválido",
                  },
                })}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
              <Input
                label="Senha"
                type="password"
                variant="bordered"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "Senha deve ter pelo menos 6 caracteres",
                  },
                })}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
              <Input
                label="Confirmar Senha"
                type="password"
                variant="bordered"
                {...register("confirmPassword", {
                  required: "Confirmação de senha é obrigatória",
                  validate: (value) =>
                    value === password || "As senhas não coincidem",
                })}
                isInvalid={!!errors.confirmPassword}
                errorMessage={errors.confirmPassword?.message}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              color="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center">
          <Link href="/login" className="text-blue-500 hover:underline">
            Já tem conta? Faça login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
