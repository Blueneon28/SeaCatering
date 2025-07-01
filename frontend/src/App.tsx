import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { Router } from "./Router";
import { theme } from "./theme";
import { AuthProvider } from "./contexts/AuthContext";

// Import Mantine styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";

function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <AuthProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
