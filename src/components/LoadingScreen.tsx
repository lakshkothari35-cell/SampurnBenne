import { motion } from 'motion/react';
import { COLORS, APP_NAME } from '../constants';
import BrandLogo from './BrandLogo';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C0C0C]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
          className="mb-12 relative flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-[#CC5500] rounded-full blur-[60px] opacity-20" />
          <BrandLogo className="w-24 h-24 relative z-10" color="#CC5500" />
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold tracking-tighter text-[#CC5500]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {APP_NAME}
        </motion.h1>
        
        <motion.p
          className="mt-2 text-sm text-[#FFFFF0]/60 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Preparing Authentic Banglorian Taste...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
