import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, Timestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { LayoutDashboard, Utensils, Star, Image, MessageSquare, LogOut, Plus, Trash2, Edit2, ShieldAlert } from 'lucide-react';
import { MenuItem, Review, Order } from '../types';

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'menu' | 'reviews' | 'orders'>('menu');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;

    // Real-time fetching
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
  }, [user]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C] p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#1a1a1a] border border-[#FFFFF0]/10 p-12 rounded-[40px] text-center"
        >
          <div className="w-20 h-20 bg-[#CC5500]/10 rounded-3xl flex items-center justify-center text-[#CC5500] mx-auto mb-8">
            <ShieldAlert size={40} />
          </div>
          <h1 className="text-3xl font-black mb-4">Admin Portal</h1>
          <p className="text-[#FFFFF0]/40 mb-10">Access restricted to authorized personnel. Please sign in with your Google account.</p>
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-[#CC5500] text-white rounded-2xl font-bold uppercase tracking-widest hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            Sign in with Google
          </button>
        </motion.div>
      </div>
    );
  }

  // Simple check for admin email (ideally this is server-side or in rules)
  const isAdmin = user.email === 'lakshkothari35@gmail.com';

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0C0C0C] p-6">
        <div className="text-center">
          <h1 className="text-4xl font-black mb-4">Access Denied</h1>
          <p className="text-[#FFFFF0]/40 mb-8 font-medium">Your account ({user.email}) is not registered as an administrator.</p>
          <button onClick={() => signOut(auth)} className="text-[#CC5500] font-bold uppercase tracking-widest text-xs flex items-center gap-2 mx-auto">
            <LogOut size={16} /> Logout and try another account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] flex flex-col pt-20">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden px-6 py-4 border-b border-[#FFFFF0]/5 flex justify-between items-center bg-[#0C0C0C]/80 backdrop-blur-md sticky top-20 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#CC5500] rounded-lg flex items-center justify-center text-white font-black text-xs">SB</div>
          <span className="text-sm font-black uppercase tracking-tighter">Admin Panel</span>
        </div>
        <select 
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value as any)}
          className="bg-[#FFFFF0]/5 border border-[#FFFFF0]/10 rounded-lg px-4 py-2 text-xs font-bold focus:outline-none"
        >
          <option value="menu">Menu Items</option>
          <option value="orders">Recent Orders</option>
          <option value="reviews">Reviews</option>
        </select>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Hidden on mobile) */}
        <aside className="hidden lg:flex w-64 border-r border-[#FFFFF0]/5 p-8 flex-col gap-10">
          <div className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 bg-[#CC5500] rounded-xl flex items-center justify-center text-white font-black">SB</div>
            <div>
              <p className="text-sm font-black">Sampurn Admin</p>
              <p className="text-[10px] text-[#FFFFF0]/40 font-bold uppercase">Surat, Gujarat</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: 'menu', icon: Utensils, label: 'Menu Items' },
              { id: 'orders', icon: LayoutDashboard, label: 'Recent Orders' },
              { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === item.id 
                    ? 'bg-[#CC5500] text-white shadow-lg' 
                    : 'text-[#FFFFF0]/40 hover:bg-[#FFFFF0]/5 hover:text-[#FFFFF0]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <button 
              onClick={() => signOut(auth)}
              className="flex items-center gap-4 px-6 py-4 text-[#FFFFF0]/30 hover:text-red-400 text-sm font-bold transition-colors w-full"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 p-6 lg:p-12 overflow-y-auto">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tighter capitalize">{activeTab} Management</h1>
              <p className="text-[#FFFFF0]/40 text-sm mt-1">Real-time control over your brand identity.</p>
            </div>
            {activeTab === 'menu' && (
              <button className="flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 bg-[#CC5500] text-white rounded-full font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl">
                <Plus size={16} /> Add New Dish
              </button>
            )}
          </header>

          {activeTab === 'menu' && (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-[#1a1a1a] border border-[#FFFFF0]/5 p-5 lg:p-6 rounded-3xl flex gap-4 lg:gap-6 items-center group">
                  <div className="w-16 h-16 lg:w-24 lg:h-24 bg-[#0f0f0f] rounded-2xl overflow-hidden shrink-0">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg lg:text-xl font-bold truncate">{item.name}</h3>
                    <p className="text-[10px] lg:text-xs text-[#FFFFF0]/40 mt-1 line-clamp-1">{item.description}</p>
                    <div className="flex flex-wrap gap-2 lg:gap-4 mt-3 lg:mt-4">
                      <span className="text-[10px] lg:text-xs font-black text-[#CC5500] bg-[#CC5500]/10 px-2 lg:px-3 py-1 rounded-lg">₹{item.price}</span>
                      <span className="text-[10px] lg:text-xs font-bold text-[#D4AF37] opacity-60 uppercase tracking-widest">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                    <button className="p-2 lg:p-3 bg-[#FFFFF0]/5 hover:bg-[#CC5500]/20 rounded-xl transition-colors"><Edit2 size={14} /></button>
                    <button className="p-2 lg:p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-[#1a1a1a] border border-[#FFFFF0]/5 rounded-[30px] lg:rounded-[40px] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#FFFFF0]/5 bg-[#0f0f0f]/50">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#FFFFF0]/40">Order ID</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#FFFFF0]/40">Customer</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#FFFFF0]/40">Total</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#FFFFF0]/40">Status</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[#FFFFF0]/40">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-[#FFFFF0]/20 font-bold italic">No active orders found</td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="border-b border-[#FFFFF0]/5 hover:bg-[#FFFFF0]/5 transition-colors">
                          <td className="px-8 py-6 text-sm font-mono opacity-40">#{order.id.slice(0, 8)}</td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-bold">{order.customerName}</p>
                            <p className="text-[10px] text-[#FFFFF0]/30">{order.customerPhone}</p>
                          </td>
                          <td className="px-8 py-6 font-black text-[#D4AF37]">₹{order.total}</td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              order.status === 'completed' ? 'bg-green-500/10 text-green-500' : 
                              order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-500'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 flex gap-2">
                            <button className="px-4 py-2 bg-[#FFFFF0]/5 rounded-xl text-[10px] font-black uppercase">Detail</button>
                            <button className="px-4 py-2 bg-[#CC5500]/10 text-[#CC5500] rounded-xl text-[10px] font-black uppercase">Confirm</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#1a1a1a] border border-[#FFFFF0]/5 p-6 lg:p-8 rounded-[30px] lg:rounded-[40px] flex flex-col h-full relative group">
                  <div className="flex gap-1 text-[#CC5500] mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < review.rating ? '#CC5500' : 'none'} className={i >= review.rating ? 'opacity-20' : ''} />
                    ))}
                  </div>
                  <p className="text-[#FFFFF0]/60 italic text-sm leading-relaxed mb-6 flex-1">"{review.comment}"</p>
                  <div className="flex justify-between items-center border-t border-[#FFFFF0]/5 pt-6">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-[#CC5500] truncate">{review.customerName}</p>
                      <p className="text-[10px] text-[#FFFFF0]/20 font-bold uppercase">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className={`px-3 lg:px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                        review.isApproved ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {review.isApproved ? 'Approved' : 'Approve'}
                      </button>
                      <button className="p-3 bg-red-500/10 text-red-500 rounded-xl"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Admin;
