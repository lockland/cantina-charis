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
          Accordion: {
            styles: {
              panel: {
                backgroundColor: "var(--generic-blue)",
              },
              control: {
                backgroundColor: "var(--generic-blue)",
              },
              item: {
                backgroundColor: "var(--generic-blue)",
                border: "none",
                color: "var(--main-color)"
              },
              label: {
                color: "var(--main-color)"
              }
            }
          },
          Modal: {
            styles: {
              content: {
                backgroundColor: "var(--generic-blue)"
              },
              header: {
                backgroundColor: "var(--generic-blue)",
                color: "var(--main-color)"
              }
            }
          },
          Button: {
            styles: (_theme, _params: ButtonStylesParams, { variant }) => ({
              root: {
                backgroundColor:
                  variant === 'filled' ? "var(--button-color)" : undefined,
              },
            }),
          },
          TextInput: {
            styles: () => ({
              label: {
                color: "var(--main-color)",
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
                color: "var(--main-color)",
              },
              input: {
                border: "none",
                borderRadius: 0
              }
            }),
          },
          Select: {
            styles: () => ({
              label: {
                color: "var(--main-color)",
              },
              input: {
                border: "none",
                borderRadius: 0
              }
            }),
          },
          Checkbox: {
            styles: () => ({
              label: {
                color: "var(--main-color)",
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
