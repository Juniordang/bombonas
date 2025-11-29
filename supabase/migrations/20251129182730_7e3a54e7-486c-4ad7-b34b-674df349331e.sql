-- ============================================
-- TABELA DE BOMBANAS
-- ============================================

-- Criar enum para status
CREATE TYPE public.status_bombana AS ENUM ('disponivel', 'em-uso', 'manutencao');

-- Criar tabela de bombanas
CREATE TABLE public.bombanas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  qr_code TEXT NOT NULL UNIQUE,
  capacidade TEXT NOT NULL,
  localizacao TEXT NOT NULL,
  status public.status_bombana NOT NULL DEFAULT 'disponivel',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.bombanas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - Permitir leitura e escrita para todos (sistema público)
CREATE POLICY "Permitir leitura pública de bombanas"
  ON public.bombanas
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção pública de bombanas"
  ON public.bombanas
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir atualização pública de bombanas"
  ON public.bombanas
  FOR UPDATE
  USING (true);

CREATE POLICY "Permitir exclusão pública de bombanas"
  ON public.bombanas
  FOR DELETE
  USING (true);

-- ============================================
-- TABELA DE HISTÓRICO
-- ============================================

-- Criar tabela de histórico de movimentações
CREATE TABLE public.historico_bombanas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bombana_id UUID NOT NULL REFERENCES public.bombanas(id) ON DELETE CASCADE,
  acao TEXT NOT NULL,
  status_anterior public.status_bombana,
  status_novo public.status_bombana,
  localizacao_anterior TEXT,
  localizacao_nova TEXT,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.historico_bombanas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para histórico
CREATE POLICY "Permitir leitura pública do histórico"
  ON public.historico_bombanas
  FOR SELECT
  USING (true);

CREATE POLICY "Permitir inserção pública no histórico"
  ON public.historico_bombanas
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at em bombanas
CREATE TRIGGER update_bombanas_updated_at
  BEFORE UPDATE ON public.bombanas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Função para registrar histórico automaticamente
CREATE OR REPLACE FUNCTION public.registrar_historico_bombana()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.historico_bombanas (
      bombana_id,
      acao,
      status_novo,
      localizacao_nova,
      descricao
    ) VALUES (
      NEW.id,
      'CRIAÇÃO',
      NEW.status,
      NEW.localizacao,
      'Bombana cadastrada no sistema'
    );
    RETURN NEW;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO public.historico_bombanas (
      bombana_id,
      acao,
      status_anterior,
      status_novo,
      localizacao_anterior,
      localizacao_nova,
      descricao
    ) VALUES (
      NEW.id,
      'ATUALIZAÇÃO',
      OLD.status,
      NEW.status,
      OLD.localizacao,
      NEW.localizacao,
      CASE
        WHEN OLD.status != NEW.status AND OLD.localizacao != NEW.localizacao THEN
          'Status alterado de ' || OLD.status || ' para ' || NEW.status || ' e localização atualizada'
        WHEN OLD.status != NEW.status THEN
          'Status alterado de ' || OLD.status || ' para ' || NEW.status
        WHEN OLD.localizacao != NEW.localizacao THEN
          'Localização atualizada de "' || OLD.localizacao || '" para "' || NEW.localizacao || '"'
        ELSE
          'Dados da bombana atualizados'
      END
    );
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger para registrar histórico
CREATE TRIGGER registrar_historico_bombana_trigger
  AFTER INSERT OR UPDATE ON public.bombanas
  FOR EACH ROW
  EXECUTE FUNCTION public.registrar_historico_bombana();

-- Criar índices para melhor performance
CREATE INDEX idx_bombanas_qr_code ON public.bombanas(qr_code);
CREATE INDEX idx_bombanas_status ON public.bombanas(status);
CREATE INDEX idx_bombanas_updated_at ON public.bombanas(updated_at DESC);
CREATE INDEX idx_historico_bombana_id ON public.historico_bombanas(bombana_id);
CREATE INDEX idx_historico_created_at ON public.historico_bombanas(created_at DESC);