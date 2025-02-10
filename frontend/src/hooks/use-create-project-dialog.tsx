import { parseAsBoolean, useQueryState } from "nuqs";

export default function useCreateProjectDialog() {
  const [open, setOpen] = useQueryState(
    "new-project",
    parseAsBoolean.withDefault(false)
  );
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);
  return { open, onOpen, onClose };
}
