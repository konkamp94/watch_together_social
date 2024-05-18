import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// material UI imports
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from 'react-query'
// context providers
import { AuthProvider } from './context/auth.context.tsx'
import { ReactQueryDevtools } from 'react-query/devtools'

const theme = createTheme({
  palette: {
    primary: {
      main: '#74709c',
      light: '#a39ecd',
      dark: '#47456e',
      contrastText: '#00000099'
    },
    secondary: {
      main: '#9a9b9e',
      light: '#cbcccf',
      dark: '#6c6d70',
      contrastText: '#000'
    }
  }
});

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
            <ThemeProvider theme={theme}>
              <ReactQueryDevtools initialIsOpen={false} />
              <App />
            </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
