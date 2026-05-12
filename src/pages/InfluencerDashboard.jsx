import React, { useState } from 'react';
import { 
  Users, 
  Share2, 
  Wallet, 
  TrendingUp, 
  Copy, 
  Check,
  Eye,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

const InfluencerDashboard = () => {
  const [copied, setCopied] = useState(false);

  const stats = [
    { label: 'Total Earnings', value: '₹12,450', icon: <Wallet className="text-blue-600" />, sub: 'Withdrawable: ₹8,400' },
    { label: 'Total Referrals', value: '1,280', icon: <Users className="text-green-600" />, sub: '+45 this week' },
    { label: 'Conversion Rate', value: '3.2%', icon: <TrendingUp className="text-purple-600" />, sub: 'Top 5% of creators' },
    { label: 'Active Content', value: '24', icon: <Share2 className="text-orange-600" />, sub: 'Across 3 platforms' },
  ];

  const campaigns = [
    { id: 'WK-402', product: 'Lipstick #Red-Vibe', commission: '15%', clicks: 420, sales: 12, status: 'Active' },
    { id: 'WK-911', product: 'Serum #Glow-01', commission: '10%', clicks: 890, sales: 24, status: 'Active' },
    { id: 'WK-105', product: 'Mascara #Vol-2', commission: '12%', clicks: 150, sales: 5, status: 'Paused' },
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <span className="text-2xl font-bold text-primary uppercase">WAKEUP CREATOR</span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-primary text-white shadow-lg shadow-primary/20 transition-all">
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
            <Share2 size={20} /> Campaigns
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
            <Wallet size={20} /> My Wallet
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition-all">
            <Users size={20} /> Audience
          </button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase">Influencer Tier: Diamond</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2">
              Withdraw Earnings <ExternalLink size={14} />
            </button>
          </div>
        </header>

        <main className="p-8 space-y-8">
          {/* Referral Link Card */}
          <div className="bg-gradient-to-r from-primary to-pink-500 p-8 rounded-3xl text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 uppercase">Your Unique Referral Link</h2>
              <p className="text-white/80 font-medium mb-6 text-sm">Share this link with your audience to earn up to 20% commission on every sale.</p>
              <div className="flex items-center bg-white/20 backdrop-blur-md rounded-xl p-2 gap-4 border border-white/20">
                <code className="flex-grow font-bold text-sm px-4">wakeupmakeup.com/ref/cre8or_2024</code>
                <button 
                  onClick={handleCopy}
                  className="bg-white text-primary px-6 py-2 rounded-lg font-bold uppercase text-xs flex items-center gap-2 hover:bg-gray-100 transition-all"
                >
                  {copied ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy Link</>}
                </button>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="p-3 bg-gray-50 w-fit rounded-xl mb-4">{stat.icon}</div>
                <h3 className="text-gray-500 text-xs font-bold uppercase mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-[10px] font-bold text-gray-400 mt-2 flex items-center gap-1 uppercase">{stat.sub}</p>
              </div>
            ))}
          </div>

          {/* Content Submission Form (Task 6 Requirement) */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <PlusCircle size={24} />
              </div>
              <h2 className="text-xl font-bold uppercase">Submit New Content</h2>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Platform</label>
                <select className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none">
                  <option>Instagram Reel</option>
                  <option>YouTube Video</option>
                  <option>TikTok / Short</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Content URL</label>
                <input type="url" placeholder="https://..." className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Short Description</label>
                <textarea rows="3" placeholder="Explain the content theme..." className="w-full p-4 bg-gray-50 border-none rounded-xl text-sm font-bold outline-none"></textarea>
              </div>
              <button className="md:col-span-2 bg-primary text-white py-4 rounded-xl font-bold uppercase text-sm shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all">
                Submit Content for Review
              </button>
            </form>
          </div>

          {/* Active Campaigns - Masked Product Names (Task 6 Requirement) */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold uppercase">Active Campaigns</h2>
              <button className="text-xs font-bold text-primary uppercase hover:underline transition-all">View All Products</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">Product ID</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">Commission</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">Clicks</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">Sales</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {campaigns.map((camp) => (
                    <tr key={camp.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800 uppercase">{camp.id}</span>
                          <span className="text-[10px] font-bold text-gray-400">Name Hidden (ID Masked)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-primary">{camp.commission}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-700">{camp.clicks}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-700">{camp.sales}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${camp.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          {camp.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-all">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const LayoutDashboard = ({ size }) => <Users size={size} />;

export default InfluencerDashboard;
