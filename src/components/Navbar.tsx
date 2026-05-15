import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, Trash2, Plus, Minus, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants';
import { useCart } from '../context/CartContext';
import BrandLogo from './BrandLogo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderStatus, setOrderStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [tokenNumber, setTokenNumber] = useState<string | null>(null);
  const { cart, totalItems, totalPrice, addToCart, decrementQuantity, removeFromCart, clearCart } = useCart();

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderStatus('processing');
    
    // Generate token number
    const newToken = Math.floor(Math.random() * 900 + 100).toString();
    setTokenNumber(newToken);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOrderStatus('success');
    setTimeout(() => {
      clearCart();
      setIsCartOpen(false);
      setIsCheckout(false);
      setOrderStatus('idle');
      setTokenNumber(null);
    }, 5000);
  };

  useEffect(() => {
    if (isCartOpen) setIsCheckout(false);
  }, [isCartOpen]);

  useEffect(() => {
    if (isCartOpen || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen, isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'About', path: '/#about' },
    { title: 'Menu', path: '/#menu' },
    { title: 'Contact', path: '/#contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0C0C0C]/90 backdrop-blur-xl py-4 shadow-2xl' : 'bg-transparent py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo className="w-10 h-10" color="#CC5500" />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-[#CC5500] leading-none tracking-tighter">SAMPURN</span>
            <span className="text-xl font-medium text-[#D4AF37] leading-none tracking-[0.2em] mt-1 italic">BENNE</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-12">
          {navLinks.map((link) => (
            <motion.a
              key={link.title}
              href={link.path}
              whileHover={{ scale: 1.05, color: '#CC5500' }}
              className="text-sm font-semibold tracking-widest uppercase transition-colors"
              style={{ color: COLORS.ivory }}
            >
              {link.title}
            </motion.a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2"
            style={{ color: COLORS.ivory }}
          >
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#CC5500] text-white text-[10px] flex items-center justify-center rounded-full font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Cart / Menu Toggle */}
        <div className="flex items-center gap-4 lg:hidden">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2"
            style={{ color: COLORS.ivory }}
          >
            <ShoppingCart className="w-5 h-5" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-[#CC5500] text-white text-[10px] flex items-center justify-center rounded-full font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
          
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2"
            style={{ color: COLORS.ivory }}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed top-0 left-0 h-full w-full max-w-[300px] bg-[#0C0C0C] z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <BrandLogo className="w-8 h-8" color="#CC5500" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white">
                  <X />
                </button>
              </div>

              <div className="flex-1 p-8 space-y-8">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.title}
                    href={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-2xl font-black tracking-tighter text-[#FFFFF0] hover:text-[#CC5500] transition-colors"
                  >
                    {link.title}
                  </motion.a>
                ))}
              </div>

              <div className="p-8 border-t border-white/5 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFFFF0]/20 italic line-through">
                  Sampurn Benne
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0C0C0C] z-[70] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="text-[#CC5500]" />
                  <h3 className="text-2xl font-black tracking-tighter">YOUR CART</h3>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                <AnimatePresence mode="wait">
                  {orderStatus === 'success' ? (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center gap-6"
                    >
                      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(34,197,94,0.3)]">
                        <Check size={40} />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black tracking-tighter mb-2">ORDER PLACED!</h3>
                        <p className="text-[#FFFFF0]/40 font-medium">Your delicious meal is being prepared. We'll update you shortly.</p>
                      </div>
                      {tokenNumber && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-white/5 p-6 rounded-3xl border border-white/10 w-full max-w-[200px]"
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-2">Token Number</p>
                          <p className="text-5xl font-black tracking-tighter text-[#D4AF37]">#{tokenNumber}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : isCheckout ? (
                    <motion.div 
                      key="checkout"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <button 
                        onClick={() => setIsCheckout(false)}
                        className="text-[10px] font-black uppercase tracking-widest text-[#CC5500] flex items-center gap-2"
                      >
                        ← Back to Cart
                      </button>
                      <div className="space-y-6">
                        <h4 className="text-xl font-black tracking-tight">Checkout Details</h4>
                        <form onSubmit={handleCheckout} className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Full Name</label>
                            <input required type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#CC5500]/50 transition-colors" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-white/30">Phone Number</label>
                            <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#CC5500]/50 transition-colors" placeholder="+91 99999 99999" />
                          </div>
                          <button 
                            disabled={orderStatus === 'processing'}
                            type="submit" 
                            className="w-full py-5 bg-[#CC5500] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                          >
                            {orderStatus === 'processing' ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                Processing...
                              </>
                            ) : `Pay ₹${totalPrice}`}
                          </button>
                        </form>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="cart"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <AnimatePresence mode="popLayout" initial={false}>
                        {cart.length === 0 ? (
                          <motion.div 
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="h-[60vh] flex flex-col items-center justify-center text-center gap-4 opacity-30"
                          >
                            <ShoppingCart size={64} />
                            <p className="text-lg font-bold">Your cart is empty</p>
                          </motion.div>
                        ) : (
                          cart.map((item) => (
                            <motion.div 
                              key={item.name}
                              layout
                              initial={{ opacity: 0, scale: 0.9, x: 20 }}
                              animate={{ opacity: 1, scale: 1, x: 0 }}
                              exit={{ opacity: 0, scale: 0.9, x: -20 }}
                              className="flex justify-between items-center group bg-white/[0.02] p-4 rounded-2xl hover:bg-white/[0.05] transition-colors"
                            >
                              <div className="space-y-1">
                                <h4 className="font-bold text-lg">{item.name}</h4>
                                <p className="text-[#D4AF37] font-black">₹{item.price}</p>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center bg-white/5 rounded-xl px-2">
                                  <button 
                                    onClick={() => decrementQuantity(item.name)}
                                    className="p-2 hover:text-[#CC5500] transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                  <span className="w-8 text-center font-bold tracking-tighter">{item.quantity}</span>
                                  <button 
                                    onClick={() => addToCart({ name: item.name, price: item.price })}
                                    className="p-2 hover:text-[#CC5500] transition-colors"
                                  >
                                    <Plus size={14} />
                                  </button>
                                </div>
                                <button 
                                  onClick={() => removeFromCart(item.name)}
                                  className="p-2 text-red-500/40 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {cart.length > 0 && !isCheckout && orderStatus === 'idle' && (
                <div className="p-8 bg-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFFFF0]/40 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                    <span className="text-3xl font-black text-[#D4AF37]">₹{totalPrice}</span>
                  </div>
                  <button 
                    onClick={() => setIsCheckout(true)}
                    className="w-full py-5 bg-[#CC5500] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all"
                  >
                    Proceed to Checkout
                  </button>
                  <button 
                    onClick={clearCart}
                    className="w-full text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white/40 transition-colors"
                  >
                    Clear All Items
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
