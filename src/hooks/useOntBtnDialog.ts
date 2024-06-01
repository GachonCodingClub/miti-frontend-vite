import { useState } from "react";

export const useOneBtnDialog = () => {
  const [oneBtnDialog, setOneBtnDialog] = useState<{
    open: boolean;
    title: string;
    contents?: string;
  }>({
    open: false,
    title: "",
    contents: "",
  });

  const showOneBtnDialog = (message: string, contents?: string) => {
    setOneBtnDialog({ open: true, title: message, contents: contents });
  };

  const hideOneBtnDialog = () => {
    setOneBtnDialog({ open: false, title: "" });
  };

  return {
    oneBtnDialog,
    showOneBtnDialog,
    hideOneBtnDialog,
  };
};
