import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import 'dayjs/locale/pt-br'
import { SharedContextProvider } from './contexts/sharedContext.tsx'
import { AppMantineProvider } from './mantine'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppMantineProvider>
      <SharedContextProvider>
        <App />
      </SharedContextProvider>
    </AppMantineProvider>
  </React.StrictMode>,
)
