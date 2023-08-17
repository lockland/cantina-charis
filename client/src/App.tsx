import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NavBar from "./components/NavBar";
import Products from "./components/pages/Products";
import Orders from './components/pages/Orders';
import Reports from './components/pages/Reports';
import Debits from './components/pages/Debits';
import Home from './components/pages/home/Home';
import { Box } from '@mantine/core';

export const COOKIE_NAME = 'app'

function App() {
  return (
    <Box className='App' >
      <BrowserRouter>

        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/customers-debits" element={<Debits />} />
        </Routes>
      </BrowserRouter>
    </Box >
  )
}
export default App