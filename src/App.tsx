import { BrowserRouter } from "react-router-dom";
import { Header } from "@components/Header/Header";
import { Router } from "./Router/Router";
import { useAuth } from "@hooks/useAuth";
import { MantineProvider } from "@mantine/core";
import { createTheme } from "@mantine/core";
import { BASE_HOST } from "@/contants";
import { PageWrapper } from "@components/PageWrapper/PageWrapper";

const theme = createTheme({});

function App() {
  useAuth();

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter basename={BASE_HOST}>
        <Header />
        <PageWrapper>
          <Router />
        </PageWrapper>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
