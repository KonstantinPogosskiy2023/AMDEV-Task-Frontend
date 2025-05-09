import AppRouter from './routes/AppRouter';
import React from "react";
import { SnackbarProvider } from "notistack";

const App = () => (
  <SnackbarProvider maxSnack={3}>
      <AppRouter />
  </SnackbarProvider>
);

export default App;
