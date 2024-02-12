'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';

export default function Login() {
  const AUTH_API = 'http://localhost:3000/api/auth/login';
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      // Validate input before submission
      if (!email || !password) {
        // Handle invalid input, display error messages to the user
        setErrorMessage('Please fill out all required fields.');
        return;
      }

      const body = { email, password };

      const response = await fetch(new URL(AUTH_API), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error || data.success === false) {
        // Display error message to the user
        setErrorMessage('invalid credentials');
        return;
      } else {
        // Reset error message
        setErrorMessage('');
        // Redirect only if the response is successful
        router.push(`/user/${data.user.id}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred at login ');
    }
  };

  return (
    <>
      <div className={styles.page}>
        <form onSubmit={submitData}>
          <h1>Login</h1>
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            type="email"
            value={email}
          />
          <br />
          <input
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            value={password}
          />
          <br />
          <input disabled={!email || !password} type="submit" value="Login" />
          <a className={styles.back} href="/signup">
            or Signup
          </a>
        </form>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </>
  );
}
