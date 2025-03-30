import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Icons } from "../ui/icons";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkspaceMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { DialogTitle } from "../ui/dialog";

export default function CreateWorkspaceForm({
  onClose,
}: {
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: createWorkspaceMutationFn,
  });

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Workspace name is required",
    }),
    description: z.string().trim(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (isPending) return;
    mutate(values, {
      onSuccess: (data) => {
        queryClient.resetQueries({
          queryKey: ["userWorkspaces"],
        });
        const workspace = data.workspace;
        onClose();
        navigate(`/workspace/${workspace._id}`);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="h-full p-7 grid gap-4">
      <div className="grid gap-3">
        <DialogTitle>Let's build a Workspace</DialogTitle>
        <p className="text-muted-foreground text-base leading-tight">
          Boost your productivity by making it easier for everyone to access
          projects in one location.
        </p>
      </div>
      <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-1">
          <Label className="dark:text-[#f1f7feb5] text-sm">
            Workspace name
          </Label>
          <Input {...register("name")} placeholder="Taco's Co." />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div className="grid gap-1">
          <Label className="dark:text-[#f1f7feb5] text-sm">
            Workspace description
            <span className="text-xs font-extralight ml-2">Optional</span>
          </Label>
          <Textarea
            {...register("description")}
            rows={6}
            placeholder="Our team organizes marketing projects and tasks here."
          />
          {errors.description && (
            <p className="text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>
        <div className="flex items-center justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending && <Icons.spinner />} Create Workspace
          </Button>
        </div>
      </form>
    </div>
  );
}
