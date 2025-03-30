import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { useAuthContext } from "@/context/auth-provider";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editWorkspaceMutationFn } from "@/lib/api";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { toast } from "@/hooks/use-toast";
import { Permissions } from "@/constant";

export default function EditWorkspaceForm() {
  const { workspace, hasPermission } = useAuthContext();
  const queryClient = useQueryClient();
  const workspaceId = useWorkspaceId();
  const canEditWorkspace = hasPermission(Permissions.EDIT_WORKSPACE);

  const { mutate, isPending } = useMutation({
    mutationFn: editWorkspaceMutationFn,
  });

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Workspace name is required",
    }),
    description: z.string().trim(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    if (isPending) return;
    const payload = {
      workspaceId: workspaceId,
      data: { ...values },
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["workspace"],
        });
        queryClient.invalidateQueries({
          queryKey: ["userWorkspaces"],
        });
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

  useEffect(() => {
    if (workspace) {
      form.setValue("name", workspace.name);
      form.setValue("description", workspace.description || "");
    }
  }, [form, workspace]);

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 border-b">
          <h1 className="text-[17px] tracking-[-0.16px] font-semibold mb-1.5 text-center sm:text-left">
            Edit Workspace
          </h1>
        </div>
        <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-1.5">
            <Label className="dark:text-[#f1f7feb5] text-sm">
              Workspace name
            </Label>
            <Input
              {...form.register("name")}
              placeholder="Taco's Co."
              disabled={!canEditWorkspace}
            />
          </div>
          <div className="grid gap-1.5">
            <Label className="dark:text-[#f1f7feb5] text-sm">
              Workspace description
              <span className="text-xs font-extralight ml-2">Optional</span>
            </Label>
            <Textarea
              rows={6}
              disabled={!canEditWorkspace}
              {...form.register("description")}
              placeholder="Our team organizes marketing projects and tasks here."
            />
          </div>
          {canEditWorkspace && (
            <Button
              className="flex place-self-end  h-[40px] text-white font-semibold"
              disabled={false}
              type="submit"
            >
              {/* {false && <Loader className="animate-spin" />} */}
              Update Workspace
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
