import { Bombana } from "@/components/BombanaCard";

// ============================================
// CONFIGURAÇÃO DA API - AJUSTE AS ROTAS AQUI
// ============================================

const API_BASE_URL = "/api"; // Ajuste a URL base da sua API

// Funções auxiliares
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Erro desconhecido" }));
    throw new Error(error.message || "Erro na requisição");
  }
  return response.json();
};

// ============================================
// CRUD DE BOMBONAS
// ============================================

export interface CreateBombanaDTO {
  qrCode: string;
  capacidade: string;
  localizacao: string;
  status: "disponivel" | "em-uso" | "manutencao";
  lat?: number;
  lng?: number;
}

export interface UpdateBombanaDTO {
  capacidade?: string;
  localizacao?: string;
  status?: "disponivel" | "em-uso" | "manutencao";
  lat?: number;
  lng?: number;
  descricao?: string; // Para histórico
}

export const bombanaService = {
  // GET - Listar todas as bombanas
  getAll: async (): Promise<Bombana[]> => {
    const response = await fetch(`${API_BASE_URL}/bombanas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // GET - Buscar bombana por ID
  getById: async (id: string): Promise<Bombana> => {
    const response = await fetch(`${API_BASE_URL}/bombanas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return handleResponse(response);
  },

  // POST - Criar nova bombana
  create: async (data: CreateBombanaDTO): Promise<Bombana> => {
    const response = await fetch(`${API_BASE_URL}/bombanas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // PUT - Atualizar bombana
  update: async (id: string, data: UpdateBombanaDTO): Promise<Bombana> => {
    const response = await fetch(`${API_BASE_URL}/bombanas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // DELETE - Remover bombana
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/bombanas/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(error.message || "Erro ao deletar bombana");
    }
  },

  // PATCH - Ações em massa
  bulkUpdate: async (
    ids: string[],
    data: Partial<UpdateBombanaDTO>
  ): Promise<Bombana[]> => {
    const response = await fetch(`${API_BASE_URL}/bombanas/bulk`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids, ...data }),
    });
    return handleResponse(response);
  },
};
