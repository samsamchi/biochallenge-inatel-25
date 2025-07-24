"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";

interface AddMedicineFormProps {
  onMedicineAdded?: () => void;
}

export default function AddMedicineForm({ onMedicineAdded }: AddMedicineFormProps) {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      if (!session?.user?.email) {
        throw new Error("Você precisa estar logado para cadastrar medicamentos");
      }

      const response = await fetch("/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": session.user.email
        },
        body: JSON.stringify({ name, dosage, time, description }),
      });

      if (!response.ok) {
        throw new Error("Falha ao cadastrar medicamento");
      }

      setSuccess("Medicamento cadastrado com sucesso!");
      setName("");
      setDosage("");
      setTime("");
      setDescription("");

      if (onMedicineAdded) onMedicineAdded();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao cadastrar medicamento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Adicionar Medicamento</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Nome do Medicamento
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="dosage">
              Dosagem
            </label>
            <input
              type="text"
              id="dosage"
              className="w-full px-3 py-2 border rounded"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="time">
            Data e Horário
          </label>
          <input
            type="datetime-local"
            id="time"
            className="w-full px-3 py-2 border rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="description">
            Observações (opcional)
          </label>
          <textarea
            id="description"
            className="w-full px-3 py-2 border rounded"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Cadastrando..." : "Cadastrar Medicamento"}
        </button>
      </form>
    </div>
  );
}