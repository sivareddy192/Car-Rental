import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// ─── Root App Layout ───────────────────────────────────────────────────────────
import App from '../App';

// ─── Public Pages ──────────────────────────────────────────────────────────────
import { Home }           from '../pages/Home';
import { SelfDrive }      from '../pages/SelfDrive';
import { VehicleDetails } from '../pages/VehicleDetails';
import { TaxiService }    from '../pages/TaxiService';
import { TourPackages }   from '../pages/TourPackages';
import { TourDetails }    from '../pages/TourDetails';
import { NRISolutions }   from '../pages/NRISolutions';
import { WeddingCars }    from '../pages/WeddingCars';
import { ContactUs }      from '../pages/ContactUs';
import { Wishlist }       from '../pages/Wishlist';
import { BlogList }       from '../pages/BlogList';
import { BlogDetails }    from '../pages/BlogDetails';

// ─── Auth Pages ────────────────────────────────────────────────────────────────
import { Login }               from '../pages/auth/Login';
import { Register }            from '../pages/auth/Register';
import { VerificationPending } from '../pages/auth/VerificationPending';
import { VerifyEmail }         from '../pages/auth/VerifyEmail';
import { ForgotPassword }      from '../pages/auth/ForgotPassword';

// ─── User Dashboard ────────────────────────────────────────────────────────────
import { UserDashboard } from '../pages/dashboard/UserDashboard';

// ─── Admin Portal ──────────────────────────────────────────────────────────────
import { AdminLayout }    from '../pages/admin/AdminLayout';
import { AdminOverview }  from '../pages/admin/AdminOverview';
import { AdminBookings }  from '../pages/admin/AdminBookings';
import { AdminFleet }     from '../pages/admin/AdminFleet';
import { AdminLeads }     from '../pages/admin/AdminLeads';
import { AdminMessages }  from '../pages/admin/AdminMessages';
import { AdminCustomers } from '../pages/admin/AdminCustomers';
import { AdminAudit }     from '../pages/admin/AdminAudit';
import { AdminBlogs }     from '../pages/admin/AdminBlogs';

// ─── Route Guards ──────────────────────────────────────────────────────────────
import { ProtectedRoute, AdminRoute } from '../components/common/ProtectedRoute';

// ─── 404 Fallback ──────────────────────────────────────────────────────────────
const NotFound = () => (
  <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-center px-4">
    <div>
      <div className="text-8xl font-black text-zinc-800 mb-4">404</div>
      <h1 className="text-2xl font-black text-white mb-2">Destination Not Found</h1>
      <p className="text-xs text-zinc-500 mb-6">The requested page does not exist on our servers.</p>
      <a href="/" className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-black text-sm hover:bg-amber-400 transition-colors">
        Back to Home
      </a>
    </div>
  </div>
);

const router = createBrowserRouter([

  // ─── Admin Portal ─────────────────────────────────────────────────────────
  {
    path: 'admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      { index: true,       element: <AdminOverview /> },
      { path: 'bookings',  element: <AdminBookings /> },
      { path: 'fleet',     element: <AdminFleet /> },
      { path: 'leads',     element: <AdminLeads /> },
      { path: 'messages',  element: <AdminMessages /> },
      { path: 'customers', element: <AdminCustomers /> },
      { path: 'audit',     element: <AdminAudit /> },
      { path: 'blogs',     element: <AdminBlogs /> },
      { path: '*',         element: <Navigate to="/admin" replace /> },
    ],
  },

  // ─── Main Customer App ────────────────────────────────────────────────────
  {
    path: '/',
    element: <App />,
    children: [
      // Public pages
      { index: true,              element: <Home /> },
      { path: 'self-drive',       element: <SelfDrive /> },
      { path: 'vehicles/:id',     element: <VehicleDetails /> },
      { path: 'taxi',             element: <TaxiService /> },
      { path: 'tours',            element: <TourPackages /> },
      { path: 'tours/:id',        element: <TourDetails /> },
      { path: 'blog',             element: <BlogList /> },
      { path: 'blog/:slug',       element: <BlogDetails /> },
      { path: 'nri-solutions',    element: <NRISolutions /> },
      { path: 'wedding-cars',     element: <WeddingCars /> },
      { path: 'contact',          element: <ContactUs /> },
      { path: 'wishlist',         element: <Wishlist /> },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        ),
      },

      // Auth pages
      { path: 'login',                 element: <Login /> },
      { path: 'register',              element: <Register /> },
      { path: 'verification-pending',  element: <VerificationPending /> },
      { path: 'verify-email',          element: <VerifyEmail /> },
      { path: 'forgot-password',       element: <ForgotPassword /> },

      // 404 catch-all
      { path: '*', element: <NotFound /> },
    ],
  },

]);

export default router;
