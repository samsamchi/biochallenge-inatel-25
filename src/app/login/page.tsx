"use client";
import logo from "@/assets/images/outlined.svg";
import { Eye, EyeOff } from "@geist-ui/icons";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        addToast({
          title: "Erro",
          description: result.error,
          color: "danger",
        });
      } else {
        router.push("/dashboard");
      }
    } catch {
      addToast({
        title: "Erro",
        description: "Erro ao tentar fazer login. Tente novamente.",
        color: "danger",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-bg">
      <div className="flex flex-col items-center mb-18 my-10 mr-25"></div>
      <Card className="w-[360px] gap-2">
        <CardHeader className="text-gray-700 pt-10 pb-6 flex-col justify-center items-center gap-4">
          <Image
            src={logo}
            className="translate-x-0.25"
            alt="Controle de Medicamentos"
            width={52}
            height={52}
          />
          <h1 className="text-2xl font-bold text-center">Entrar</h1>
        </CardHeader>
        <CardBody className="px-6">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4 w-full">
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
                type={showPassword ? "text" : "password"}
                variant="bordered"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "Senha deve ter pelo menos 6 caracteres",
                  },
                })}
                endContent={
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    radius="full"
                    className="mb-0.5"
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </Button>
                }
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              color="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
                Entrar
            </Button>
          </form>
        </CardBody>
        <CardFooter className="justify-center pb-6">
          <div className="flex justify-between">
            <a href="/cadastro" className="text-blue-500 hover:underline">
              Criar conta
            </a>
            <span className="mx-2 text-gray-700">|</span>
            <a
              href="/recuperar-senha"
              className="text-blue-500 hover:underline"
            >
              Recuperar senha
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
