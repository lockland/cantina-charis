import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ButtonStylesParams, MantineProvider } from '@mantine/core'
import { CookiesProvider } from 'react-cookie'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider withNormalizeCSS withCSSVariables
      inherit
      theme={{
        components: {
          Button: {
            styles: (theme, params: ButtonStylesParams, { variant }) => ({
              root: {
                backgroundColor:
                  variant === 'filled' ? "var(--button-color)" : undefined,
              },
            }),
          },
          TextInput: {
            styles: () => ({
              label: {
                color: "initial",
              },
              input: {
                border: "none",
                borderRadius: 0
              }
            }),
          },
          NumberInput: {
            styles: () => ({
              label: {
                color: "initial",
              },
              input: {
                border: "none",
                borderRadius: 0
              }
            }),
          }
        }
      }}
    >
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </MantineProvider>
  </React.StrictMode>,
)
