import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './route/index.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { ThemeProvider } from './provider/ThemeProvider.jsx'
import { CookieConsentProvider } from './context/CookieConsentContext.jsx'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <ThemeProvider>
      <CookieConsentProvider>
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </CookieConsentProvider>
    </ThemeProvider>
  </Provider>
)
