'use client';
import React from 'react';

interface Account {
  type: string;
  balance: number;
}

interface AccountListProps {
  accounts: Account[];
}

const AccountList: React.FC<AccountListProps> = ({ accounts }) => {
  return (
    <div>
      <h2>Accounts</h2>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {account.type}: ${account.balance}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
