import { Outlet, useLocation, Navigate } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'
import { Suspense, useEffect } from 'react'
import fetchUserDetails from './utils/fetchUserDetails'
import { setUserDetails } from './store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import GlobalProvider from './provider/GlobalProvider'
import BottomNavigationBar from './components/BottomNavigationBar'
import ScrollToTop from './components/ScrollToTop'
import CookieConsentBanner from './components/cookie/CookieConsentBanner'
import CookiePreferenceModal from './components/cookie/CookiePreferenceModal'
import RouteLoadingFallback from './components/common/RouteLoadingFallback'

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector(state => state.user)

  useEffect(() => {
    const fetchUser = async () => {
      if (!localStorage.getItem('accessToken')) return

      const userData = await fetchUserDetails()
      if (userData?.success) {
        dispatch(setUserDetails(userData.data))
      }
    }

    fetchUser().catch(error => {
      console.error("Unable to load the signed-in user:", error)
    })
  }, [dispatch]);

  const role = (user?.role || "").toLowerCase();

  // Commercial roles (Dealer, Admin, Agent) must use their respective Dashboards and NOT the consumer User UI/UX
  if (role === "dealer") {
    const dealerTarget = user.onboardingStatus === 'submitted'
      ? '/dealer/status'
      : (user.onboardingStatus === 'approved' ? '/dealer/dashboard' : '/dealer/onboarding');
    return <Navigate to={dealerTarget} replace />
  }

  if (role === "admin") {
    return <Navigate to="/admin-portal/dashboard" replace />
  }

  if (role === "agent") {
    const agentTarget = user.onboardingStatus === 'submitted'
      ? '/agent/status'
      : (user.onboardingStatus === 'approved' ? '/agent/dashboard' : '/agent/onboarding');
    return <Navigate to={agentTarget} replace />
  }

  return (
    <GlobalProvider> 
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <ScrollToTop/>
        <Header/>
        <main className='min-h-[78vh] pt-28 pb-24 lg:pt-20 lg:pb-0'>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Outlet/>
          </Suspense>
        </main>
        <Footer/>
        <Toaster/>
        <BottomNavigationBar/>
        <CookieConsentBanner/>
        <CookiePreferenceModal/>
      </div>
    </GlobalProvider>
  )
}

export default App
