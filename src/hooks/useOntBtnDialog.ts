import { useState } from "react";

export const useOneBtnDialog = () => {
  const [oneBtnDialog, setOneBtnDialog] = useState<{
    open: boolean;
    title: string;
  }>({
    open: false,
    title: "",
  });

  const showOneBtnDialog = (message: string) => {
    setOneBtnDialog({ open: true, title: message });
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
