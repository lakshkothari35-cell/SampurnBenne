import { motion } from 'motion/react';
import ThreeScene from './ThreeScene';
import { BRAND_TAGLINE, BRAND_TAGLINE_SUB, COLORS } from '../constants';
import BrandLogo from './BrandLogo';

const Hero = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden" style={{ backgroundColor: COLORS.charcoal }}>
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 2 }}
          className="text-[60vw] md:text-[40vw] font-black text-white whitespace-nowrap"
        >
          SAMPURN
        </motion.h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12 z-10 py-20 lg:py-0">
        <div className="flex flex-col gap-6 lg:gap-8 order-2 lg:order-1 text-center lg:text-left items-center lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col items-center lg:items-start gap-6"
          >
            <BrandLogo className="w-16 h-16 lg:w-20 lg:h-20" color="#CC5500" />
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-[#CC5500]/10 text-[#CC5500] text-[10px] lg:text-xs font-bold uppercase tracking-widest border border-[#CC5500]/20 mb-4">
                Premium Dining Experience
              </span>
              <h2 className="text-5xl md:text-6xl lg:text-8xl font-black leading-[0.9] tracking-tighter" style={{ color: COLORS.ivory }}>
                {BRAND_TAGLINE.split(' ').map((word, i) => (
                  <motion.span 
                    key={i} 
                    className="block"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    {word === 'Benne' ? <span className="text-[#CC5500]">{word}</span> : word}
                  </motion.span>
                ))}
              </h2>
              <p className="mt-6 text-base lg:text-xl text-[#FFFFF0]/60 max-w-md leading-relaxed font-medium mx-auto lg:mx-0">
                {BRAND_TAGLINE_SUB}
              </p>
            </div>
          </motion.div>

            <motion.div className="flex flex-wrap justify-center lg:justify-start gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <a href="#menu" className="px-8 lg:px-10 py-4 lg:py-5 bg-[#CC5500] text-white rounded-full font-black text-[10px] lg:text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(204,85,0,0.3)] hover:shadow-[0_25px_60px_rgba(204,85,0,0.5)] transition-all hover:-translate-y-1 inline-block">
              Explore Menu
            </a>
            <a href="#about" className="px-8 lg:px-10 py-4 lg:py-5 bg-transparent border-2 border-white/10 text-white rounded-full font-black text-[10px] lg:text-sm uppercase tracking-[0.2em] hover:bg-white/5 transition-all inline-block">
              Our Story
            </a>
          </motion.div>

          <motion.div 
            className="flex gap-8 lg:gap-12 mt-4 lg:mt-8 pt-8 border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <div>
              <p className="text-2xl lg:text-3xl font-black text-[#D4AF37]">10k+</p>
              <p className="text-[8px] lg:text-[10px] uppercase tracking-widest opacity-40">Happy Guests</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black text-[#D4AF37]">4.9/5</p>
              <p className="text-[8px] lg:text-[10px] uppercase tracking-widest opacity-40">Rating</p>
            </div>
            <div>
              <p className="text-2xl lg:text-3xl font-black text-[#D4AF37]">100%</p>
              <p className="text-[8px] lg:text-[10px] uppercase tracking-widest opacity-40">Authentic</p>
            </div>
          </motion.div>
        </div>

        {/* 3D Scene Container */}
        <div className="h-[40vh] md:h-[50vh] lg:h-[80vh] w-full order-1 lg:order-2 relative cursor-grab active:cursor-grabbing scale-75 lg:scale-100">
          <div className="absolute inset-0 bg-[#CC5500]/5 rounded-full blur-[100px] animate-pulse" />
          <ThreeScene />
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-white">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-[#CC5500] to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;
