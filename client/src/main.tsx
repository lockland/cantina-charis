import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ButtonStylesParams, MantineProvider } from '@mantine/core'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider withNormalizeCSS
      theme={{
        components: {
          Button: {
            styles: (theme, params: ButtonStylesParams, { variant }) => ({
              root: {
                height: '2.625rem',
                padding: '0 1.875rem',
                backgroundColor:
                  variant === 'filled'
                    ? "var(--button-color)"
                    : undefined,
              },
            }),
          }
        }
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
)
