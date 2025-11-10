import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus } from "lucide-react";
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
import { toast } from "sonner";
import QrCodeButton from "./ui/QrCodeInput";

const bombanaSchema = z.object({
  qrCode: z.string(),
  capacidade: z.string().min(1, { message: "Selecione a capacidade" }),
  localizacao: z
    .string()
    .trim()
    .min(5, { message: "Localização deve ter no mínimo 5 caracteres" })
    .max(200, { message: "Localização deve ter no máximo 200 caracteres" }),
  status: z.enum(["disponivel", "em-uso", "manutencao"], {
    required_error: "Selecione o status",
  }),
});

type BombanaFormValues = z.infer<typeof bombanaSchema>;

interface BombanaFormDialogProps {
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

const BombanaFormDialog = ({
  variant = "default",
  size = "default",
}: BombanaFormDialogProps) => {
  const [open, setOpen] = useState(false);

  const form = useForm<BombanaFormValues>({
    resolver: zodResolver(bombanaSchema),
    defaultValues: {
      qrCode: "",
      capacidade: "",
      localizacao: "",
      status: "disponivel",
    },
  });

  const onSubmit = (data: BombanaFormValues) => {
    // Aqui você pode adicionar a lógica para salvar no banco de dados
    toast.success("Bombana cadastrada com sucesso!", {
      description: `QR Code: ${data.qrCode}`,
    });

    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Bombona
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cadastrar Nova Bombona</DialogTitle>
          <DialogDescription>
            Preencha os dados da bombona. Todos os campos são obrigatórios.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="qrCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>QR Code</FormLabel>
                  <FormControl>
                    <QrCodeButton
                      onRead={(qr) => field.onChange(qr.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="localizacao"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localização Atual</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Depósito A - Setor 1"
                      {...field}
                      maxLength={200}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              <Button type="submit">Cadastrar</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BombanaFormDialog;
