import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWalletBalance } from '../api/walletService';
import { useUser } from './UserContext';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const { user } = useUser();
  const [balanceData, setBalanceData] = useState({
    balance: 0,
    totalCredits: 0,
    totalDebits: 0
  });
  const [loading, setLoading] = useState(false);

  const fetchWalletBalance = async () => {
    if (!user || user.role !== 'user') {
      setBalanceData({ balance: 0, totalCredits: 0, totalDebits: 0 });
      return;
    }
    setLoading(true);
    try {
      const response = await getWalletBalance();
      if (response?.success) {
        const payload = response.data ?? response;
        setBalanceData({
          balance: payload.balance ?? 0,
          totalCredits: payload.totalCredits ?? 0,
          totalDebits: payload.totalDebits ?? 0
        });
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletBalance();
  }, [user]);

  return (
    <WalletContext.Provider value={{ 
      balanceData, 
      loading, 
      refreshWalletBalance: fetchWalletBalance 
    }}>
      {children}
    </WalletContext.Provider>
  );
};
