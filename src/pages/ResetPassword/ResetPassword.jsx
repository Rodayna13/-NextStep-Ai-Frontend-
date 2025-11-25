import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './ResetPassword.css'

const ResetPassword = () => {
    const navigate = useNavigate()
    const [token, setToken] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [status, setStatus] = useState('idle') // idle | submitting | success | error
    const [errorMsg, setErrorMsg] = useState('')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        const t = params.get('token')
        if (t) setToken(t)
    }, [])

    const validate = () => {
        if (!newPassword) {
            setErrorMsg('Please enter a new password')
            return false
        }

        // Reuse the same validation rules as Signup:
        // - minimum 8 characters
        // - at least one uppercase letter
        // - at least one number
        // - at least one special character
        if (newPassword.length < 8) {
            setErrorMsg('Password must be at least 8 characters long')
            return false
        }
        if (!/[A-Z]/.test(newPassword)) {
            setErrorMsg('Password must contain at least one uppercase letter')
            return false
        }
        if (!/[0-9]/.test(newPassword)) {
            setErrorMsg('Password must contain at least one number')
            return false
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            setErrorMsg('Password must contain at least one special character')
            return false
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg('Passwords do not match')
            return false
        }

        setErrorMsg('')
        return true
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!validate()) return
        if (!token) {
            setErrorMsg('No token provided')
            return
        }

        setStatus('submitting')
        try {
            const xx = await axios.post('/api/Auth/reset-password', { token, newPassword })
            console.log(xx)
            setStatus('success')
            // navigate to login
            navigate('/login')
        } catch (err) {
            console.error('Reset password error:', err)
            setStatus('error')
            // show friendly message
            setErrorMsg(err?.response?.data?.message || 'Failed to reset password')
        }
    }

    return (
        <div className="rp-root">
            <div className="rp-card">
                <h2 className="rp-title">Reset Password</h2>
                <p className="rp-desc">Choose a new, strong password for your account.</p>

                {!token && <p className="rp-desc">No reset token found in the URL. Copy the link from your email or <a className="rp-link" href="/">return home</a>.</p>}

                <form className="rp-form" onSubmit={onSubmit}>
                    <div className="rp-group">
                        <label className="rp-label">New password</label>
                        <div className="rp-input-row">
                            <input
                                className="rp-input"
                                type={showPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                            />
                            <button type="button" className="rp-toggle-btn" onClick={() => setShowPassword(v => !v)} aria-label="Toggle show password">
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <div className="rp-group">
                        <label className="rp-label">Confirm password</label>
                        <div className="rp-input-row">
                            <input
                                className="rp-input"
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Repeat new password"
                            />
                        </div>
                    </div>

                    {errorMsg && <div className="rp-error">{errorMsg}</div>}

                    <button className="rp-submit" type="submit" disabled={status === 'submitting' || !token}>{status === 'submitting' ? 'Submitting...' : 'Reset Password'}</button>

                    {status === 'success' && <div className="rp-status" style={{ color: 'green' }}>Password reset successfully — redirecting to login.</div>}
                    {status === 'error' && <div className="rp-status" style={{ color: 'red' }}>Failed to reset password.</div>}
                </form>
            </div>
        </div>
    )
}

export default ResetPassword