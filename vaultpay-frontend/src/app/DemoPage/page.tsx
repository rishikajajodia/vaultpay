'use client';

import React, { useState, useEffect } from 'react';

interface TransactionForm {
  recipientName: string;
  amount: string;
  paymentMethod: string;
}

interface RiskAnalysis {
  score: number;
  status: 'safe' | 'moderate' | 'high';
  message: string;
  analyzing: boolean;
  blockchainTxHash?: string;
}

interface Transaction {
  id: string;
  recipient: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
}

export default function DemoPage() {
  const [formData, setFormData] = useState<TransactionForm>({
    recipientName: '',
    amount: '',
    paymentMethod: 'credit-card'
  });

  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis>({
    score: 15,
    status: 'safe',
    message: 'Ready to analyze your first transaction',
    analyzing: false
  });

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
  const [chartData] = useState([45, 62, 48, 71, 55, 75, 52, 68]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response = await fetch('/api/transactions?limit=10');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setRecentTransactions(data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const analyzeTransaction = async () => {
    if (!formData.recipientName.trim()) {
      setError('Please enter a recipient name');
      return;
    }
    if (!formData.amount.trim()) {
      setError('Please enter an amount');
      return;
    }

    setRiskAnalysis({ ...riskAnalysis, analyzing: true, blockchainTxHash: undefined });
    setError('');

    try {
      const amountNumber = parseFloat(formData.amount.replace(/[$,]/g, ''));
      if (isNaN(amountNumber) || amountNumber <= 0) {
        setError('Please enter a valid amount');
        setRiskAnalysis({ ...riskAnalysis, analyzing: false });
        return;
      }

      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: formData.recipientName,
          amount: amountNumber,
          method: formData.paymentMethod
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze transaction');
      }

      const data = await response.json();
      const { riskScore, riskLevel, riskFactors } = data.transaction.riskAnalysis;
      const blockchainTxHash = data.transaction.blockchainTxHash;

      let message = '';
      if (riskFactors && riskFactors.length > 0) {
        message = riskFactors.join(', ') + '.';
      } else {
        message = 'Transaction appears safe.';
      }

      const statusMap: { [key: string]: 'safe' | 'moderate' | 'high' } = {
        'Safe': 'safe',
        'Moderate': 'moderate',
        'High': 'high'
      };

      setRiskAnalysis({
        score: riskScore,
        status: statusMap[riskLevel] || 'moderate',
        message: message,
        analyzing: false,
        blockchainTxHash: blockchainTxHash
      });

      await fetchTransactions();

      setFormData({
        recipientName: '',
        amount: '',
        paymentMethod: 'credit-card'
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Failed to analyze transaction: ${errorMessage}`);
      setRiskAnalysis({ ...riskAnalysis, analyzing: false });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return 'text-emerald-400 bg-emerald-400/20';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'high':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'safe':
        return 'text-emerald-400';
      case 'moderate':
        return 'text-yellow-400';
      case 'high':
        return 'text-red-400';
      default:
        return 'text-slate-400';
    }
  };

  const getRiskProgressBarColors = (status: string) => {
    switch (status) {
      case 'safe':
        return 'from-emerald-500 to-cyan-500';
      case 'moderate':
        return 'from-yellow-500 to-orange-500';
      case 'high':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  const getSafetyScore = (riskScore: number) => {
    return Math.max(0, 100 - riskScore);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-8">
            <button 
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              Back to Home
            </button>
            <button 
              onClick={() => window.location.href = '/analysis'}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all font-semibold flex items-center gap-2"
            >
              View Full Analysis
            </button>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Experience Secure Payments in Action
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Run a demo transaction and watch VaultPay's AI analyze its safety in real time - now with blockchain verification!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-white text-xl font-semibold mb-2">Transaction Simulation</h2>
            <p className="text-slate-400 text-sm mb-6">Enter transaction details to analyze risk.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleInputChange}
                  placeholder="e.g., Jane Doe"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="$150.00"
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-sm font-medium mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                >
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              {error && (
                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button
                onClick={analyzeTransaction}
                disabled={riskAnalysis.analyzing}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {riskAnalysis.analyzing ? 'Analyzing & Logging to Blockchain...' : 'Analyze Transaction'}
              </button>

              {/* Blockchain Confirmation Badge */}
              {riskAnalysis.blockchainTxHash && (
                <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-lg animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-cyan-400 font-semibold text-sm">Blockchain Verified</span>
                  </div>
                  <p className="text-slate-300 text-xs mb-1">Transaction Hash:</p>
                  <p className="text-cyan-300 text-xs font-mono break-all bg-slate-900/50 p-2 rounded">
                    {riskAnalysis.blockchainTxHash}
                  </p>
                  <p className="text-slate-500 text-xs mt-2">Immutable record on blockchain</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-white text-xl font-semibold mb-2">Dashboard Preview</h2>
            <p className="text-slate-400 text-sm mb-6">Safety Score Overview</p>

            <div className="mb-4 flex justify-between items-center">
              <div className="text-4xl font-bold text-white">
                {getSafetyScore(riskAnalysis.score)}%
              </div>
              <div className={`text-sm font-medium ${getRiskLevelColor(riskAnalysis.status)}`}>
                {riskAnalysis.status.charAt(0).toUpperCase() + riskAnalysis.status.slice(1)} Risk
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg p-4 h-48 relative">
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-1 h-32">
                {chartData.map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-cyan-500/60 to-blue-500/60 rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-semibold">AI Analysis</h2>
              {riskAnalysis.analyzing && (
                <span className="text-cyan-400 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  Analyzing risk...
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Safety Score</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(riskAnalysis.status)}`}>
                  {getSafetyScore(riskAnalysis.score)}% {riskAnalysis.status.charAt(0).toUpperCase() + riskAnalysis.status.slice(1)}
                </span>
              </div>

              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getRiskProgressBarColors(riskAnalysis.status)} transition-all duration-1000 ease-out`}
                  style={{ width: `${getSafetyScore(riskAnalysis.score)}%` }}
                ></div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                {riskAnalysis.message}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
            <h2 className="text-white text-xl font-semibold mb-4">Security Details</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">AES-256 Encrypted</div>
                  <div className="text-slate-500 text-xs">Bank-grade encryption</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">AI Risk Scoring Enabled</div>
                  <div className="text-slate-500 text-xs">Advanced fraud detection</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg border border-cyan-500/20">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-white font-medium text-sm">Blockchain Verified</div>
                  <div className="text-slate-500 text-xs">Immutable transaction ledger</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-xl font-semibold">Recent Transactions</h2>
            <div className="flex gap-3">
              <button
                onClick={fetchTransactions}
                disabled={isLoadingTransactions}
                className="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                {isLoadingTransactions ? 'Refreshing...' : 'Refresh'}
              </button>
              <button
                onClick={() => window.location.href = '/transactions'}
                className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all"
              >
                View All Transactions
              </button>
            </div>
          </div>

          {isLoadingTransactions ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No transactions yet. Submit your first transaction above!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 font-medium text-sm py-3 px-4">Recipient</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-3 px-4">Amount</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-3 px-4">Method</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-3 px-4">Risk Level</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-3 px-4">Safety Score</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="text-white py-4 px-4">{transaction.recipient}</td>
                      <td className="text-white py-4 px-4">${transaction.amount.toFixed(2)}</td>
                      <td className="text-slate-400 py-4 px-4 capitalize">
                        {transaction.method.replace('-', ' ')}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`capitalize font-medium ${getRiskLevelColor(transaction.riskLevel)}`}>
                          {transaction.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={getRiskLevelColor(transaction.riskLevel)}>
                          {getSafetyScore(transaction.riskScore)}%
                        </span>
                      </td>
                      <td className="text-slate-400 py-4 px-4">
                        <div className="flex flex-col">
                          <span>{formatDate(transaction.createdAt)}</span>
                          <span className="text-xs text-slate-500">{formatTime(transaction.createdAt)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700">
          <h2 className="text-3xl font-bold text-white mb-4">
            Secure Your Transactions Today
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Sign up to get real-time analysis and protection for all your personal and business transactions.
          </p>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 hover:scale-105 transform transition-all duration-300">
            Sign Up to Track Your Own Transactions Securely
          </button>
        </div>
      </div>
    </div>
  );
}