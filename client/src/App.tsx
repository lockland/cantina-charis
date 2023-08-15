import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NavBar from "./components/NavBar";
import Products from "./components/pages/Products";
import Orders from './components/pages/Orders';
import Reports from './components/pages/Reports';
import Debits from './components/pages/Debits';
import Home from './components/pages/Home';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <div className='App' >
      <MantineProvider withNormalizeCSS>
        <BrowserRouter>
          <NavBar />
          <div className='pages'>
            <div className='page'>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/customers-debits" element={<Debits />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </MantineProvider>
    </div>
  )
}
export default App