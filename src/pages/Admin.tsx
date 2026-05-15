import { useState, useEffect, FormEvent, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, Timestamp, limit, getDocs, where 
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, signOut, signInAnonymously } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Star, Image, MessageSquare, LogOut, Plus, Trash2, Edit2, 
  ShieldAlert, ShoppingBag, Users, TrendingUp, DollarSign, Bell, Settings, 
  ChevronRight, Search, Filter, Camera, Tag, PieChart, Truck, CheckCircle2, 
  Clock, X, Menu as MenuIcon, MoreVertical, Layers, Zap, Gift, BarChart3, 
  Smartphone, Globe, CreditCard, Home as HomeIcon
} from 'lucide-react';
import { MenuItem, Review, Order, Category } from '../types';
import { COLORS } from '../constants';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell, PieChart as RePieChart, Pie 
} from 'recharts';
import BrandLogo from '../components/BrandLogo';

// --- Mock Stats Data for Charts ---
const REVENUE_DATA = [
  { name: 'Mon', active: 4000, revenue: 2400 },
  { name: 'Tue', active: 3000, revenue: 1398 },
  { name: 'Wed', active: 2000, revenue: 9800 },
  { name: 'Thu', active: 2780, revenue: 3908 },
  { name: 'Fri', active: 1890, revenue: 4800 },
  { name: 'Sat', active: 2390, revenue: 3800 },
  { name: 'Sun', active: 3490, revenue: 4300 },
];

const POPULAR_DISHES = [
  { name: 'Garlic Roast', value: 400 },
  { name: 'Benne Dose', value: 300 },
  { name: 'Filter Coffee', value: 300 },
  { name: 'Idli Vada', value: 200 },
];

const COLORS_CHART = ['#CC5500', '#D4AF37', '#8B4513', '#A0522D'];

type AdminTab = 'dashboard' | 'orders' | 'menu' | 'customers' | 'reviews' | 'gallery' | 'analytics' | 'offers' | 'settings';

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newMenuItem, setNewMenuItem] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    category: 'Dosas',
    imageUrl: '',
    isPopular: false
  });

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (user && (user.email === 'lakshkothari35@gmail.com' || user.isAnonymous)) {
        setIsAdmin(true);
        localStorage.setItem('admin_session', 'true');
      } else {
        const session = localStorage.getItem('admin_session');
        if (session !== 'true') {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubAuth();
  }, []);


  useEffect(() => {
    if (!isAdmin) return;

    const qMenu = query(collection(db, 'menu'), orderBy('name', 'asc'));
    const unsubMenu = onSnapshot(qMenu, (snap) => {
      setMenuItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as MenuItem)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'menu'));

    const qReviews = query(collection(db, 'reviews'), orderBy('date', 'desc'));
    const unsubReviews = onSnapshot(qReviews, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'reviews'));

    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'orders'));

    return () => {
      unsubMenu();
      unsubReviews();
      unsubOrders();
    };
  }, [isAdmin]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loginId === 'sampurnbenne.1' && loginPassword === 'garlicroastmasaladosa') {
      setIsAdmin(true);
      localStorage.setItem('admin_session', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid ID or Password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_session');
    signOut(auth);
  };

  const handleAddMenuItem = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateDoc(doc(db, 'menu', editingItem.id), {
          ...newMenuItem
        });
      } else {
        await addDoc(collection(db, 'menu'), {
          ...newMenuItem,
          createdAt: Timestamp.now()
        });
      }
      setIsAddMenuOpen(false);
      setEditingItem(null);
      setNewMenuItem({
        name: '',
        description: '',
        price: 0,
        category: 'Dosas',
        imageUrl: '',
        isPopular: false
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'menu');
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status === 'completed' ? o.total : 0), 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : '5.0';
    return {
      revenue: `₹${totalRevenue.toLocaleString()}`,
      orders: orders.length,
      pending: pendingOrders,
      rating: avgRating,
      customers: new Set(orders.map(o => o.customerPhone)).size
    };
  }, [orders, reviews]);

  if (loading) return (
    <div className="min-h-screen bg-[#060606] flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 border-4 border-[#CC5500] border-t-transparent rounded-full"
      />
    </div>
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060606] p-6 relative overflow-hidden">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#CC5500]/5 backdrop-blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-[#CC5500]/10 rounded-full blur-[200px] opacity-20 animate-pulse" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="max-w-md w-full bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 lg:p-12 rounded-[50px] relative z-10 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="flex justify-center mb-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
            >
              <BrandLogo className="w-20 h-20" color="#CC5500" />
            </motion.div>
          </div>
          
          <h1 className="text-4xl font-black mb-2 text-center tracking-tighter text-white">Sampurn Portal</h1>
          <p className="text-white/30 mb-10 text-center text-sm font-medium">Access Restricted System</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#CC5500] ml-2">Vector ID</label>
              <input 
                type="text" 
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#CC5500] transition-all font-medium placeholder:text-white/10 outline-none hover:bg-white/[0.05]"
                placeholder="ID TOKEN"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-[#CC5500] ml-2">Access Key</label>
              <input 
                type="password" 
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#CC5500] transition-all font-medium placeholder:text-white/10 outline-none hover:bg-white/[0.05]"
                placeholder="••••••••"
                required
              />
            </div>
            
            {loginError && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest"
              >
                {loginError}
              </motion.p>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-[#CC5500] text-white rounded-2xl font-black uppercase tracking-[0.4em] text-xs shadow-2xl hover:bg-[#D4AF37] active:scale-95 transition-all mt-4 border border-white/5"
            >
              Initialize Node
            </button>

            <Link 
              to="/"
              className="w-full py-5 bg-white/5 text-white/50 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg hover:bg-white/10 hover:text-white transition-all border border-white/5 flex items-center justify-center gap-3 mt-4"
            >
              <HomeIcon size={14} /> Back to Public Site
            </Link>
          </form>
          
          <p className="mt-12 text-center text-[10px] text-white/10 font-bold uppercase tracking-widest">Shield Core 8.4.1</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#060606] text-[#FFFFF0] flex overflow-hidden font-sans pt-20 lg:pt-0 selection:bg-[#CC5500] selection:text-white">
      {/* Sidebar - Drawer on Mobile, Fixed/Toggle on Desktop */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth > 1024) && (
          <>
            {/* Backdrop for mobile */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-[55]"
            />
            <motion.aside 
              initial={{ x: window.innerWidth < 1024 ? -320 : 0 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className={`${isSidebarOpen ? 'w-80' : 'w-24'} fixed lg:relative h-full bg-[#0a0a0a] border-r border-white/5 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[60]`}
            >
              <div className="p-8 pb-12 flex items-center justify-between">
                <AnimatePresence mode="wait">
                  {isSidebarOpen && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center gap-4"
                    >
                      <div className="relative">
                        <BrandLogo className="w-10 h-10" color="#CC5500" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a0a]" />
                      </div>
                      <div>
                        <h2 className="text-lg font-black tracking-tighter leading-tight text-white">SAMPURN</h2>
                        <p className="text-[10px] text-[#CC5500] font-black uppercase tracking-widest">Neural Admin</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button 
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 bg-white/5 rounded-xl hover:bg-[#CC5500]/20 hover:text-[#CC5500] transition-all hidden lg:block"
                >
                  <MenuIcon size={20} />
                </button>
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all lg:hidden"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar pb-10">
                {[
                  { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
                  { id: 'orders', icon: ShoppingBag, label: 'Live Orders' },
                  { id: 'menu', icon: Utensils, label: 'Menu Assets' },
                  { id: 'customers', icon: Users, label: 'Patron Index' },
                  { id: 'reviews', icon: MessageSquare, label: 'Sentiment' },
                  { id: 'gallery', icon: Image, label: 'Media Lab' },
                  { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
                  { id: 'offers', icon: Gift, label: 'Campaigns' },
                  { id: 'settings', icon: Settings, label: 'Core Config' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as AdminTab);
                      if (window.innerWidth < 1024) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative overflow-hidden ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-[#CC5500] to-[#E65C00] text-white shadow-[0_15px_40px_rgba(204,85,0,0.4)]' 
                        : 'text-white/30 hover:bg-white/[0.03] hover:text-white'
                    }`}
                  >
                    {activeTab === item.id && (
                      <motion.div 
                        layoutId="active-glow"
                        className="absolute inset-0 bg-white/10 blur-xl rounded-full"
                      />
                    )}
                    <item.icon size={22} className={`relative z-10 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                    {isSidebarOpen && (
                      <span className="text-sm font-black tracking-tight relative z-10">{item.label}</span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="p-6 border-t border-white/5 bg-[#080808] space-y-2">
                <Link 
                  to="/"
                  className="w-full flex items-center gap-4 p-4 text-white/30 hover:text-white hover:bg-white/5 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
                >
                  <HomeIcon size={22} />
                  {isSidebarOpen && <span>Home Engine</span>}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-4 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-xs uppercase tracking-widest"
                >
                  <LogOut size={22} />
                  {isSidebarOpen && <span>Terminate</span>}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Experience Layer */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Background Visual Artifacts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#CC5500]/5 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#D4AF37]/5 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        {/* Neural Toolbar */}
        <header className="h-20 lg:h-24 px-6 lg:px-12 border-b border-white/5 flex items-center justify-between bg-[#060606]/40 backdrop-blur-3xl sticky top-0 z-40">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-white/50 hover:text-white"
            >
              <MenuIcon size={24} />
            </button>
            <div className="hidden sm:block">
              <h1 className="text-sm lg:text-xl font-black tracking-[0.2em] uppercase text-white/20">Sampurn_Benne v4.0</h1>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden lg:block" />
            <div className="flex items-center gap-4 bg-white/[0.03] px-4 lg:px-6 py-2.5 lg:py-3 rounded-full border border-white/5 focus-within:border-[#CC5500]/50 transition-all group">
              <Search size={14} className="text-white/20 group-focus-within:text-[#CC5500]" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none outline-none text-[10px] lg:text-xs text-white placeholder:text-white/10 w-24 md:w-64 font-bold tracking-tight"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-8">
            <div className="hidden xl:flex items-center gap-4 bg-white/5 px-6 py-2.5 rounded-2xl border border-white/5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">Synapse Active</p>
            </div>
            <button className="relative p-2.5 lg:p-3.5 bg-white/5 rounded-xl lg:rounded-2xl hover:bg-[#CC5500]/10 hover:text-[#CC5500] transition-all border border-white/5">
              <Bell size={18} />
              <span className="absolute top-2 right-2 lg:top-3 lg:right-3 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-[#CC5500] rounded-full ring-2 lg:ring-4 ring-[#060606]" />
            </button>
            <motion.div 
               whileHover={{ scale: 1.05 }}
               className="flex items-center gap-2 lg:gap-4 bg-white/5 pl-2 pr-2 lg:pr-5 py-2 rounded-xl lg:rounded-2xl border border-white/5 cursor-pointer"
            >
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gradient-to-br from-[#CC5500] to-[#E65C00] flex items-center justify-center font-black text-xs text-white shadow-lg shadow-[#CC5500]/20">SB</div>
              <div className="hidden sm:block">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#CC5500]">SuperAdmin</p>
                <p className="text-[10px] font-bold text-white/50">L. Kothari</p>
              </div>
            </motion.div>
          </div>
        </header>

        {/* Scrollable Content Core */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-12 no-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-12">
                  {/* Stats Engine */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
                    {[
                      { icon: DollarSign, label: 'Capital Yield', value: stats.revenue, trend: '+18.4%', info: 'vs Last Window', color: '#CC5500' },
                      { icon: ShoppingBag, label: 'Orders Processed', value: stats.orders, trend: '+43', info: 'Live Volume', color: '#D4AF37' },
                      { icon: Users, label: 'User Retention', value: stats.customers, trend: '+8.1%', info: 'Loyalty Metric', color: '#6366f1' },
                      { icon: Star, label: 'Quality Index', value: stats.rating, trend: '98%', info: 'Sentiment Score', color: '#10b981' },
                    ].map((s, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-10 rounded-[40px] flex flex-col gap-6 relative group overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#CC5500]/5 -mr-16 -mt-16 rounded-full blur-[50px] group-hover:bg-[#CC5500]/10 transition-all duration-700" />
                        <div className="flex justify-between items-start">
                          <div className="w-16 h-16 bg-white/[0.03] rounded-2xl border border-white/5 flex items-center justify-center text-white/40 group-hover:bg-[#CC5500]/20 group-hover:text-[#CC5500] transition-all duration-500">
                            <s.icon size={28} />
                          </div>
                          <div className="text-right">
                            <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">{s.trend}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 mb-2">{s.label}</p>
                          <h3 className="text-4xl font-black tracking-tighter text-white">{s.value}</h3>
                          <p className="text-[10px] text-white/10 font-bold uppercase mt-2">{s.info}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Analytical Arrays */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[50px] relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#CC5500]/50 to-transparent" />
                      <div className="flex items-center justify-between mb-12">
                        <div>
                          <h4 className="text-2xl font-black tracking-tighter text-white">Market Dynamics</h4>
                          <p className="text-xs text-white/20 font-bold uppercase tracking-widest mt-1">Institutional Yield Analytics</p>
                        </div>
                        <div className="flex bg-white/5 p-2 rounded-2xl border border-white/5 backdrop-blur-xl">
                          <button className="px-6 py-2.5 bg-[#CC5500] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_10px_20px_rgba(204,85,0,0.3)]">Real-Time</button>
                          <button className="px-6 py-2.5 text-white/20 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-all">Historical</button>
                        </div>
                      </div>
                      <div className="h-[400px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={REVENUE_DATA}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#CC5500" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#CC5500" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis 
                              dataKey="name" 
                              stroke="rgba(255,255,255,0.1)" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                              dy={20}
                              tick={{ fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }}
                            />
                            <YAxis 
                              stroke="rgba(255,255,255,0.1)" 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                              tickFormatter={(val) => `₹${val/1000}k`}
                              tick={{ fontWeight: 900, fill: 'rgba(255,255,255,0.2)' }}
                            />
                            <Tooltip 
                              cursor={{ stroke: 'rgba(204,85,0,0.5)', strokeWidth: 2 }}
                              contentStyle={{ backgroundColor: 'rgba(10,10,10,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', backdropFilter: 'blur(20px)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
                              itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="#CC5500" 
                              strokeWidth={4}
                              fillOpacity={1} 
                              fill="url(#colorRev)" 
                              animationDuration={2000}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[50px] flex flex-col items-center">
                      <div className="w-full text-left mb-12">
                        <h4 className="text-2xl font-black tracking-tighter text-white">Menu Density</h4>
                        <p className="text-xs text-white/20 font-bold uppercase tracking-widest mt-1">Composition Spectrum</p>
                      </div>
                      <div className="h-[300px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <RePieChart>
                            <Pie
                              data={POPULAR_DISHES}
                              innerRadius={80}
                              outerRadius={120}
                              paddingAngle={10}
                              dataKey="value"
                              stroke="none"
                            >
                              {POPULAR_DISHES.map((entry, i) => (
                                <Cell 
                                   key={`cell-${i}`} 
                                   fill={COLORS_CHART[i % COLORS_CHART.length]} 
                                   className="outline-none hover:opacity-80 transition-opacity cursor-pointer" 
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RePieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                           <span className="text-4xl font-black tracking-tighter">842</span>
                           <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Total Sales</span>
                        </div>
                      </div>
                      <div className="w-full space-y-6 mt-12">
                        {POPULAR_DISHES.map((item, i) => (
                          <div key={i} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                              <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(204,85,0,0.5)]" style={{ backgroundColor: COLORS_CHART[i] }} />
                              <span className="text-sm font-bold text-white/40 group-hover:text-white transition-colors">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                               <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#CC5500]/50" style={{ width: `${(item.value/400)*100}%` }} />
                               </div>
                               <span className="text-xs font-black text-[#D4AF37]">{Math.round((item.value/1200)*100)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Secondary Monitoring Nodes */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[50px]">
                      <div className="flex items-center justify-between mb-10">
                        <div>
                          <h4 className="text-2xl font-black tracking-tighter">Live Order Stream</h4>
                          <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-1">Real-time Fulfillment Feed</p>
                        </div>
                        <button className="p-4 bg-white/5 rounded-2xl text-[#CC5500] hover:bg-[#CC5500] hover:text-white transition-all shadow-xl">
                           <Zap size={20} />
                        </button>
                      </div>
                      <div className="space-y-6">
                        {orders.slice(0, 4).map((order) => (
                          <motion.div 
                            key={order.id} 
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            className="flex items-center gap-6 p-6 bg-white/[0.01] rounded-3xl border border-white/[0.02] hover:border-[#CC5500]/30 transition-all group cursor-pointer"
                          >
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#CC5500] shrink-0 group-hover:scale-110 transition-all shadow-inner border border-white/5 relative overflow-hidden">
                               <div className="absolute inset-0 bg-[#CC5500]/10 animate-pulse" />
                               <ShoppingBag size={24} className="relative z-10" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-black truncate">{order.customerName}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">#{order.id.slice(0, 8)}</p>
                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                <p className="text-[10px] text-[#CC5500] font-black uppercase tracking-widest">{order.items.length} Items</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-black text-white leading-none tracking-tighter">₹{order.total}</p>
                              <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mt-1.5">{order.status}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[50px] relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC5500]/5 -mr-32 -mt-32 rounded-full blur-[60px]" />
                        <h4 className="text-2xl font-black tracking-tighter mb-10 capitalize">Subsystem Health</h4>
                        <div className="grid grid-cols-2 gap-6 relative z-10">
                           {[
                             { label: 'Kitchen Load', val: 'Overloaded', icon: Utensils, perc: '84%', color: '#CC5500' },
                             { label: 'Delivery Latency', val: 'Minimal', icon: Truck, perc: '24m', color: '#10b981' },
                             { label: 'Network Integrity', val: 'Healthy', icon: Globe, perc: '45ms', color: '#3b82f6' },
                             { label: 'Payment Gateway', val: 'Active', icon: CreditCard, perc: '100%', color: '#8b5cf6' },
                           ].map((item, i) => (
                             <div key={i} className="bg-white/[0.03] p-8 rounded-[40px] border border-white/5 hover:border-white/10 transition-all flex flex-col gap-6">
                                <div className="flex justify-between items-center text-white/20">
                                   <item.icon size={22} />
                                   <span className="text-[10px] font-black uppercase tracking-widest">{item.perc}</span>
                                </div>
                                <div>
                                   <p className="text-[10px] font-black uppercase text-white/20 tracking-[0.2em] mb-1">{item.label}</p>
                                   <p className="text-xl font-black tracking-tighter" style={{ color: item.color }}>{item.val}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-12">
                  <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                    <div>
                      <h2 className="text-5xl font-black tracking-tighter text-white">Fulfillment Hub</h2>
                      <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Live Logistics Orchestration</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex bg-white/5 p-1.5 rounded-3xl border border-white/5">
                        {['All', 'Pending', 'Preparing', 'Delivering'].map(f => (
                          <button key={f} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${f === 'All' ? 'bg-[#CC5500] text-white shadow-lg' : 'text-white/20 hover:text-white'}`}>
                            {f}
                          </button>
                        ))}
                      </div>
                      <button className="flex items-center gap-3 px-8 py-3 bg-white/5 text-white border border-white/10 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                        <BarChart3 size={16} /> Export Intel
                      </button>
                    </div>
                  </header>

                  <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[60px] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left min-w-[1200px]">
                         <thead>
                           <tr className="border-b border-white/5 bg-white/[0.02]">
                             <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Vector ID</th>
                             <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Patron Info</th>
                             <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Financials</th>
                             <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Hub Status</th>
                             <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Operational Flow</th>
                             <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.4em] text-white/20">Tactical Control</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-white/5">
                            {orders.map((order) => (
                              <tr key={order.id} className="hover:bg-white/[0.04] transition-all group">
                                <td className="px-12 py-10 font-mono text-xs text-white/30 tracking-tight">#{order.id.slice(0, 12)}</td>
                                <td className="px-12 py-10">
                                  <p className="text-base font-black text-white">{order.customerName}</p>
                                  <p className="text-[11px] text-white/20 font-bold uppercase mt-1">MOBILE_{order.customerPhone.split('').map((c, i) => i > 4 ? '*' : c).join('')}</p>
                                </td>
                                <td className="px-12 py-10">
                                  <p className="text-lg font-black text-[#D4AF37] tracking-tighter">₹{order.total}</p>
                                  <p className="text-[10px] text-white/20 font-black uppercase mt-1">{order.items.length} Discrete Units</p>
                                </td>
                                <td className="px-12 py-10">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full border-4 border-black ring-2 ${
                                      order.status === 'completed' ? 'bg-green-500 ring-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 
                                      order.status === 'pending' ? 'bg-yellow-500 ring-yellow-500/20 animate-pulse' : 
                                      order.status === 'confirmed' ? 'bg-[#CC5500] ring-[#CC5500]/20' : 'bg-red-500 ring-red-500/20'
                                    }`} />
                                    <span className="text-xs font-black uppercase tracking-widest text-white/60">{order.status}</span>
                                  </div>
                                </td>
                                <td className="px-12 py-10">
                                  <div className="flex flex-col gap-3 w-40">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-white/10">
                                       <span>Process Log</span>
                                       <span>{order.status === 'completed' ? '100%' : '35%'}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                                       <motion.div 
                                         initial={{ width: 0 }}
                                         whileInView={{ width: order.status === 'completed' ? '100%' : '35%' }}
                                         className={`h-full rounded-full transition-all duration-1000 ${
                                           order.status === 'completed' ? 'bg-green-500' : 
                                           order.status === 'confirmed' ? 'bg-[#CC5500]' : 'bg-yellow-500'
                                         }`} 
                                       />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-12 py-10">
                                   <div className="flex items-center gap-3 opacity-30 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 origin-right">
                                      <button className="p-4 bg-white/5 hover:bg-[#CC5500]/20 hover:text-[#CC5500] rounded-2xl transition-all border border-white/5 shadow-xl">
                                        <Layers size={18} />
                                      </button>
                                      <button className="p-4 bg-white/5 hover:bg-green-500/20 hover:text-green-500 rounded-2xl transition-all border border-white/5 shadow-xl">
                                        <CheckCircle2 size={18} />
                                      </button>
                                      <button className="p-4 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-2xl transition-all border border-white/5 shadow-xl">
                                        <Trash2 size={18} />
                                      </button>
                                   </div>
                                </td>
                              </tr>
                            ))}
                         </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'menu' && (
                <div className="space-y-12">
                  <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
                    <div>
                      <h2 className="text-5xl font-black tracking-tighter text-white">Menu Factory</h2>
                      <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Architecting Taste Vectors</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex bg-white/5 p-1.5 rounded-full border border-white/5">
                           {['All', 'Dosas', 'Vada', 'Coffee'].map(cat => (
                             <button key={cat} className="px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all">
                                {cat}
                             </button>
                           ))}
                        </div>
                        <button 
                          onClick={() => { setEditingItem(null); setIsAddMenuOpen(true); }}
                          className="flex items-center gap-4 px-10 py-5 bg-gradient-to-r from-[#CC5500] to-[#E65C00] text-white rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(204,85,0,0.4)] hover:scale-105 active:scale-95 transition-all outline-none"
                        >
                          <Plus size={20} /> Deploy New Asset
                        </button>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-10">
                    {menuItems.map((item) => (
                      <motion.div 
                        key={item.id} 
                        layout
                        whileHover={{ y: -15 }}
                        className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-10 rounded-[60px] flex flex-col gap-8 group relative overflow-hidden transition-shadow hover:shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
                      >
                        {/* Interactive UI Layers */}
                        <div className="absolute top-8 left-8 z-10 flex flex-wrap gap-2">
                           {item.isPopular && (
                             <span className="bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full flex items-center gap-2 shadow-2xl ring-4 ring-black/20">
                               <Zap size={12} fill="black" /> Bestseller
                             </span>
                           )}
                           <span className="bg-white/5 backdrop-blur-xl text-white/60 text-[10px] font-black uppercase tracking-widest px-5 py-2 rounded-full border border-white/10">
                             {item.category}
                           </span>
                        </div>

                        <div className="aspect-[4/3] bg-[#0c0c0c] rounded-[45px] overflow-hidden relative border border-white/10 shadow-inner group">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent opacity-80" />
                          
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/40 backdrop-blur-sm">
                             <div className="flex gap-4 scale-75 group-hover:scale-100 transition-transform duration-500">
                               <button 
                                 onClick={() => {
                                   setEditingItem(item);
                                   setNewMenuItem(item);
                                   setIsAddMenuOpen(true);
                                 }}
                                 className="p-6 bg-white text-black rounded-3xl hover:bg-[#CC5500] hover:text-white transition-all shadow-2xl"
                                >
                                 <Edit2 size={24} />
                               </button>
                               <button 
                                 onClick={async () => {
                                   if(confirm('Terminate this asset permanentely?')) {
                                     await deleteDoc(doc(db, 'menu', item.id));
                                   }
                                 }}
                                 className="p-6 bg-white/10 backdrop-blur-xl text-white rounded-3xl hover:bg-red-500 transition-all border border-white/10 shadow-2xl"
                                >
                                 <Trash2 size={24} />
                               </button>
                             </div>
                          </div>

                          <div className="absolute bottom-8 left-10">
                             <span className="text-4xl font-black text-white tracking-tighter drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)]">₹{item.price}</span>
                          </div>
                        </div>

                        <div className="flex-1 px-2">
                          <div className="flex items-center justify-between group-hover:translate-x-2 transition-transform duration-500">
                             <h3 className="text-3xl font-black tracking-tight text-white">{item.name}</h3>
                             <ChevronRight size={24} className="text-[#CC5500] opacity-0 group-hover:opacity-100 transition-all" />
                          </div>
                          <p className="text-sm text-white/30 mt-4 leading-relaxed font-medium line-clamp-3 italic tracking-tight">"{item.description}"</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add/Edit Menu Modal Architecture */}
              <AnimatePresence>
                {isAddMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 bg-[#060606]/95 backdrop-blur-[100px]"
                  >
                    <motion.div 
                      key="modal"
                      initial={{ scale: 0.9, y: 100, rotateX: 20 }}
                      animate={{ scale: 1, y: 0, rotateX: 0 }}
                      exit={{ scale: 0.9, y: 100, rotateX: 20 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="bg-[#0c0c0c] border border-white/10 w-full max-w-4xl rounded-[60px] p-12 lg:p-16 shadow-[0_50px_200px_rgba(0,0,0,0.8)] overflow-hidden relative perspective-1000"
                    >
                      {/* Grid Background Artifact */}
                      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
                      
                      <button 
                        onClick={() => setIsAddMenuOpen(false)}
                        className="absolute top-10 right-10 p-5 bg-white/5 rounded-[25px] hover:text-[#CC5500] hover:bg-[#CC5500]/10 transition-all border border-white/10 z-20 group"
                      >
                        <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                      </button>

                      <div className="relative z-10">
                        <header className="mb-16">
                           <div className="flex items-center gap-6 mb-4">
                             <div className="w-12 h-[1px] bg-[#CC5500]" />
                             <span className="text-xs font-black uppercase tracking-[0.6em] text-[#CC5500]">System Interface</span>
                           </div>
                           <h3 className="text-5xl font-black tracking-tighter uppercase text-white">{editingItem ? 'Edit Culinary Hash' : 'Initialize New Asset'}</h3>
                        </header>
                        
                        <form onSubmit={handleAddMenuItem} className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
                          <div className="space-y-10">
                             <div className="space-y-3 group">
                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 group-focus-within:text-[#CC5500] transition-colors">Physical Identifier</label>
                               <input 
                                 type="text" 
                                 value={newMenuItem.name}
                                 onChange={(e) => setNewMenuItem({...newMenuItem, name: e.target.value})}
                                 className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-5 outline-none focus:border-[#CC5500] transition-all text-white font-black lg:text-lg focus:bg-white/[0.05]"
                                 placeholder="MASALA_DOSA_PRO"
                                 required
                               />
                             </div>
                             <div className="space-y-3 group">
                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 group-focus-within:text-[#CC5500] transition-colors">Economic Valuation (INR)</label>
                               <div className="relative">
                                  <span className="absolute left-8 top-1/2 -translate-y-1/2 text-[#CC5500] font-black">₹</span>
                                  <input 
                                    type="number" 
                                    value={newMenuItem.price}
                                    onChange={(e) => setNewMenuItem({...newMenuItem, price: parseInt(e.target.value)})}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl pl-14 pr-8 py-5 outline-none focus:border-[#CC5500] transition-all text-white font-black lg:text-lg focus:bg-white/[0.05]"
                                    placeholder="000"
                                    required
                                  />
                               </div>
                             </div>
                             <div className="space-y-3 group">
                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 group-focus-within:text-[#CC5500] transition-colors">Sector Allocation</label>
                               <select
                                 value={newMenuItem.category}
                                 onChange={(e) => setNewMenuItem({...newMenuItem, category: e.target.value as Category})}
                                 className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-5 outline-none focus:border-[#CC5500] transition-all text-white font-black appearance-none cursor-pointer focus:bg-white/[0.05]"
                               >
                                 <option value="Dosas">Dosas</option>
                                 <option value="Idli">Idli</option>
                                 <option value="Vada">Vada</option>
                                 <option value="Filter Coffee">Filter Coffee</option>
                                 <option value="Desserts">Desserts</option>
                               </select>
                             </div>
                          </div>

                          <div className="space-y-10">
                             <div className="space-y-3 group">
                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 group-focus-within:text-[#CC5500] transition-colors">Neural Image Endpoint</label>
                               <div className="relative">
                                  <Camera size={18} className="absolute left-8 top-1/2 -translate-y-1/2 text-white/10" />
                                  <input 
                                    type="text" 
                                    value={newMenuItem.imageUrl}
                                    onChange={(e) => setNewMenuItem({...newMenuItem, imageUrl: e.target.value})}
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl pl-16 pr-8 py-5 outline-none focus:border-[#CC5500] transition-all font-mono text-[10px] text-white/50 focus:text-white focus:bg-white/[0.05]"
                                    placeholder="HTTPS://SOURCE.UNSPLASH.COM/..."
                                    required
                                  />
                               </div>
                             </div>
                             <div className="space-y-3 group">
                               <label className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 ml-2 group-focus-within:text-[#CC5500] transition-colors">Technical Brief</label>
                               <textarea 
                                 rows={4}
                                 value={newMenuItem.description}
                                 onChange={(e) => setNewMenuItem({...newMenuItem, description: e.target.value})}
                                 className="w-full bg-white/[0.02] border border-white/5 rounded-3xl px-8 py-5 outline-none focus:border-[#CC5500] transition-all resize-none text-white font-medium text-sm focus:bg-white/[0.05]"
                                 placeholder="Define the sensory identity parameters..."
                                 required
                               />
                             </div>
                             <div className="flex items-center gap-6 py-4 bg-white/[0.02] rounded-3xl px-8 border border-white/5">
                                <div className="flex items-center gap-3">
                                   <Zap size={18} className={newMenuItem.isPopular ? 'text-[#CC5500]' : 'text-white/10'} />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Priority Stream</span>
                                </div>
                                <button 
                                  type="button"
                                  onClick={() => setNewMenuItem({...newMenuItem, isPopular: !newMenuItem.isPopular})}
                                  className={`w-14 h-7 rounded-full p-1.5 transition-all ml-auto ${newMenuItem.isPopular ? 'bg-[#CC5500]' : 'bg-white/10'}`}
                                >
                                  <div className={`w-4 h-4 bg-white rounded-full transition-all flex items-center justify-center ${newMenuItem.isPopular ? 'translate-x-7' : 'translate-x-0'}`}>
                                     {newMenuItem.isPopular && <div className="w-1 h-1 bg-[#CC5500] rounded-full" />}
                                  </div>
                                </button>
                             </div>
                          </div>

                          <div className="md:col-span-2 pt-10">
                            <button 
                              type="submit"
                              className="w-full py-6 bg-gradient-to-r from-[#CC5500] to-[#E65C00] text-white rounded-[30px] font-black uppercase tracking-[0.5em] text-sm shadow-[0_30px_70px_rgba(204,85,0,0.4)] hover:scale-[1.02] active:scale-95 transition-all border border-white/10 relative overflow-hidden group/btn"
                            >
                              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12" />
                              <span className="relative z-10 flex items-center justify-center gap-4">
                               <Layers size={18} /> {editingItem ? 'Finalize Hash Update' : 'Synchronize Global Menu'}
                              </span>
                            </button>
                          </div>
                        </form>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Subsystem Redirection UI (Placeholder for items like Gallery, Offers, etc) */}
              {activeTab === 'customers' && (
                <div className="space-y-10">
                  <header>
                    <h2 className="text-4xl font-black tracking-tighter text-white">Patron Index</h2>
                    <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Relational Data Management</p>
                  </header>

                  <div className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 rounded-[50px] overflow-hidden">
                    <div className="overflow-x-auto no-scrollbar">
                      <table className="w-full text-left min-w-[800px]">
                        <thead>
                          <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Patron</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Contact</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Orders</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Lifetime Value</th>
                            <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-white/20">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {Array.from(new Set(orders.map(o => o.customerPhone))).map(phone => {
                            const customerOrders = orders.filter(o => o.customerPhone === phone);
                            const name = customerOrders[0]?.customerName;
                            const ltv = customerOrders.reduce((sum, o) => sum + o.total, 0);
                            return (
                              <tr key={phone} className="hover:bg-white/[0.03] transition-all">
                                <td className="px-10 py-8 flex items-center gap-4">
                                  <div className="w-10 h-10 bg-[#CC5500]/20 rounded-xl flex items-center justify-center text-[#CC5500] font-black text-xs">
                                    {name?.charAt(0)}
                                  </div>
                                  <span className="font-black text-white">{name}</span>
                                </td>
                                <td className="px-10 py-8 text-white/30 font-medium">{phone}</td>
                                <td className="px-10 py-8 font-black text-white">{customerOrders.length}</td>
                                <td className="px-10 py-8 text-green-500 font-black">₹{ltv}</td>
                                <td className="px-10 py-8">
                                  {ltv > 5000 && (
                                    <span className="bg-[#D4AF37]/10 text-[#D4AF37] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-[#D4AF37]/20">VIP Patron</span>
                                  )}
                                  {ltv <= 5000 && (
                                    <span className="bg-white/5 text-white/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Standard</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-10">
                  <header className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter text-white">Sentiment Analysis</h2>
                      <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Public Reputation Feed</p>
                    </div>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                      <motion.div 
                        key={review.id}
                        layout
                        className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-8 rounded-[40px] flex flex-col h-full relative group"
                      >
                        <div className="flex gap-1 text-[#CC5500] mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? '#CC5500' : 'none'} className={i >= review.rating ? 'opacity-20' : ''} />
                          ))}
                        </div>
                        <p className="text-white/60 italic text-sm leading-relaxed mb-8 flex-1">"{review.comment}"</p>
                        <div className="flex justify-between items-center border-t border-white/5 pt-8">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-[#CC5500] truncate">{review.customerName}</p>
                            <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">{new Date(review.date).toLocaleDateString()}</p>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={async () => {
                                await updateDoc(doc(db, 'reviews', review.id), { isApproved: !review.isApproved });
                              }}
                              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                                review.isApproved ? 'bg-green-500/10 text-green-500 shadow-lg' : 'bg-blue-500/10 text-blue-500'
                              }`}
                            >
                              {review.isApproved ? 'Approved' : 'Approve'}
                            </button>
                            <button 
                              onClick={async () => {
                                if(confirm('Delete sentiment record?')) await deleteDoc(doc(db, 'reviews', review.id));
                              }}
                              className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="space-y-12">
                   <header>
                    <h2 className="text-4xl font-black tracking-tighter text-white">Neural Intelligence</h2>
                    <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Deep Learning Data Visualization</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[50px]">
                      <h4 className="text-xl font-black tracking-tighter mb-10 uppercase text-white">Sales Velocity</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Bar dataKey="active" fill="#CC5500" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="bg-white/[0.02] backdrop-blur-2xl border border-white/5 p-12 rounded-[50px]">
                      <h4 className="text-xl font-black tracking-tighter mb-10 uppercase text-white">Order Distribution</h4>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                            <XAxis dataKey="name" stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.1)" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                            <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={4} dot={{ r: 4, fill: '#D4AF37' }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { icon: Smartphone, label: 'Mobile Traffic', value: '84%', color: '#CC5500' },
                      { icon: Globe, label: 'Direct Entry', value: '12%', color: '#10b981' },
                      { icon: Zap, label: 'Conversion', value: '4.2%', color: '#D4AF37' },
                    ].map((m, i) => (
                      <div key={i} className="bg-white/5 p-10 rounded-[40px] border border-white/5 flex flex-col items-center text-center">
                        <div className="p-4 bg-white/5 rounded-2xl mb-6" style={{ color: m.color }}>
                          <m.icon size={30} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-2">{m.label}</p>
                        <h4 className="text-4xl font-black text-white">{m.value}</h4>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'gallery' && (
                <div className="space-y-10">
                  <header className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter text-white">Media Lab</h2>
                      <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Visual Asset Engine</p>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 bg-[#CC5500] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">
                      <Camera size={18} /> Upload Visual
                    </button>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {menuItems.map(item => (
                      <div key={item.id} className="group relative aspect-square rounded-[40px] overflow-hidden border border-white/5">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-8">
                           <p className="text-xs font-black uppercase tracking-widest text-[#CC5500]">{item.category}</p>
                           <h4 className="text-lg font-black text-white mt-1">{item.name}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'offers' && (
                <div className="space-y-10">
                  <header className="flex justify-between items-end">
                    <div>
                      <h2 className="text-4xl font-black tracking-tighter text-white">Campaign Engine</h2>
                      <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Promotional Vector Control</p>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-4 bg-[#CC5500] text-white rounded-full font-black text-xs uppercase tracking-widest shadow-2xl">
                      <Plus size={18} /> New Campaign
                    </button>
                  </header>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { title: 'SAMPURN25', desc: 'Flat 25% off for first-time patrons', state: 'Active', color: '#CC5500' },
                      { title: 'BENNEFEST', desc: 'Festival special: Buy 2 Get 1 Vada', state: 'Scheduled', color: '#D4AF37' },
                    ].map((off, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-3xl border border-white/5 p-10 rounded-[50px] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full blur-[40px]" />
                        <div className="flex justify-between items-start mb-10">
                          <div className="p-4 bg-white/5 rounded-2xl text-[#CC5500]">
                            <Tag size={24} />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border border-white/10 ${off.state === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {off.state}
                          </span>
                        </div>
                        <h4 className="text-2xl font-black tracking-widest mb-2" style={{ color: off.color }}>{off.title}</h4>
                        <p className="text-sm text-white/30 font-medium mb-10">{off.desc}</p>
                        <div className="flex gap-4">
                           <button className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">Modify</button>
                           <button className="flex-1 py-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">Deactivate</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-10">
                  <header>
                    <h2 className="text-4xl font-black tracking-tighter text-white">System Configuration</h2>
                    <p className="text-[#CC5500] text-sm uppercase tracking-[0.4em] font-black mt-2">Core Logical Parameters</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="bg-white/5 border border-white/5 p-10 rounded-[50px] space-y-8">
                       <h4 className="text-xl font-black tracking-tighter uppercase mb-2 text-white">Business Profile</h4>
                       <div className="space-y-6">
                         {[
                           { label: 'Brand Name', val: 'Sampurn Benne' },
                           { label: 'Operational Zone', val: 'Vesu, Surat' },
                           { label: 'Contact Relay', val: '+91 98765 43210' },
                           { label: 'Global Address', val: 'GF-33, Rajmahal Complex, Vesu' },
                         ].map((f, i) => (
                           <div key={i} className="flex justify-between items-center p-6 bg-black/20 rounded-3xl border border-white/5">
                             <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">{f.label}</span>
                             <span className="text-sm font-black text-white/80">{f.val}</span>
                           </div>
                         ))}
                       </div>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-10 rounded-[50px] space-y-8">
                       <h4 className="text-xl font-black tracking-tighter uppercase mb-2 text-white">Technical Interface</h4>
                       <div className="space-y-6">
                         {[
                           { label: 'Neural Theme', val: 'Obsidian Night (Active)' },
                           { label: 'Auth Protocol', val: 'L2 Hash Verification' },
                           { label: 'Storage Sync', val: 'Firebase Cloud Real-Time' },
                           { label: 'Language Core', val: 'English - V4.2' },
                         ].map((f, i) => (
                           <div key={i} className="flex justify-between items-center p-6 bg-black/20 rounded-3xl border border-white/5">
                             <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">{f.label}</span>
                             <span className="text-sm font-black text-[#CC5500]">{f.val}</span>
                           </div>
                         ))}
                       </div>
                       <button className="w-full py-5 border border-white/10 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:border-[#CC5500] hover:text-[#CC5500] transition-all mt-6">
                          Sync Global Settings
                       </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Catch-all for truly unimplemented or missing keys */}
              {!['dashboard', 'orders', 'menu', 'customers', 'reviews', 'gallery', 'analytics', 'offers', 'settings'].includes(activeTab) && (
                <div className="h-[75vh] flex flex-col items-center justify-center text-center px-6">
                   <motion.div 
                     initial={{ rotate: 0 }}
                     animate={{ rotate: 360 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className="w-64 h-64 bg-white/[0.02] rounded-full border border-dashed border-white/10 flex items-center justify-center mb-16 relative"
                   >
                      <div className="absolute inset-0 bg-[#CC5500]/5 rounded-full blur-[40px] animate-pulse" />
                      <div className="w-40 h-40 bg-gradient-to-br from-[#CC5500]/20 to-transparent rounded-full flex items-center justify-center border border-white/5 backdrop-blur-3xl">
                         <Zap size={80} className="text-[#CC5500] drop-shadow-[0_0_20px_rgba(204,85,0,0.8)]" />
                      </div>
                   </motion.div>
                   <h2 className="text-6xl font-black tracking-tighter mb-6 uppercase text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10">Neural Subsystem Offline</h2>
                   <p className="text-white/20 max-w-xl font-bold uppercase tracking-[0.4em] text-xs leading-loose">
                      The <span className="text-[#CC5500]">{activeTab}</span> core module is migrating to futuristic architecture. Expect global deployment in next cycle.
                   </p>
                   <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('dashboard')}
                    className="mt-16 px-12 py-5 bg-white text-black rounded-full text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#CC5500] hover:text-white transition-all shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                   >
                     Return to Command Hub
                   </motion.button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      
      {/* Cinematic Sidebar Glow */}
      <div className="fixed top-0 left-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#CC5500]/50 to-transparent z-[60]" />
    </div>
  );
};

// Tactical UI Sub-Icons
const Eye = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);

export default Admin;
