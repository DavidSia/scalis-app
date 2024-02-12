'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../signup.module.css';

const CREATE_USER_ACCOUNT_API = 'http://localhost:3000/api/user';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [account1Type, setAccount1Type] = useState('');
  const [account1InitialBalance, setAccount1InitialBalance] = useState('');
  const [account2Type, setAccount2Type] = useState('');
  const [account2InitialBalance, setAccount2InitialBalance] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAccount1TypeChange = (e) => {
    const { value } = e.target;
    setAccount1Type(value);
    // If the user picks 'saving', set the other account type to 'checking', and vice versa
    setAccount2Type(value === 'saving' ? 'checking' : 'saving');
  };

  const handleAccount2TypeChange = (e) => {
    const { value } = e.target;
    setAccount2Type(value);
    // If the user picks 'saving', set the other account type to 'checking', and vice versa
    setAccount1Type(value === 'saving' ? 'checking' : 'saving');
  };

  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      // Validate input before submission
      if (
        !name ||
        !email ||
        !password ||
        !account1Type ||
        !account1InitialBalance ||
        !account2Type ||
        !account2InitialBalance
      ) {
        // Handle invalid input, display error messages to the user
        setErrorMessage('Please fill out all required fields.');
        return;
      }

      // Parse initial balance values to ensure they are valid numeric values
      const initialBalance1 = parseFloat(account1InitialBalance);
      const initialBalance2 = parseFloat(account2InitialBalance);

      // Handle NaN (Not-a-Number) cases for initial balance values
      if (isNaN(initialBalance1) || isNaN(initialBalance2)) {
        setErrorMessage('Invalid initial balance values.');
        return;
      }

      const accounts = [
        { type: account1Type, initialBalance: initialBalance1 },
        { type: account2Type, initialBalance: initialBalance2 },
      ];

      const body = { name, email, password, accounts };

      const response = await fetch(new URL(CREATE_USER_ACCOUNT_API), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        // Display error message to the user
        setErrorMessage(data.error);
        return;
      } else {
        // Reset error message
        setErrorMessage('');
        // Redirect only if the response is successful
        router.push(`/user/${data.user.id}`);
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing your request.');
    }
  };

  return (
    <>
      <div className={styles.page}>
        <form onSubmit={submitData}>
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
          <br />
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
          {/* Input fields for account 1 */}
          <select onChange={handleAccount1TypeChange} value={account1Type}>
            <option value="">Select Account Type</option>
            <option value="saving">Saving</option>
            <option value="checking">Checking</option>
          </select>
          <input
            onChange={(e) => setAccount1InitialBalance(e.target.value)}
            placeholder="Initial Balance"
            type="text"
            value={account1InitialBalance}
          />
          <br />
          {/* Input fields for account 2 */}
          <select onChange={handleAccount2TypeChange} value={account2Type}>
            <option value="">Select Account Type</option>
            <option value="saving">Saving</option>
            <option value="checking">Checking</option>
          </select>
          <input
            onChange={(e) => setAccount2InitialBalance(e.target.value)}
            placeholder="Initial Balance"
            type="text"
            value={account2InitialBalance}
          />
          <br />
          <input
            disabled={
              !name ||
              !email ||
              !password ||
              !account1Type ||
              !account1InitialBalance ||
              !account2Type ||
              !account2InitialBalance
            }
            type="submit"
            value="Signup"
          />
          <a className={styles.back} href="/">
            or Cancel
          </a>
        </form>
        {errorMessage && <div>{errorMessage}</div>}
      </div>
    </>
  );
}
