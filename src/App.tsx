/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import { COLORS } from './constants';

const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div 
          className="min-h-screen flex flex-col selection:bg-[#CC5500] selection:text-white"
          style={{ backgroundColor: COLORS.charcoal, color: COLORS.ivory }}
        >
          <Navbar />
          <div className="flex-1">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
