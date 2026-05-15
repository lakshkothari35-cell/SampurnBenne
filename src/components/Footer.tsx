import { motion } from 'motion/react';
import { Instagram, MapPin, Phone, Clock } from 'lucide-react';
import { APP_NAME } from '../constants';
import BrandLogo from './BrandLogo';
import { Link } from 'react-router-dom';

const Footer = () => {
  const quickLinks = [
    { title: 'About Us', path: '/#about' },
    { title: 'Signature Menu', path: '/#menu' },
    { title: '3D Experience', path: '#' },
    { title: 'Admin Dashboard', path: '/admin' },
    { title: 'Privacy Policy', path: '#' },
  ];

  return (
    <footer className="bg-[#0a0a0a] pt-20 pb-10 px-6 border-t border-[#FFFFF0]/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-center md:text-left">
        {/* Brand */}
        <div className="space-y-6 flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3">
            <BrandLogo className="w-12 h-12" color="#CC5500" />
            <div className="flex flex-col">
              <span className="text-3xl font-black text-[#CC5500] tracking-tighter">SAMPURN</span>
              <span className="text-xl font-medium text-[#D4AF37] tracking-[0.2em] italic">BENNE</span>
            </div>
          </div>
          <p className="text-[#FFFFF0]/60 text-sm leading-relaxed max-w-xs">
            Bringing the authentic taste of Bangalore's Benne Dosa to the heart of Surat. Experience tradition served with butter and soul.
          </p>
          <div className="flex gap-4">
            <motion.a
              href="https://www.instagram.com/sampurnbenne?igsh=b2dqOWplenhlb2to"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -5, color: '#CC5500' }}
              className="p-2 bg-[#FFFFF0]/5 rounded-lg text-[#FFFFF0]/40 transition-colors"
            >
              <Instagram size={20} />
            </motion.a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-[#CC5500] font-bold uppercase tracking-widest text-xs mb-8">Quick Links</h4>
          <ul className="space-y-4">
            {quickLinks.map((link) => (
              <li key={link.title}>
                {link.path.startsWith('/') ? (
                  <Link to={link.path} className="text-[#FFFFF0]/60 text-sm hover:text-[#FFFFF0] transition-colors">
                    {link.title}
                  </Link>
                ) : (
                  <a href={link.path} className="text-[#FFFFF0]/60 text-sm hover:text-[#FFFFF0] transition-colors">
                    {link.title}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start">
          <h4 className="text-[#CC5500] font-bold uppercase tracking-widest text-xs mb-8">Visit Us</h4>
          <ul className="space-y-4">
            <li className="flex flex-col md:flex-row items-center md:items-start gap-3 text-[#FFFFF0]/60 text-sm">
              <MapPin size={18} className="text-[#D4AF37] shrink-0" />
              <span>GF - 33, Rajmahal Complex, opp. lane of CB Patel Sports Club, Vesu, Surat, Gujarat 395007</span>
            </li>
            <li className="flex flex-col md:flex-row items-center md:items-start gap-3 text-[#FFFFF0]/60 text-sm">
              <Phone size={18} className="text-[#D4AF37] shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex flex-col md:flex-row items-center md:items-start gap-3 text-[#FFFFF0]/60 text-sm">
              <Clock size={18} className="text-[#D4AF37] shrink-0" />
              <div className="flex flex-col">
                <span>Mon: 5:00 PM – 10:30 PM</span>
                <span>Tue-Fri: 10:00 AM – 3:00 PM, 6:30 – 10:30 PM</span>
                <span>Sat-Sun: 8:00 AM – 3:00 PM, 6:30 – 10:30 PM</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[#FFFFF0]/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[#FFFFF0]/30 text-[10px] font-bold uppercase tracking-widest">
        <p>© 2026 {APP_NAME}. All rights reserved.</p>
        <p>Designed with Soul in Surat</p>
      </div>
    </footer>
  );
};

export default Footer;
