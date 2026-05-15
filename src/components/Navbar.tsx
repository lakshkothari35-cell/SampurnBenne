import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COLORS } from '../constants';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cart, totalItems, totalPrice, addToCart, decrementQuantity, removeFromCart, clearCart } = useCart();

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
        <Link to="/" className="flex flex-col">
          <span className="text-2xl font-black text-[#CC5500] leading-none tracking-tighter">SAMPURN</span>
          <span className="text-xl font-medium text-[#D4AF37] leading-none tracking-[0.2em] mt-1 italic">BENNE</span>
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
          <Link to="/admin">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2 bg-[#CC5500] text-white rounded-full font-bold text-xs uppercase tracking-widest shadow-[0_0_20px_rgba(204,85,0,0.3)]"
            >
              Order Now
            </motion.button>
          </Link>
        </div>

        {/* Mobile Toggle & Cart */}
        <div className="flex items-center gap-4 lg:hidden">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsCartOpen(true)}
            className="relative p-2"
            style={{ color: COLORS.ivory }}
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#CC5500] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                {totalItems}
              </span>
            )}
          </motion.button>
          <button 
            className="p-2"
            style={{ color: COLORS.ivory }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

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
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 opacity-30">
                    <ShoppingCart size={64} />
                    <p className="text-lg font-bold">Your cart is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.name} className="flex justify-between items-center group">
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
                          <span className="w-8 text-center font-bold">{item.quantity}</span>
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
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-white/5 space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[#FFFFF0]/40 font-bold uppercase tracking-widest text-xs">Subtotal</span>
                    <span className="text-3xl font-black text-[#D4AF37]">₹{totalPrice}</span>
                  </div>
                  <button className="w-full py-5 bg-[#CC5500] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-all">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0C0C0C]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-10 lg:hidden p-6"
          >
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-8 right-8 p-3 bg-white/5 rounded-full"
            >
              <X size={32} />
            </button>
            
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <motion.a
                  key={link.title}
                  href={link.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-5xl font-black tracking-tighter hover:text-[#CC5500] transition-colors"
                  style={{ color: COLORS.ivory }}
                >
                  {link.title}
                </motion.a>
              ))}
            </div>

            <div className="flex flex-col gap-4 w-full max-w-xs mt-8">
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                <button className="w-full py-5 bg-[#CC5500] text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl">
                  Admin Portal
                </button>
              </Link>
              <button 
                onClick={() => { setIsMenuOpen(false); setIsCartOpen(true); }}
                className="w-full py-5 border border-white/10 text-white rounded-3xl font-black uppercase tracking-[0.2em] text-xs"
              >
                View Cart ({totalItems})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
