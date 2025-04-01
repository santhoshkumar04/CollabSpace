import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
// import EmojiPickerComponent from "@/components/emoji-picker";
import { ProjectType } from "@/types/api.type";
import { Label } from "@/components/ui/label";
import { DialogTitle } from "@/components/ui/dialog";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProjectMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

export default function EditProjectForm(props: {
  project?: ProjectType;
  onClose: () => void;
}) {
  const { project, onClose } = props;

  const [emoji, setEmoji] = useState("📊");
  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();

  const projectId = project?._id as string;

  const { mutate, isPending } = useMutation({
    mutationFn: editProjectMutationFn,
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
    const payload = {
      projectId,
      workspaceId,
      data: { ...values, emoji },
    };
    if (isPending) return;
    mutate(payload, {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["singleProject", projectId],
        });

        queryClient.invalidateQueries({
          queryKey: ["allProjects", workspaceId],
        });

        toast({
          title: "Success",
          description: data.message,
          variant: "default",
        });

        setTimeout(() => onClose(), 100);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        // Reset form after successful mutation
        form.reset();
      },
    });
    onClose();
  };

  useEffect(() => {
    if (project) {
      setEmoji(project.emoji);
      form.setValue("name", project.name);
      form.setValue("description", project.description);
    }
  }, [form, project]);

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <DialogTitle
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Edit Project
          </DialogTitle>
          <p className="text-muted-foreground text-sm leading-tight">
            Update the project details to refine task management
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
                  <span className="text-4xl">{emoji}</span>
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
            <Input placeholder="Project Title" {...form.register("name")} />
            {form.formState.errors.name && (
              <p>{form.formState.errors.name.message}</p>
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
            {form.formState.errors.name && (
              <p>{form.formState.errors.name.message}</p>
            )}
          </div>

          <Button
            disabled={isPending}
            className="flex place-self-end  h-[40px] text-white font-semibold"
            type="submit"
          >
            {isPending && <Loader className="animate-spin" />} Update
          </Button>
        </form>
      </div>
    </div>
  );
}
