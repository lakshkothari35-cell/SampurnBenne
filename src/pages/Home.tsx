import Hero from '../components/Hero';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Utensils, Star, MapPin, Plus, Check } from 'lucide-react';
import { COLORS } from '../constants';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Home = () => {
  const { addToCart } = useCart();
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const handleAddToCart = (name: string, priceStr: string) => {
    const price = parseInt(priceStr.replace('₹', ''));
    addToCart({ name, price });
    setAddedItem(name);
    setTimeout(() => setAddedItem(null), 2000);
  };
  return (
    <main className="relative w-full">
      <Hero />
      
      {/* About Section */}
      <section id="about" className="py-24 lg:py-32 px-6 relative overflow-hidden" style={{ backgroundColor: COLORS.ivory }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="relative">
            <motion.div 
              whileInView={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              viewport={{ once: true }}
              className="aspect-square bg-gradient-to-br from-[#CC5500]/10 to-transparent p-6 lg:p-12 rounded-[40px] lg:rounded-[60px] relative z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1541288097918-74630468347a?auto=format&fit=crop&q=80&w=800" 
                alt="Benne Dosa Making" 
                className="w-full h-full object-cover rounded-[30px] lg:rounded-[40px] shadow-2xl transition-all duration-700"
              />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#CC5500] rounded-full blur-[80px] opacity-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-[#D4AF37] rounded-full blur-[100px] opacity-10" />
          </div>

          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-6"
          >
            <div className="flex items-center gap-4 text-[#CC5500]">
              <div className="w-12 h-[1px] bg-[#CC5500]" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Our Legacy</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter leading-tight text-[#0C0C0C]">
              Tradition Rooted in <span className="text-[#CC5500]">Karnataka</span>
            </h2>
            <p className="text-base lg:text-lg text-[#0C0C0C]/70 leading-relaxed font-medium">
              Sampurn Benne is more than just a restaurant; it's a culinary journey back to the streets of Davanagere. Our secret lies in the special "Benne" (butter) sourced from traditional dairies, and a roasting technique that ensures every dosa is a perfect golden miracle.
            </p>
            <p className="text-[#0C0C0C]/40 italic border-l-2 border-[#CC5500] pl-6 py-2 text-sm lg:text-base">
              "We don't just sell food, we serve memories of a heritage that dates back generations."
            </p>
            <button className="w-full lg:w-fit mt-4 px-8 py-4 border border-[#0C0C0C]/20 text-[#0C0C0C] rounded-full hover:bg-[#0C0C0C] hover:text-[#FFFFF0] transition-all font-bold uppercase tracking-widest text-xs">
              Discover Our History
            </button>
          </motion.div>
        </div>
      </section>

      {/* Full Menu Section */}
      <section id="menu" className="py-24 lg:py-32 px-6" style={{ backgroundColor: COLORS.charcoal }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-16 lg:mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-[#CC5500] mb-4">The Selection</h2>
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[#FFFFF0]">Traditional Flavours</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Idli / Vada Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <Utensils className="text-[#CC5500]" />
                <h4 className="text-3xl font-black text-[#FFFFF0] uppercase tracking-tighter">Idli / Vada</h4>
              </div>
              <div className="space-y-8">
                {[
                  { name: 'Thatte Idli', price: '₹80' },
                  { name: 'Thatte Idli Ghee / Butter', price: '₹100' },
                  { name: 'Thatte Ghee Podi Idli', price: '₹120' },
                  { name: 'Mini Idli', price: '₹80' },
                  { name: 'Mini Ghee Podi Idli', price: '₹130' },
                  { name: 'Vada (2 Nos)', price: '₹80' },
                ].map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex items-center gap-3">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleAddToCart(item.name, item.price)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            addedItem === item.name 
                              ? 'bg-green-500 text-white' 
                              : 'bg-[#CC5500] text-white lg:opacity-0 lg:group-hover:opacity-100 shadow-lg'
                          }`}
                        >
                          {addedItem === item.name ? <Check size={18} /> : <Plus size={18} />}
                        </motion.button>
                        <span className="text-lg font-bold text-[#FFFFF0] group-hover:text-[#CC5500] transition-colors">{item.name}</span>
                      </div>
                      <div className="flex-1 border-b border-[#FFFFF0]/10 mb-1.5" />
                      <span className="text-lg font-black text-[#D4AF37]">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kaapi Drinks Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <Coffee className="text-[#CC5500]" />
                <h4 className="text-3xl font-black text-[#FFFFF0] uppercase tracking-tighter">Kaapi Drinks</h4>
              </div>
              <div className="space-y-8">
                {[
                  { name: 'Hot Filter Kaapi', price: '₹70' },
                  { name: 'Iced Filter Kaapi', price: '₹110' },
                  { name: 'Hot Kaapi Americano', price: '₹150' },
                  { name: 'Iced Kaapi Americano', price: '₹150' },
                  { name: 'Vietnamese Filter Kaapi', price: '₹170' },
                  { name: 'Filter Kaapi Latte', price: '₹170' },
                ].map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex items-center gap-3">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleAddToCart(item.name, item.price)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            addedItem === item.name 
                              ? 'bg-green-500 text-white' 
                              : 'bg-[#CC5500] text-white lg:opacity-0 lg:group-hover:opacity-100 shadow-lg'
                          }`}
                        >
                          {addedItem === item.name ? <Check size={18} /> : <Plus size={18} />}
                        </motion.button>
                        <span className="text-lg font-bold text-[#FFFFF0] group-hover:text-[#CC5500] transition-colors">{item.name}</span>
                      </div>
                      <div className="flex-1 border-b border-[#FFFFF0]/10 mb-1.5" />
                      <span className="text-lg font-black text-[#D4AF37]">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desserts Section */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <Star className="text-[#CC5500]" />
                <h4 className="text-3xl font-black text-[#FFFFF0] uppercase tracking-tighter">Desserts</h4>
              </div>
              <div className="space-y-8">
                {[
                  { name: 'Filter Kaapi Soft Serve', price: '₹130' },
                  { name: 'Filter Kaapi Soft Serve w Brownie', price: '₹170' },
                  { name: 'Filter Kaapi Soft Serve w Cookie', price: '₹210' },
                ].map((item) => (
                  <div key={item.name} className="group">
                    <div className="flex justify-between items-end gap-4">
                      <div className="flex items-center gap-3">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.1 }}
                          onClick={() => handleAddToCart(item.name, item.price)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                            addedItem === item.name 
                              ? 'bg-green-500 text-white' 
                              : 'bg-[#CC5500] text-white lg:opacity-0 lg:group-hover:opacity-100 shadow-lg'
                          }`}
                        >
                          {addedItem === item.name ? <Check size={18} /> : <Plus size={18} />}
                        </motion.button>
                        <span className="text-lg font-bold text-[#FFFFF0] group-hover:text-[#CC5500] transition-colors">{item.name}</span>
                      </div>
                      <div className="flex-1 border-b border-[#FFFFF0]/10 mb-1.5" />
                      <span className="text-lg font-black text-[#D4AF37]">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-32">
            <button className="px-12 py-5 border-2 border-[#CC5500] text-[#CC5500] rounded-full font-black text-sm uppercase tracking-[0.3em] hover:bg-[#CC5500] hover:text-[#FFFFF0] transition-all">
              Order Online Now
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" style={{ backgroundColor: COLORS.burntOrange }}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: 'Traditional Recipes', value: '50+' },
            { label: 'Happy Customers', value: '10k+' },
            { label: 'Years of Legacy', value: '15+' },
            { label: 'Authentic Spices', value: '100%' },
          ].map((stat, i) => (
            <div key={i}>
              <h5 className="text-5xl font-black text-white mb-2">{stat.value}</h5>
              <p className="text-white/60 text-xs uppercase font-bold tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Map/Contact Section */}
      <section id="contact" className="py-32 px-6" style={{ backgroundColor: COLORS.ivory }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#0C0C0C]">Find Us in the Heart of Surat</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-[#CC5500] mt-1 shrink-0" />
                <div>
                  <h6 className="font-bold text-[#0C0C0C]">Address</h6>
                  <p className="text-[#0C0C0C]/60 text-sm">G-12, Premium Plaza, Vesu Main Road, Surat</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Coffee className="text-[#CC5500] mt-1 shrink-0" />
                <div>
                  <h6 className="font-bold text-[#0C0C0C]">Brew Hours</h6>
                  <p className="text-[#0C0C0C]/60 text-sm">Mon - Sun: 7:00 AM - 11:00 PM</p>
                </div>
              </div>
            </div>
            <button className="w-full lg:w-fit px-8 py-4 bg-[#CC5500] text-white rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-xl">
              Get Directions
            </button>
          </div>
          
          <div className="aspect-video bg-[#0C0C0C] rounded-[30px] lg:rounded-[40px] overflow-hidden border border-[#0C0C0C]/10 relative grayscale hover:grayscale-0 transition-all">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14878.711200085!2d72.7833075!3d21.1444144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04d9a40000001%3A0xc4f54e601556819!2sVesu%2C%20Surat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              className="w-full h-full grayscale"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
