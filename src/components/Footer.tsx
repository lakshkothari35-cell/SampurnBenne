import { motion } from 'framer-motion';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';
import { APP_NAME } from '../constants';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] pt-20 pb-10 px-6 border-t border-[#FFFFF0]/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="text-3xl font-black text-[#CC5500] tracking-tighter">SAMPURN</span>
            <span className="text-xl font-medium text-[#D4AF37] tracking-[0.2em] italic">BENNE</span>
          </div>
          <p className="text-[#FFFFF0]/60 text-sm leading-relaxed max-w-xs">
            Bringing the authentic taste of Karnataka's Benne Dosa to the heart of Surat. Experience tradition served with butter and soul.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ y: -5, color: '#CC5500' }}
                className="p-2 bg-[#FFFFF0]/5 rounded-lg text-[#FFFFF0]/40 transition-colors"
              >
                <Icon size={20} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-[#CC5500] font-bold uppercase tracking-widest text-xs mb-8">Quick Links</h4>
          <ul className="space-y-4">
            {['About Us', 'Signature Menu', '3D Experience', 'Admin Dashboard', 'Privacy Policy'].map((item) => (
              <li key={item}>
                <a href="#" className="text-[#FFFFF0]/60 text-sm hover:text-[#FFFFF0] transition-colors">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-[#CC5500] font-bold uppercase tracking-widest text-xs mb-8">Visit Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-[#FFFFF0]/60 text-sm">
              <MapPin size={18} className="text-[#D4AF37] shrink-0" />
              <span>Sampurn Benne, Veshu, Surat, Gujarat 395007</span>
            </li>
            <li className="flex gap-3 text-[#FFFFF0]/60 text-sm">
              <Phone size={18} className="text-[#D4AF37] shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex gap-3 text-[#FFFFF0]/60 text-sm">
              <Mail size={18} className="text-[#D4AF37] shrink-0" />
              <span>hello@sampurnbenne.com</span>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-[#CC5500] font-bold uppercase tracking-widest text-xs mb-8">Newsletter</h4>
          <p className="text-[#FFFFF0]/60 text-sm mb-4">Get updates on special seasonal menus.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address"
              className="bg-[#FFFFF0]/5 border border-[#FFFFF0]/10 rounded-lg px-4 py-2 text-sm w-full outline-none focus:border-[#CC5500]/50"
            />
            <button className="px-4 py-2 bg-[#CC5500] rounded-lg text-xs font-bold uppercase">Join</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#FFFFF0]/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[#FFFFF0]/30 text-xs">
        <p>© 2026 {APP_NAME}. All rights reserved.</p>
        <p>Designed with Soul in Surat</p>
      </div>
    </footer>
  );
};

export default Footer;
