import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Edit, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import QrCodeButton from "./ui/QrCodeInput";
import LocationPickerDialog from "./LocationPickerDialog";
import { CreateBombanaDTO, UpdateBombanaDTO } from "@/services/bombanaService";

const bombanaSchema = z.object({
  qrCode: z.string().min(1, { message: "QR Code é obrigatório" }),
  capacidade: z.string().min(1, { message: "Selecione a capacidade" }),
  localizacao: z
    .string()
    .trim()
    .min(5, { message: "Localização deve ter no mínimo 5 caracteres" })
    .max(200, { message: "Localização deve ter no máximo 200 caracteres" }),
  status: z.enum(["disponivel", "em-uso", "manutencao"], {
    required_error: "Selecione o status",
  }),
  // usado só no modo edição, então deixamos opcional
  descricao: z
    .string()
    .trim()
    .max(500, { message: "Descrição deve ter no máximo 500 caracteres" })
    .optional(),
});

type BombanaFormValues = z.infer<typeof bombanaSchema>;

interface BombanaFormDialogProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  editData?: {
    id: string;
    qrCode: string;
    capacidade: string;
    localizacao: string;
    status: "disponivel" | "em-uso" | "manutencao";
    descricao?: string;
    lat?: number;
    lng?: number;
  };
  onSuccess?: (data: CreateBombanaDTO | UpdateBombanaDTO) => Promise<void>;
}

const BombanaFormDialog = ({
  variant = "default",
  size = "default",
  editData,
  onSuccess,
}: BombanaFormDialogProps) => {
  const [open, setOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const isEditMode = !!editData;

  const form = useForm<BombanaFormValues>({
    resolver: zodResolver(bombanaSchema),
    defaultValues: {
      qrCode: editData?.qrCode || "",
      capacidade: editData?.capacidade || "",
      localizacao: editData?.localizacao || "",
      status: editData?.status || "disponivel",
      descricao: editData?.descricao || "",
    },
  });

  const onSubmit = async (data: BombanaFormValues) => {
    try {
      if (isEditMode && editData) {
        const updateData: UpdateBombanaDTO = {
          capacidade: data.capacidade,
          localizacao: data.localizacao,
          status: data.status,
          descricao: data.descricao,
        };
        await onSuccess?.(updateData);
      } else {
        const createData: CreateBombanaDTO = {
          qrCode: data.qrCode,
          capacidade: data.capacidade,
          localizacao: data.localizacao,
          status: data.status,
        };
        await onSuccess?.(createData);
      }

      form.reset();
      setOpen(false);
    } catch (error) {
      // Erro já tratado nos hooks
      console.error("Erro ao salvar bombana:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          {isEditMode ? (
            <>
              <Edit className="h-4 w-4" />
              Editar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Nova Bombona
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isEditMode ? "Editar Bombona" : "Cadastrar Nova Bombona"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            Preencha os dados da bombona. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            {/* QR CODE */}
            <FormField
              name="qrCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code</FormLabel>
                  <p className="text-xs text-muted-foreground mb-1">
                    {isEditMode
                      ? "O QR Code não pode ser alterado após o cadastro."
                      : "Aponte a câmera para o QR Code ou cole o código manualmente."}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2 bg-muted/40">
                      <QrCode className="h-4 w-4 text-primary opacity-60" />
                      <Input
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="Cole o código aqui"
                        readOnly={isEditMode} // <- readonly no modo edição
                        className={`border-0 bg-transparent shadow-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${
                          isEditMode
                            ? "cursor-default text-muted-foreground"
                            : ""
                        }`}
                      />
                    </div>

                    {!isEditMode && (
                      <QrCodeButton
                        onRead={(qr) => field.onChange(qr.toUpperCase())}
                      />
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CAPACIDADE */}
            <FormField
              control={form.control}
              name="capacidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a capacidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="8kg">8kg</SelectItem>
                      <SelectItem value="13kg">13kg</SelectItem>
                      <SelectItem value="20kg">20kg</SelectItem>
                      <SelectItem value="45kg">45kg</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* LOCALIZAÇÃO ATUAL */}
            <FormField
              control={form.control}
              name="localizacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização Atual</FormLabel>
                  <p className="text-xs text-muted-foreground mb-1">
                    Você pode digitar ou escolher no mapa.
                  </p>

                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        placeholder="Depósito A - Setor 1"
                        {...field}
                        maxLength={200}
                      />
                    </FormControl>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLocationDialogOpen(true)}
                      className="shrink-0"
                    >
                      <span className="hidden sm:inline">Escolher no mapa</span>
                      <span className="sm:hidden">Mapa</span>
                    </Button>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* STATUS */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="disponivel">Disponível</SelectItem>
                      <SelectItem value="em-uso">Em Uso</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* DESCRIÇÃO (somente edição) */}
            {isEditMode && (
              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descreva a atividade realizada. Ex: Bombona movida para Depósito B - Setor 2."
                        maxLength={500}
                        className="resize-none"
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Essa descrição será usada no histórico de atividades.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  setOpen(false);
                }}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? "Salvar Alterações" : "Cadastrar"}
              </Button>
            </div>
          </form>
        </Form>

        <LocationPickerDialog
          open={locationDialogOpen}
          onOpenChange={setLocationDialogOpen}
          onSelect={(loc) =>
            form.setValue("localizacao", loc, { shouldValidate: true })
          }
        />
      </DialogContent>
    </Dialog>
  );
};

export default BombanaFormDialog;
