import { z } from "zod";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  TaskPriorityEnum,
  TaskPriorityEnumType,
  TaskStatusEnum,
  TaskStatusEnumType,
} from "@/constant";
import { transformOptions } from "@/utils/helper";
import { Label } from "@/components/ui/label";

export default function CreateTaskForm(props: {
  projectId?: string;
  onClose: () => void;
}) {
  const { projectId, onClose } = props;

  const workspaceId = useWorkspaceId();

  const isLoading = false;

  //const projectOptions = []

  // Workspace Memebers
  //const membersOptions = []

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
    },
  });

  const taskStatusList = Object.values(TaskStatusEnum);
  const taskPriorityList = Object.values(TaskPriorityEnum); // ["LOW", "MEDIUM", "HIGH", "URGENT"]

  const statusOptions = transformOptions(taskStatusList);
  const priorityOptions = transformOptions(taskPriorityList);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values, { workspaceId: workspaceId });
    onClose();
  };

  return (
    <div className="w-full h-auto max-w-full">
      <div className="h-full">
        <div className="mb-5 pb-2 border-b">
          <h1
            className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-semibold mb-1
           text-center sm:text-left"
          >
            Create Task
          </h1>
          <p className="text-muted-foreground text-sm leading-tight">
            Organize and manage tasks, resources, and team collaboration
          </p>
        </div>
        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <Label className="dark:text-[#f1f7feb5] text-sm">Task title</Label>
            <Input
              placeholder="Website Redesign"
              className="!h-[48px]"
              {...form.register("title")}
            />
          </div>

          {/* {Description} */}
          <div>
            <Label className="dark:text-[#f1f7feb5] text-sm">
              Task description
              <span className="text-xs font-extralight ml-2">Optional</span>
            </Label>
            <Textarea
              rows={1}
              placeholder="Description"
              {...form.register("description")}
            />
          </div>

          {/* {ProjectId} */}

          {!projectId && (
            <div>
              <Label>Project</Label>
              <Select
                {...form.register("projectId")}
                onValueChange={(value) => form.setValue(value)}
                // defaultValue={field.value}
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
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.projectId && (
                <p>{form.formState.errors.projectId.message}</p>
              )}
            </div>
          )}

          {/* {Members AssigneeTo} */}

          <div>
            <Label>Assigned To</Label>
            <Select
              {...form.register("assignedTo")}
              onValueChange={(value) => form.setValue(value)}
              // defaultValue={field.value}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="m@example.com">m@example.com</SelectItem>
                <SelectItem value="m@google.com">m@google.com</SelectItem>
                <SelectItem value="m@support.com">m@support.com</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.assignedTo && (
              <p>{form.formState.errors.assignedTo.message}</p>
            )}
          </div>

          {/* {Due Date} */}
          <div className="!mt-2">
            <Label>Due Date</Label>
            <Popover>
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
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={
                    (date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0)) || // Disable past dates
                      date > new Date("2100-12-31") //Prevent selection beyond a far future date
                  }
                  initialFocus
                  defaultMonth={new Date()}
                  fromMonth={new Date()}
                />
              </PopoverContent>
            </Popover>
            {form.formState.errors.dueDate && (
              <p>{form.formState.errors.dueDate.message}</p>
            )}
          </div>

          {/* {Status} */}

          <div>
            <Label>Status</Label>
            <Select
              {...form.register("status")}
              onValueChange={(value: TaskStatusEnumType) =>
                form.setValue("status", value)
              }
              defaultValue={statusOptions[0].value}
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
            {form.formState.errors.status && (
              <p>{form.formState.errors.status.message}</p>
            )}
          </div>

          {/* {Priority} */}
          <div>
            <Label>Priority</Label>
            <Select
              {...form.register("priority")}
              onValueChange={(value: TaskPriorityEnumType) =>
                form.setValue("priority", value)
              }
              defaultValue={priorityOptions[0].value}
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
            {form.formState.errors.priority && (
              <p>{form.formState.errors.priority.message}</p>
            )}
          </div>

          <Button
            className="flex place-self-end  h-[40px] text-white font-semibold"
            type="submit"
          >
            <Loader className="animate-spin" />
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}
