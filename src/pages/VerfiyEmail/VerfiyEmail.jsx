import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const VerfiyEmail = () => {
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const controller = new AbortController()

    if (!token) {
      setStatus('no-token')
      // no automatic redirect; user can click the link below
      return () => controller.abort()
    }

    const verify = async () => {
      setStatus('verifying')
      try {
        const xx = await axios.post('/api/Auth/verify-email', { token }, { signal: controller.signal })
        console.log(xx)
        setStatus('success')
      } catch (error) {
        // treat any error as verification failure
        // log for debugging then update UI
        console.error('Email verification error:', error)
        setStatus('error')
      }

      // no automatic redirect; user can click the link below
    }

    verify()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: '1rem'
    }}>
      {status === 'verifying' && (
        <>
          <h2 style={{ margin: 0 }}>Verifying your email…</h2>
          <p style={{ margin: 0, color: '#555' }}>Please wait while we verify your email address.</p>
        </>
      )}
      p
      {status === 'success' && (
        <>
          <h2 style={{ margin: 0 }}>Your email has been verified ✅</h2>
          <p style={{ margin: 0, color: '#555' }}>Verification succeeded. <Link to="/">Go to home</Link></p>
        </>
      )}

      {status === 'error' && (
        <>
          <h2 style={{ margin: 0 }}>Verification failed ⚠️</h2>
          <p style={{ margin: 0, color: '#555' }}>There was a problem verifying your email. <Link to="/">Go to home</Link></p>
        </>
      )}

      {status === 'no-token' && (
        <>
          <h2 style={{ margin: 0 }}>No verification token found</h2>
          <p style={{ margin: 0, color: '#555' }}>No token provided. <Link to="/">Go to home</Link></p>
        </>
      )}
    </div>
  )
}

export default VerfiyEmail