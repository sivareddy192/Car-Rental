import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { Navbar }          from './components/layout/Navbar';
import { Footer }          from './components/layout/Footer';
import { WhatsAppButton }  from './components/layout/WhatsAppButton';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { ScrollToTop } from './components/common/ScrollToTop';
import { useTheme }        from './context/ThemeContext';
import { fetchMe }       from './store/slices/authSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';

export function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    if (localStorage.getItem('rd_access_token')) {
      dispatch(fetchMe());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <div className="min-h-screen bg-transparent dark:bg-black text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#0f0f11' : '#ffffff',
            color: isDark ? '#ffffff' : '#09090b',
            border: isDark ? '1px solid #27272a' : '1px solid #e4e4e7',
            fontSize: '13px',
            borderRadius: '12px',
            boxShadow: isDark
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.7)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: isDark ? '#ffffff' : '#000000',
              secondary: isDark ? '#000000' : '#ffffff',
            },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
          },
        }}
      />

      <ScrollToTop />
      <Navbar />

      <main className="flex-1 pb-16 lg:pb-0">
        {/* All child page routes render here via the router */}
        <Outlet />
      </main>

      <Footer />
      <WhatsAppButton />
      <MobileBottomNav />
    </div>
  );
}

export default App;
