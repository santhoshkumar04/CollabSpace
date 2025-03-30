import useCreateWorkspaceDialog from "@/hooks/use-create-workspace-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CreateWorkspaceForm from "./create-workspace-form";
export default function CreateWorkspaceDialog() {
  const { open, onClose } = useCreateWorkspaceDialog();

  return (
    <Dialog modal={true} open={open} onOpenChange={onClose}>
      <DialogContent className="!p-0 overflow-hidden border-0">
        <CreateWorkspaceForm {...{ onClose }} />
      </DialogContent>
    </Dialog>
  );
}
