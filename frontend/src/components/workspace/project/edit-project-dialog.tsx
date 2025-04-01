import { Edit2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditProjectForm from "./edit-project-form";
import { ProjectType } from "@/types/api.type";
import { useState } from "react";

const EditProjectDialog = (props: { project?: ProjectType }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog modal={true} open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="mt-1.5 flex items-center" asChild>
        <button>
          <Edit2 className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg border-0">
        <EditProjectForm project={props.project} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default EditProjectDialog;
