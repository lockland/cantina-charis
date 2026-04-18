import { BrowserRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import NavBar from "./components/navbar/NavBar";
import Products from "./components/pages/products/Products";
import Orders from './components/pages/orders/Orders';
import ReportsLayout from './components/pages/reports/ReportsLayout';
import ReportsIndex from './components/pages/reports/ReportsIndex';
import ReportSummaryPage from './components/pages/reports/ReportSummaryPage';
import ReportBalancePage from './components/pages/reports/ReportBalancePage';
import ReportPaymentsByCustomerPage from './components/pages/reports/ReportPaymentsByCustomerPage';
import ReportSoldProductsPage from './components/pages/reports/ReportSoldProductsPage';
import ReportOutgoingsPage from './components/pages/reports/ReportOutgoingsPage';
import Debits from './components/pages/debits/Debits';
import Home from './components/pages/home/Home';
import { Container, Space } from '@mantine/core';

import { useSharedContext } from "./hooks/useSharedContext"
import { useEffect } from 'react';
import { getAuthMe, getOpenEvent } from './hooks/useAPI';
import Event from './models/Event';

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
  const { setHomePage, setRole, setOpenEvent, setOpenEventHydrated } = useSharedContext()

  useEffect(() => {
    getAuthMe()
      .then((data) => setRole(data.role))
      .catch(() => { })
  }, [setRole])

  useEffect(() => {
    getOpenEvent().then((event: Event) => {
      const page = (event.event_id > 0) ? "cashpage" : "initial"
      setOpenEvent(event)
      setOpenEventHydrated(true)
      setHomePage(page)
    })
  }, [setHomePage, setOpenEvent, setOpenEventHydrated])

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
            <Route path="/reports" element={<ReportsLayout />}>
              <Route index element={<ReportsIndex />} />
              <Route path="summary" element={<ReportSummaryPage />} />
              <Route path="balance" element={<ReportBalancePage />} />
              <Route path="payments-by-customer" element={<ReportPaymentsByCustomerPage />} />
              <Route path="sold-products" element={<ReportSoldProductsPage />} />
              <Route path="outgoings" element={<ReportOutgoingsPage />} />
            </Route>
            <Route path="/customers-debits" element={<Debits />} />
          </Routes>
        </ViewerRouteGuard>
      </Container>
    </BrowserRouter>
  )
}
export default App
