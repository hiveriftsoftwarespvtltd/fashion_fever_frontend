import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertCircle, 
  History,
  Gift,
  ChevronRight
} from 'lucide-react';

const Wallet = () => {
  const transactions = [
    { id: 1, type: 'credit', title: 'Cashback Earned', desc: 'Order #WK-4202', amount: '+₹45.00', date: '29 Apr 2024', expiry: '28 Jul 2024' },
    { id: 2, type: 'debit', title: 'Wallet Payment', desc: 'Order #WK-4209', amount: '-₹150.00', date: '25 Apr 2024', expiry: null },
    { id: 3, type: 'credit', title: 'Promotional Reward', desc: 'Beauty Quiz Winner', amount: '+₹250.00', date: '20 Apr 2024', expiry: '19 Jul 2024' },
    { id: 4, type: 'credit', title: 'Referral Bonus', desc: 'Friend Signed Up', amount: '+₹100.00', date: '15 Apr 2024', expiry: '14 Jul 2024' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container max-w-5xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 uppercase  mb-12">My Beauty Wallet</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Balance Section */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-primary via-primary to-pink-500 p-10 rounded-[3rem] text-white shadow-2xl shadow-primary/30 relative overflow-hidden h-fit">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <WalletIcon size={32} />
                  <span className="text-[10px] font-bold uppercase bg-white/20 px-3 py-1 rounded-full">Active</span>
                </div>
                <h3 className="text-sm font-bold uppercase text-white/70 mb-2">Total Balance</h3>
                <p className="text-5xl font-bold mb-12">₹1,245.50</p>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/80">
                    <Clock size={14} /> Expiring Soon: ₹245.00
                  </div>
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white w-[20%] h-full rounded-full shadow-[0_0_10px_white]"></div>
                  </div>
                </div>
              </div>
              {/* Decorative Circles */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/5 rounded-xl text-primary"><Gift size={24} /></div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-800 uppercase ">Refer & Earn</span>
                  <span className="text-[10px] font-bold text-gray-400">Get ₹100 for every friend</span>
                </div>
              </div>
              <button className="w-full py-4 border-2 border-primary/10 text-primary font-bold uppercase text-[10px] rounded-xl hover:bg-primary/5 transition-all cursor-pointer">Share Referral Link</button>
            </div>
          </div>

          {/* Transactions Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-2xl"><History size={24} className="text-gray-400" /></div>
                  <h2 className="text-xl font-bold uppercase  ">Transaction History</h2>
                </div>
                <select className="bg-gray-50 border-none text-[10px] font-bold uppercase p-3 rounded-xl outline-none">
                  <option>All Transactions</option>
                  <option>Credits Only</option>
                  <option>Debits Only</option>
                </select>
              </div>

              <div className="space-y-6">
                {transactions.map((tx) => (
                  <div key={tx.id} className="group flex items-center justify-between p-6 hover:bg-gray-50 rounded-3xl transition-all duration-300 border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-6">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${tx.type === 'credit' ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                        {tx.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800 ">{tx.title}</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase ">{tx.desc} • {tx.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-lg font-bold ${tx.type === 'credit' ? 'text-green-500' : 'text-gray-900'}`}>{tx.amount}</span>
                      {tx.expiry && (
                        <span className="text-[8px] font-bold text-gray-300 uppercase flex items-center gap-1">
                          <AlertCircle size={8} /> Expires: {tx.expiry}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-10 py-5 bg-gray-50 text-gray-400 font-bold uppercase text-[10px] rounded-[1.5rem] hover:bg-gray-100 hover:text-primary transition-all flex items-center justify-center gap-2 cursor-pointer">
                Load More History <ChevronRight size={14} />
              </button>
            </div>

            <div className="p-8 bg-gray-900 text-white rounded-[2.5rem] flex items-center justify-between shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold uppercase  mb-2">90-Day Expiry Policy</h3>
                <p className="text-white/40 text-[10px] font-bold uppercase max-w-[280px]">All cashback earned through orders expires within 90 days of credit if not used.</p>
              </div>
              <AlertCircle className="text-white/5 relative z-10" size={80} strokeWidth={3} />
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Wallet;
