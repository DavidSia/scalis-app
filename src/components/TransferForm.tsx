'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Account {
  id: string;
  type: string;
  balance: number;
}

interface TransferFormProps {
  accounts: Account[];
}

const TransferForm: React.FC<TransferFormProps> = ({ accounts }) => {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [sourceAccountId, setSourceAccountId] = useState<string>('');
  const [destinationAccountId, setDestinationAccountId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleTransfer = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const sourceAccount = accounts.find(
        (account) => account.id === sourceAccountId,
      );
      const destinationAccount = accounts.find(
        (account) => account.id === destinationAccountId,
      );

      if (!sourceAccount || !destinationAccount) {
        throw new Error('Source or destination account not found');
      }

      if (amount > sourceAccount.balance) {
        setErrorMessage('Amount exceeds source account balance');
        return;
      }

      const updatedSourceBalance = sourceAccount.balance - amount;
      // Add the transferred amount to the destination account balance
      const updatedDestinationBalance = destinationAccount.balance + amount;

      // Update the balances in the accounts array
      const updatedAccounts = accounts.map((account) => {
        if (account.id === sourceAccountId) {
          return { ...account, balance: updatedSourceBalance };
        } else if (account.id === destinationAccountId) {
          return { ...account, balance: updatedDestinationBalance };
        } else {
          return account;
        }
      });

      const response = await fetch(
        new URL('http://localhost:3000/api/account'),
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAccounts),
        },
      );

      const data = await response.json();

      if (data.error) {
        setErrorMessage(data.error);
      } else {
        setErrorMessage('');
        router.refresh();
      }
    } catch (error) {
      setErrorMessage('Error transferring funds:');
    }
  };

  const handleSourceAccountChange = (accountId: string) => {
    setSourceAccountId(accountId);
    // Automatically select the opposite account type as destination
    const sourceAccount = accounts.find((account) => account.id === accountId);
    if (sourceAccount) {
      const oppositeAccountType =
        sourceAccount.type === 'saving' ? 'checking' : 'saving';
      const oppositeAccount = accounts.find(
        (account) => account.type === oppositeAccountType,
      );
      if (oppositeAccount) {
        setDestinationAccountId(oppositeAccount.id);
      }
    }
  };

  return (
    <form onSubmit={handleTransfer}>
      <div>
        <label>Select Source Account:</label>
        <select
          value={sourceAccountId}
          onChange={(e) => handleSourceAccountChange(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Select Destination Account:</label>
        <select
          value={destinationAccountId}
          onChange={(e) => setDestinationAccountId(e.target.value)}
        >
          <option value="">Select Account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.type}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Enter Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder="Enter amount"
        />
      </div>
      {errorMessage && <div>{errorMessage}</div>}
      <input
        disabled={!sourceAccountId || !destinationAccountId || amount <= 0}
        type="submit"
        value="Transfer"
      />
    </form>
  );
};

export default TransferForm;
