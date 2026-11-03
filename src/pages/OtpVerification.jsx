import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import Axios from "../utils/Axios"
import SummaryApi from "../common/SummaryApi"
import AxiosToastError from "../utils/AxiosToastError"
import { Link, useLocation, useNavigate } from "react-router-dom"
import AuthLayout from "../components/AuthLayout"
import { ShieldCheck, RotateCw } from 'lucide-react';

export default function OtpVerification() {
  const [data, setData] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(30)
  const canResend = timer === 0

  const navigate = useNavigate()
  const inputRef = useRef([])
  const location = useLocation()

  useEffect(() => {
    if (!location?.state?.email) {
      navigate("/forgot-password")
    }
  }, [location, navigate])

  useEffect(() => {
    if (timer <= 0) return

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [timer])

  const valideValue = data.every((el) => el)

  const handleChange = (value, index) => {
    let newData = [...data]

    if (value.length === 6) {
      newData = value.split("").slice(0, 6)
      setData(newData)
      inputRef.current[5]?.focus()
      return
    }

    newData[index] = value.slice(-1)
    setData(newData)

    if (value && index < 5) {
      inputRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !data[index] && index > 0) {
      inputRef.current[index - 1]?.focus()
    }
  }

  const handleResendOtp = async () => {
    if (!canResend) return

    try {
      await Axios({
        ...SummaryApi.forgot_password,
        data: {
          email: location?.state?.email
        }
      })

      toast.success("A new verification OTP has been dispatched to your email.")
      setTimer(30)
    } catch (error) {
      AxiosToastError(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await Axios({
        ...SummaryApi.forgot_password_otp_verification,
        data: {
          otp: data.join(""),
          email: location?.state?.email
        }
      })

      setIsLoading(false)

      if (response.data?.success) {
        toast.success(response.data.message || "OTP verified successfully")
        navigate("/reset-password", {
          state: {
            data: response.data,
            email: location?.state?.email
          }
        })
      } else {
        toast.error(response.data?.message || "Invalid OTP")
      }
    } catch (error) {
      setIsLoading(false)
      AxiosToastError(error)
    }
  }

  return (
    <AuthLayout
      title="Verify Your Security Code"
      subtitle={`Enter the 6-digit code sent to ${location?.state?.email || "your registered email"}`}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {data.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              ref={(ref) => (inputRef.current[index] = ref)}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all shadow-xs"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!valideValue || isLoading}
          className="w-full py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Verify & Continue</span>
            </>
          )}
        </button>

        <div className="text-center pt-2">
          {canResend ? (
            <button
              type="button"
              onClick={handleResendOtp}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Resend Verification Code</span>
            </button>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Resend code in <span className="font-bold text-amber-600 dark:text-amber-400">{timer}s</span>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
          Back to{" "}
          <Link
            to="/login"
            className="font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors ml-1"
          >
            Log In
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
