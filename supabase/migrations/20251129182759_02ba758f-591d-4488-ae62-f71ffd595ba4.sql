-- Corrigir search_path das funções para segurança

-- Recriar função update_updated_at_column com search_path seguro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recriar função registrar_historico_bombana com search_path seguro
CREATE OR REPLACE FUNCTION public.registrar_historico_bombana()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;