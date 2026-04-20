import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MantineProvider } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { Notifications } from '@mantine/notifications'
import 'dayjs/locale/pt-br'
import { SharedContextProvider } from './contexts/sharedContext.tsx'
import { theme } from './theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider withNormalizeCSS withCSSVariables inherit theme={theme}>
      <DatesProvider settings={{ locale: 'pt-br', firstDayOfWeek: 0 }}>
        <Notifications position="top-right" zIndex={4000} limit={5} />
        <SharedContextProvider>
          <App />
        </SharedContextProvider>
      </DatesProvider>
    </MantineProvider>
  </React.StrictMode>,
)
