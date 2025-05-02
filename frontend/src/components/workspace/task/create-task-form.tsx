import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { CalendarIcon, Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "../../ui/textarea";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { TaskPriorityEnum, TaskStatusEnum } from "@/constant";
import {
  getAvatarColor,
  getAvatarFallbackText,
  transformOptions,
} from "@/utils/helper";
import { Label } from "@/components/ui/label";
import UseGetProjectsInWorkspaceQuery from "@/hooks/api/use-get-projects";
import useGetWorkspaceMembers from "@/hooks/api/use-get-workspace-members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTaskMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";

export default function CreateTaskForm(props: {
  projectId?: string;
  onClose: () => void;
}) {
  const { projectId, onClose } = props;

  const workspaceId = useWorkspaceId();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createTaskMutationFn,
  });

  const { data, isLoading } = UseGetProjectsInWorkspaceQuery({
    workspaceId,
    skip: !!projectId,
  });

  const projects = data?.projects || [];

  const projectOprions = projects?.map((project) => {
    return {
      label: (
        <div className="flex items-center gap-1">
          <span>{project.emoji}</span>
          <span>{project.name}</span>
        </div>
      ),
      value: project._id,
    };
  });

  const { data: memberData } = useGetWorkspaceMembers(workspaceId);

  // Workspace Memebers
  const members = memberData?.members || [];

  const membersOptions = members.map((member) => {
    const name = member.userId?.name || "Unknown";
    const initials = getAvatarFallbackText(name);
    const avatarColor = getAvatarColor(name);
    return {
      label: (
        <div className="flex items-center gap-1">
          <Avatar className="h-5 w-5">
            <AvatarFallback className={avatarColor}>{initials}</AvatarFallback>
            <AvatarImage src={member.userId.profilePicture || ""} alt={name} />
          </Avatar>
          <span>{name}</span>
        </div>
      ),
      value: member.userId._id,
    };
  });

  const formSchema = z.object({
    title: z.string().trim().min(1, {
      message: "Title is required",
    }),
    description: z.string().trim(),
    projectId: z.string().trim().min(1, {
      message: "Project is required",
    }),
    status: z.enum(
      Object.values(TaskStatusEnum) as [keyof typeof TaskStatusEnum],
      {
        required_error: "Status is required",
      }
    ),
    priority: z.enum(
      Object.values(TaskPriorityEnum) as [keyof typeof TaskPriorityEnum],
      {
        required_error: "Priority is required",
      }
    ),
    assignedTo: z.string().trim().min(1, {
      message: "AssignedTo is required",
    }),
    dueDate: z.date({
      required_error: "A date of birth is required.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      projectId: projectId ? projectId : "",
      assignedTo: "",
    },
  });

  const taskStatusList = Object.values(TaskStatusEnum);
  const taskPriorityList = Object.values(TaskPriorityEnum); // ["LOW", "MEDIUM", "HIGH", "URGENT"]

  const statusOptions = transformOptions(taskStatusList);
  const priorityOptions = transformOptions(taskPriorityList);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;
    const payload = {
      workspaceId,
      projectId: values.projectId,
      data: {
        ...values,
        dueDate: values.dueDate.toISOString(),
      },
    };
    mutate(payload, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["project-analytics", projectId],
        });
        queryClient.invalidateQueries({
          queryKey: ["all-tasks", workspaceId],
        });
        toast({
          title: "Success",
          description: "Task created successfully",
          variant: "default",
        });
        onClose();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
    console.log(values, { workspaceId: workspaceId });
    onClose();
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <DialogTitle
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Create Task
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm leading-tight">
            Organize and manage tasks, resources, and team collaboration
          </DialogDescription>
        </div>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label className="dark:text-[#f1f7feb5] text-sm">Task title</Label>
            <Input placeholder="Website Redesign" {...form.register("title")} />
          </div>

          {/* {Description} */}
          <div>
            <Label className="dark:text-[#f1f7feb5] text-sm">
              Task description
              <span className="text-xs font-extralight ml-2">Optional</span>
            </Label>
            <Textarea
              rows={3}
              placeholder="Description"
              {...form.register("description")}
            />
          </div>

          {/* {ProjectId} */}

          {!projectId && (
            <div>
              <Label>Project</Label>
              <Controller
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a project" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoading && (
                        <div className="my-2">
                          <Loader className="w-4 h-4 place-self-center flex animate-spin" />
                        </div>
                      )}
                      {projectOprions.map((option) => (
                        <SelectItem
                          className="cursor-pointer"
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {form.formState.errors.projectId && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.projectId.message}
                </p>
              )}
            </div>
          )}

          {/* {Members AssigneeTo} */}

          <div>
            <Label>Assigned To</Label>
            <Controller
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {membersOptions.map((option) => (
                      <SelectItem
                        className="cursor-pointer"
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {form.formState.errors.assignedTo && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.assignedTo.message}
              </p>
            )}
          </div>

          {/* {Due Date} */}
          <div className="!mt-2">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Controller
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full flex-1 pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={field.onChange}
                        disabled={
                          (date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                            date > new Date("2100-12-31") //Prevent selection beyond a far future date
                        }
                        initialFocus
                        defaultMonth={field.value ?? new Date()}
                        fromMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {form.formState.errors.dueDate && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.dueDate.message}
              </p>
            )}
          </div>
          {/* {Status} */}
          <div>
            <Label>Status</Label>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue
                      className="!text-muted-foreground !capitalize"
                      placeholder="Select a status"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions?.map((status) => (
                      <SelectItem
                        className="!capitalize"
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.status && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.status.message}
              </p>
            )}
          </div>
          {/* {Priority} */}
          <div>
            <Label>Priority</Label>
            <Controller
              control={form.control}
              name="priority"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions?.map((priority) => (
                      <SelectItem
                        className="!capitalize"
                        key={priority.value}
                        value={priority.value}
                      >
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {form.formState.errors.priority && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.priority?.message}
              </p>
            )}
          </div>
          <Button
            className="flex place-self-end  h-[40px] text-white font-semibold"
            type="submit"
            disabled={isPending}
          >
            {isPending && <Loader className="animate-spin" />}
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}
