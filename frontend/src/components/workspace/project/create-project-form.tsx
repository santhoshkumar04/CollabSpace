import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
// import EmojiPickerComponent from "@/components/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { useState } from "react";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@/components/ui/dialog";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export default function CreateProjectForm({
  onClose,
}: {
  onClose: () => void;
}) {
  // const [emoji, setEmoji] = useState("📊");
  const emoji = "";
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createProjectMutationFn,
  });

  const formSchema = z.object({
    name: z.string().trim().min(1, {
      message: "Project title is required",
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

  // const handleEmojiSelection = (emoji: string) => {
  //   setEmoji(emoji);
  // };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    const payload = {
      workspaceId: workspaceId,
      data: { emoji, ...values },
    };
    mutate(payload, {
      onSuccess: (data) => {
        const project = data.project;
        queryClient.invalidateQueries({
          queryKey: ["allprojects", workspaceId],
        });
        toast({
          title: "Project created",
          description: "Project created successfully",
          variant: "default",
        });
        navigate(`/workspace/${workspaceId}/project/${project._id}`);
        setTimeout(() => onClose(), 500);
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
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <DialogTitle
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Create Project
          </DialogTitle>
          <p className="text-muted-foreground text-sm leading-tight">
            Organize and manage tasks, resources, and team collaboration
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Select Emoji
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="font-normal size-[60px] !p-2 !shadow-none mt-2 items-center rounded-full "
                >
                  {/* <span className="text-4xl">{emoji}</span> */}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className=" !p-0">
                {/* <EmojiPickerComponent onSelectEmoji={handleEmojiSelection} /> */}
              </PopoverContent>
            </Popover>
          </div>
          <div className="mb-4">
            <Label className="dark:text-[#f1f7feb5] text-sm">
              Project title
            </Label>
            <Input
              placeholder="Website Redesign"
              className="!h-[48px]"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p>{form.formState.errors.name?.message}</p>
            )}
          </div>
          <div className="mb-4">
            <Label className="dark:text-[#f1f7feb5] text-sm">
              Project description
              <span className="text-xs font-extralight ml-2">Optional</span>
            </Label>
            <Textarea
              rows={4}
              placeholder="Projects description"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p>{form.formState.errors.description?.message}</p>
            )}
          </div>

          <Button
            disabled={isPending}
            className="flex place-self-end  h-[40px] text-white font-semibold"
            type="submit"
          >
            {isPending && <Loader />} Create
          </Button>
        </form>
      </div>
    </div>
  );
}
