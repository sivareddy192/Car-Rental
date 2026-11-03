import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SummaryApi from "../common/SummaryApi"
import toast from "react-hot-toast"
import AxiosToastError from "../utils/AxiosToastError"
import Axios from "../utils/Axios"
import AuthLayout from "../components/AuthLayout"

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()

  const [data, setData] = useState({
    email: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")
  const [confirmError, setConfirmError] = useState("")
  const [strength, setStrength] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (location?.state?.email) {
      setData((prev) => ({
        ...prev,
        email: location?.state?.email
      }))
    }
  }, [location])

  const strengthNames = ["Very Weak", "Weak", "Medium", "Strong"]
  const strengthColors = ["#ef4444", "#f97316", "#eab308", "#10b981"]

  const handleChange = (e) => {
    const { name, value } = e.target

    setData((prev) => ({
      ...prev,
      [name]: value
    }))

    if (name === "newPassword") {
      let score = 0
      if (value.length >= 8) score++
      if (/[A-Z]/.test(value)) score++
      if (/[0-9]/.test(value)) score++
      if (/[!@#$%^&*]/.test(value)) score++

      setStrength(score)

      if (!value) {
        setPasswordError("Password cannot be empty.")
      } else if (value.length < 8) {
        setPasswordError("Password must be at least 8 characters long.")
      } else {
        setPasswordError("")
      }

      if (data.confirmPassword) {
        if (value === data.confirmPassword) {
          setConfirmError("Passwords match ✔")
        } else {
          setConfirmError("Passwords do not match ✘")
        }
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        setConfirmError("")
      } else if (value !== data.newPassword) {
        setConfirmError("Passwords do not match ✘")
      } else {
        setConfirmError("Passwords match ✔")
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!data.newPassword || data.newPassword.length < 8) {
      toast.error("Please enter a valid password with at least 8 characters.")
      return
    }

    if (data.newPassword !== data.confirmPassword) {
      toast.error("New Password and Confirm Password must match.")
      return
    }

    setLoading(true)
    try {
      const response = await Axios({
        ...SummaryApi.resetPassword,
        data: {
          email: data.email,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword
        }
      })

      if (response.data?.success) {
        toast.success(response.data.message || "Password updated successfully!")
        navigate("/login")
      } else {
        toast.error(response.data?.message || "Failed to reset password")
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Ensure your account is protected with a strong, secure passphrase."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {data.email && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-medium">
            Resetting password for: <span className="font-bold underline">{data.email}</span>
          </div>
        )}

        {/* New Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            New Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type={showPassword ? "text" : "password"}
              name="newPassword"
              value={data.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-11 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(p => !p)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {data.newPassword && (
            <div className="mt-2 space-y-1">
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${strength * 25}%`,
                    backgroundColor: strengthColors[strength - 1] || "#ef4444"
                  }}
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Strength:</span>
                <span className="font-bold" style={{ color: strengthColors[strength - 1] || "#ef4444" }}>
                  {strengthNames[strength - 1] || "None"}
                </span>
              </p>
            </div>
          )}

          {passwordError && (
            <p className="text-xs text-rose-500 font-medium mt-1">{passwordError}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative flex items-center">
            <Lock className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-3.5 pointer-events-none" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full pl-11 pr-11 py-3 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(p => !p)}
              className="absolute right-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {confirmError && (
            <p className={`text-xs font-medium mt-1 ${confirmError.includes("✔") ? "text-emerald-500" : "text-rose-500"}`}>
              {confirmError}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !data.newPassword || data.newPassword !== data.confirmPassword}
          className="w-full mt-4 py-3.5 px-4 rounded-xl font-bold text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 shadow-lg shadow-amber-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-98"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>Update Password</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-3">
          Remembered your password?{" "}
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
