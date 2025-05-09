import { Snackbar } from "@mui/material";
import React, {useState} from "react";

export const Banner = (message: any) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
   <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
      message={message}
  />
  );
};
