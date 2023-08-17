import { BrowserRouter, Route, Routes } from 'react-router-dom'

import NavBar from "./components/NavBar";
import Products from "./components/pages/Products";
import Orders from './components/pages/Orders';
import Reports from './components/pages/Reports';
import Debits from './components/pages/Debits';
import Home from './components/pages/Home';

function App() {
  return (
    <div className='App' >
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
    </div >
  )
}
export default App