import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NavBar from "./components/navbar/NavBar";
import Products from "./components/pages/Products";
import Orders from './components/pages/orders/Orders';
import Reports from './components/pages/Reports';
import Debits from './components/pages/Debits';
import Home from './components/pages/home/Home';
import { Container, Space } from '@mantine/core';

export const COOKIE_NAME = 'app'

function App() {

  const maw = "80vw"

  return (

    <BrowserRouter>
      <Container maw="100vw" bg="var(--generic-blue)" style={{
        boxShadow: "0 2px 4px 0 rgba(0, 0, 0, .3)",
      }} >
        <NavBar maw={maw} />
      </Container>
      <Space h="md" />
      <Container maw={maw}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers-debits" element={<Debits />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}
export default App