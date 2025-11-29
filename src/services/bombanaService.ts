import { Bombana } from "@/components/BombanaCard";
import { supabase } from "@/integrations/supabase/client";

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

const formatBombana = (row: any): Bombana => {
  return {
    id: row.id,
    qrCode: row.qr_code,
    capacidade: row.capacidade,
    localizacao: row.localizacao,
    status: row.status,
    ultimaAtualizacao: new Date(row.updated_at).toLocaleString("pt-BR", {
      dateStyle: "short",
      timeStyle: "short",
    }),
    lat: row.lat,
    lng: row.lng,
    dataAtualizacao: new Date(row.updated_at),
  };
};

export const bombanaService = {
  // GET - Listar todas as bombanas
  getAll: async (): Promise<Bombana[]> => {
    const { data, error } = await supabase
      .from("bombanas")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map(formatBombana);
  },

  // GET - Buscar bombana por ID
  getById: async (id: string): Promise<Bombana> => {
    const { data, error } = await supabase
      .from("bombanas")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return formatBombana(data);
  },

  // POST - Criar nova bombana
  create: async (createData: CreateBombanaDTO): Promise<Bombana> => {
    const { data, error } = await supabase
      .from("bombanas")
      .insert({
        qr_code: createData.qrCode,
        capacidade: createData.capacidade,
        localizacao: createData.localizacao,
        status: createData.status,
        lat: createData.lat,
        lng: createData.lng,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return formatBombana(data);
  },

  // PUT - Atualizar bombana
  update: async (id: string, updateData: UpdateBombanaDTO): Promise<Bombana> => {
    const updateObj: any = {};
    if (updateData.capacidade !== undefined) updateObj.capacidade = updateData.capacidade;
    if (updateData.localizacao !== undefined) updateObj.localizacao = updateData.localizacao;
    if (updateData.status !== undefined) updateObj.status = updateData.status;
    if (updateData.lat !== undefined) updateObj.lat = updateData.lat;
    if (updateData.lng !== undefined) updateObj.lng = updateData.lng;

    const { data, error } = await supabase
      .from("bombanas")
      .update(updateObj)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return formatBombana(data);
  },

  // DELETE - Remover bombana
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from("bombanas")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  // PATCH - Ações em massa
  bulkUpdate: async (
    ids: string[],
    updateData: Partial<UpdateBombanaDTO>
  ): Promise<Bombana[]> => {
    const updateObj: any = {};
    if (updateData.capacidade !== undefined) updateObj.capacidade = updateData.capacidade;
    if (updateData.localizacao !== undefined) updateObj.localizacao = updateData.localizacao;
    if (updateData.status !== undefined) updateObj.status = updateData.status;
    if (updateData.lat !== undefined) updateObj.lat = updateData.lat;
    if (updateData.lng !== undefined) updateObj.lng = updateData.lng;

    const { data, error } = await supabase
      .from("bombanas")
      .update(updateObj)
      .in("id", ids)
      .select();

    if (error) throw new Error(error.message);
    return (data || []).map(formatBombana);
  },
};
