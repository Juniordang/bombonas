# Guia de Integração com API de Bombonas

## 📋 Estrutura Criada

Toda a lógica de CRUD foi implementada no frontend, pronta para conectar com sua API backend.

### Arquivos Criados

1. **`src/services/bombanaService.ts`** - Serviço com todas as chamadas de API
2. **`src/hooks/useBombanas.ts`** - Hooks personalizados para gerenciar estado e operações

## 🔌 Como Conectar sua API

### 1. Configure a URL Base da API

Abra o arquivo `src/services/bombanaService.ts` e modifique a constante `API_BASE_URL`:

```typescript
const API_BASE_URL = "/api"; // Altere para a URL da sua API
// Exemplos:
// const API_BASE_URL = "https://minha-api.com/api";
// const API_BASE_URL = "http://localhost:3000/api";
```

### 2. Ajuste as Rotas (se necessário)

As rotas seguem o padrão REST:

- `GET /api/bombanas` - Lista todas as bombonas
- `GET /api/bombanas/:id` - Busca bombana por ID
- `POST /api/bombanas` - Cria nova bombana
- `PUT /api/bombanas/:id` - Atualiza bombana
- `DELETE /api/bombanas/:id` - Remove bombana
- `PATCH /api/bombanas/bulk` - Atualização em massa

Se suas rotas forem diferentes, edite os métodos em `bombanaService.ts`.

### 3. Ative a Integração com a API

No arquivo `src/pages/BombanasPage.tsx`, mude a flag:

```typescript
const [useMockData] = useState(false); // Altere de true para false
```

## 📦 Estrutura de Dados

### Criar Bombana (CreateBombanaDTO)
```typescript
{
  qrCode: string;        // Obrigatório
  capacidade: string;    // Ex: "13kg", "20kg"
  localizacao: string;   // Endereço ou nome do local
  status: "disponivel" | "em-uso" | "manutencao";
  lat?: number;          // Opcional - coordenada GPS
  lng?: number;          // Opcional - coordenada GPS
}
```

### Atualizar Bombana (UpdateBombanaDTO)
```typescript
{
  capacidade?: string;
  localizacao?: string;
  status?: "disponivel" | "em-uso" | "manutencao";
  lat?: number;
  lng?: number;
  descricao?: string;    // Para histórico de alterações
}
```

### Resposta da API (Bombana)
```typescript
{
  id: string;
  qrCode: string;
  status: "disponivel" | "em-uso" | "manutencao";
  localizacao: string;
  ultimaAtualizacao: string;    // Ex: "Hoje às 14:30"
  capacidade: string;
  lat?: number;
  lng?: number;
  dataAtualizacao?: Date;       // Para ordenação
}
```

## 🎯 Funcionalidades Implementadas

### No Hook `useBombanas`

```typescript
const {
  bombanas,           // Lista de bombanas
  loading,            // Estado de carregamento
  error,              // Erros da API
  fetchBombanas,      // Buscar todas
  createBombana,      // Criar nova
  updateBombana,      // Atualizar
  deleteBombana,      // Deletar
  bulkUpdateBombanas  // Atualizar várias
} = useBombanas();
```

### No Hook `useBombana`

```typescript
const {
  bombana,    // Uma bombana específica
  loading,    // Estado de carregamento
  error,      // Erros da API
  refetch     // Recarregar dados
} = useBombana(id);
```

## 🔄 Fluxo de Uso

### Exemplo: Criar Bombana

```typescript
const { createBombana } = useBombanas();

const novaBombana = {
  qrCode: "BOM123",
  capacidade: "13kg",
  localizacao: "Depósito A - Setor 1",
  status: "disponivel"
};

await createBombana(novaBombana);
// Toast de sucesso será exibido automaticamente
```

### Exemplo: Atualizar Bombana

```typescript
const { updateBombana } = useBombanas();

await updateBombana("id-da-bombana", {
  status: "em-uso",
  localizacao: "Cliente - Rua das Flores, 123",
  descricao: "Bombana enviada para cliente"
});
```

### Exemplo: Atualização em Massa

```typescript
const { bulkUpdateBombanas } = useBombanas();

const ids = ["id1", "id2", "id3"];
await bulkUpdateBombanas(ids, { status: "manutencao" });
```

## ✅ Validação de Dados

Toda validação está implementada no formulário usando **Zod**:

- QR Code: Obrigatório
- Capacidade: Obrigatório (8kg, 13kg, 20kg, 45kg)
- Localização: 5-200 caracteres
- Status: Enum ("disponivel", "em-uso", "manutencao")
- Descrição: Máximo 500 caracteres (apenas em edição)

## 🛡️ Tratamento de Erros

Todos os erros da API são:
1. Capturados automaticamente
2. Exibidos via toast
3. Disponíveis no estado `error` dos hooks

## 📝 Requisitos da API Backend

Sua API deve retornar:

**Sucesso:**
```json
Status: 200/201
Body: { ...dados da bombana } ou [ ...array de bombanas ]
```

**Erro:**
```json
Status: 4xx/5xx
Body: { "message": "Mensagem de erro" }
```

## 🧪 Modo de Desenvolvimento

Por padrão, o sistema usa dados mock enquanto `useMockData = true`.

Isso permite:
- Desenvolver e testar a interface
- Visualizar o fluxo completo
- Testar validações
- Desenvolver offline

Quando estiver pronto, apenas altere para `false` e conecte sua API!

## 🔑 Autenticação (Opcional)

Se sua API exigir autenticação, adicione os headers necessários em `bombanaService.ts`:

```typescript
headers: {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${token}`, // Adicione seu token aqui
}
```

## 📌 Próximos Passos

1. Configure `API_BASE_URL` no `bombanaService.ts`
2. Certifique-se de que sua API está rodando
3. Altere `useMockData` para `false` em `BombanasPage.tsx`
4. Teste cada operação CRUD
5. Ajuste o formato de resposta se necessário

---

**Dúvidas?** Toda a lógica está comentada e organizada. Basta conectar as rotas! 🚀
