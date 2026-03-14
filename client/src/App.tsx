import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import NavBar from "./components/navbar/NavBar";
import Products from "./components/pages/products/Products";
import Orders from './components/pages/orders/Orders';
import Reports from './components/pages/reports/Reports';
import Debits from './components/pages/debits/Debits';
import Home from './components/pages/home/Home';
import { Container, Space } from '@mantine/core';

export const COOKIE_NAME = 'app'

import { useSharedContext } from "./hooks/useSharedContext"
import { useEffect } from 'react';
import { getAuthMe, getOpenEvent } from './hooks/useAPI';
import Event from './models/Event';
import { useCookiesHook } from './hooks/useCookiesHook';

function ViewerRouteGuard({ children }: { children: React.ReactNode }) {
  const { role } = useSharedContext()
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (role === 'viewer' && location.pathname !== '/orders') {
      navigate('/orders', { replace: true })
    }
  }, [role, location.pathname, navigate])
  if (role === 'viewer' && location.pathname !== '/orders') {
    return null
  }
  return <>{children}</>
}

function App() {
  const { setEventData, removeAppCookie } = useCookiesHook()
  const { homePage, setHomePage, setRole } = useSharedContext()

  useEffect(() => {
    getAuthMe()
      .then((data) => setRole(data.role))
      .catch(() => {})
  }, [setRole])

  useEffect(() => {

    getOpenEvent().then((event: Event) => {
      if (event.event_id > 0) {
        setEventData(event)
        setHomePage("cashpage")
      } else {
        removeAppCookie()
        setHomePage("initial")
      }
    })
  }, [homePage])

  const maw = "100vw"

  return (

    <BrowserRouter>
      <Container maw="110vw" bg="var(--generic-blue)" style={{
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, .3)",
      }} >
        <NavBar maw={maw} />
      </Container>
      <Space h="md" />
      <Container maw={maw}>
        <ViewerRouteGuard>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/customers-debits" element={<Debits />} />
          </Routes>
        </ViewerRouteGuard>
      </Container>
    </BrowserRouter>
  )
}
export default App