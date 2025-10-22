import { BrowserRouter } from "react-router-dom";
import { Header } from "./components/Header";
import { Router } from "./Router";
import { useAuth } from "./hooks/useAuth";
import { MantineProvider } from '@mantine/core';

import { createTheme } from '@mantine/core';

const theme = createTheme({});

function App() {
  useAuth();

  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Header />
        <article className="container-pages">
          <div className="content">
            <Router />
          </div>
        </article>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App;