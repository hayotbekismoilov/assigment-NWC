import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  Image,
  Factory,
  Bike,
  HardHat,
  Warehouse,
  Wallet,
  BarChart3,
  Cog,
  Store,
  ArrowRightLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/panel/dashboard' },
  { icon: Image, label: 'Slayder', path: '/panel/sliders' },
  { icon: Package, label: 'Mahsulotlar', path: '/panel/products' },
  { icon: Layers, label: 'Kategoriyalar', path: '/panel/categories' },
  { icon: ShoppingCart, label: 'Buyurtmalar', path: '/panel/orders' },
  { icon: Users, label: 'Mijozlar', path: '/panel/users' },
  { icon: Settings, label: 'Telegram Bot', path: '/panel/settings' },
];

const crmSidebarItems = [
  { icon: LayoutDashboard, label: 'CRM Dashboard', path: '/panel/crm' },
  { icon: Factory, label: 'Ishlab chiqarish', path: '/panel/crm/production' },
  { icon: Bike, label: 'Motolar', path: '/panel/crm/motos' },
  { icon: HardHat, label: 'Ishchilar', path: '/panel/crm/workers' },
  { icon: Warehouse, label: 'Sklad', path: '/panel/crm/inventory' },
  { icon: Store, label: "Do'konlar", path: '/panel/crm/shops' },
  { icon: Wallet, label: 'Moliya', path: '/panel/crm/finance' },
  { icon: ArrowRightLeft, label: 'Tranzaksiyalar', path: '/panel/crm/transactions' },
  { icon: ShoppingCart, label: 'Sotuv', path: '/panel/crm/sales' },
  { icon: BarChart3, label: 'Analitika', path: '/panel/crm/analytics' },
  { icon: Cog, label: 'Sozlamalar', path: '/panel/crm/settings' },
];

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    logout();
    navigate('/panel/login');
  };

  return (
    <div className="admin-container">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div
            className="admin-sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'} ${isMobile ? 'mobile' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo">
            <div className="logo-icon">H</div>
            <span>Haipeng Admin</span>
          </div>
          {isMobile && (
            <button className="sidebar-close" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="admin-sidebar-nav">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
              <ChevronRight size={14} className="nav-chevron" />
            </NavLink>
          ))}

          <div className="admin-sidebar-divider">
            <span>CRM / ERP</span>
          </div>

          {crmSidebarItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/panel/crm'}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={20} className="nav-icon" />
              <span>{item.label}</span>
              <ChevronRight size={14} className="nav-chevron" />
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`admin-main ${isSidebarOpen && !isMobile ? 'sidebar-open' : ''}`}>
        {/* Navbar */}
        <header className="admin-navbar">
          <div className="navbar-left">
            <button className="sidebar-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu size={24} />
            </button>
            <div className="navbar-search">
              <Search size={18} />
              <input type="text" placeholder="Qidiruv..." />
            </div>
          </div>

          <div className="navbar-right">
            <button className="nav-action-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="admin-profile">
              <div className="profile-info">
                <span className="profile-name">Administrator</span>
                <span className="profile-role">Super Admin</span>
              </div>
              <div className="profile-avatar">
                <Users size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <section className="admin-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
