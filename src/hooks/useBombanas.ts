import { useState, useEffect } from "react";
import { Bombana } from "@/components/BombanaCard";
import {
  bombanaService,
  CreateBombanaDTO,
  UpdateBombanaDTO,
} from "@/services/bombanaService";
import { toast } from "sonner";

// Hook para gerenciar a lista de bombanas
export const useBombanas = () => {
  const [bombanas, setBombanas] = useState<Bombana[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar todas as bombanas
  const fetchBombanas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bombanaService.getAll();
      setBombanas(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar bombanas";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Criar nova bombana
  const createBombana = async (data: CreateBombanaDTO) => {
    setLoading(true);
    setError(null);
    try {
      const newBombana = await bombanaService.create(data);
      setBombanas((prev) => [newBombana, ...prev]);
      toast.success("Bombana cadastrada com sucesso!");
      return newBombana;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao cadastrar bombana";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar bombana
  const updateBombana = async (id: string, data: UpdateBombanaDTO) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBombana = await bombanaService.update(id, data);
      setBombanas((prev) =>
        prev.map((b) => (b.id === id ? updatedBombana : b))
      );
      toast.success("Bombana atualizada com sucesso!");
      return updatedBombana;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar bombana";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Deletar bombana
  const deleteBombana = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await bombanaService.delete(id);
      setBombanas((prev) => prev.filter((b) => b.id !== id));
      toast.success("Bombana removida com sucesso!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao remover bombana";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar múltiplas bombanas
  const bulkUpdateBombanas = async (ids: string[], data: Partial<UpdateBombanaDTO>) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBombanas = await bombanaService.bulkUpdate(ids, data);
      setBombanas((prev) =>
        prev.map((b) => {
          const updated = updatedBombanas.find((ub) => ub.id === b.id);
          return updated || b;
        })
      );
      toast.success(`${ids.length} bombana(s) atualizada(s) com sucesso!`);
      return updatedBombanas;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar bombanas";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    bombanas,
    loading,
    error,
    fetchBombanas,
    createBombana,
    updateBombana,
    deleteBombana,
    bulkUpdateBombanas,
  };
};

// Hook para gerenciar uma bombana específica
export const useBombana = (id: string) => {
  const [bombana, setBombana] = useState<Bombana | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBombana = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await bombanaService.getById(id);
      setBombana(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar bombana";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBombana();
  }, [id]);

  return {
    bombana,
    loading,
    error,
    refetch: fetchBombana,
  };
};
