'use client';

import React, { useState, useEffect } from 'react';

interface Transaction {
  id: string | number;
  recipient: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
}

export default function TransactionsPage() {
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    searchRecipient: '',
    riskLevel: 'all',
    method: 'all',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, allTransactions]);

  const fetchAllTransactions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setAllTransactions(data.transactions || []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allTransactions];

    if (filters.searchRecipient.trim()) {
      filtered = filtered.filter((txn) =>
        txn.recipient.toLowerCase().includes(filters.searchRecipient.toLowerCase())
      );
    }

    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter((txn) =>
        txn.riskLevel.toLowerCase() === filters.riskLevel.toLowerCase()
      );
    }

    if (filters.method !== 'all') {
      filtered = filtered.filter((txn) => txn.method === filters.method);
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom).getTime();
      filtered = filtered.filter((txn) => new Date(txn.createdAt).getTime() >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo).getTime();
      filtered = filtered.filter((txn) => new Date(txn.createdAt).getTime() <= toDate);
    }

    setFilteredTransactions(filtered);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const resetFilters = () => {
    setFilters({
      searchRecipient: '',
      riskLevel: 'all',
      method: 'all',
      dateFrom: '',
      dateTo: ''
    });
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

  const getRiskBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'safe':
        return 'bg-emerald-400/20 text-emerald-400 border-emerald-500/30';
      case 'moderate':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-500/30';
      case 'high':
        return 'bg-red-400/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-400/20 text-slate-400 border-slate-500/30';
    }
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
        <div className="mb-12">
          <button
            onClick={() => window.location.href = '/DemoPage'}
            className="mb-6 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
          >
            Back to Demo
          </button>
          <h1 className="text-4xl font-bold text-white mb-2">All Transactions</h1>
          <p className="text-slate-400">
            {filteredTransactions.length} of {allTransactions.length} transactions
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white text-lg font-semibold">Filters</h2>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Recipient Name
              </label>
              <input
                type="text"
                name="searchRecipient"
                value={filters.searchRecipient}
                onChange={handleFilterChange}
                placeholder="Search..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Risk Level
              </label>
              <select
                name="riskLevel"
                value={filters.riskLevel}
                onChange={handleFilterChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Risk Levels</option>
                <option value="safe">Safe</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                Payment Method
              </label>
              <select
                name="method"
                value={filters.method}
                onChange={handleFilterChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
              >
                <option value="all">All Methods</option>
                <option value="credit-card">Credit Card</option>
                <option value="debit-card">Debit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                From Date
              </label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">
                To Date
              </label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="w-full bg-slate-900/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-400">Loading transactions...</p>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400">No transactions found matching your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left text-slate-400 font-medium text-sm py-4 px-4">Recipient</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-4 px-4">Amount</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-4 px-4">Method</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-4 px-4">Risk Level</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-4 px-4">Risk Score</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-4 px-4">Risk Factors</th>
                    <th className="text-left text-slate-400 font-medium text-sm py-4 px-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                      <td className="text-white py-4 px-4 font-medium">{transaction.recipient}</td>
                      <td className="text-white py-4 px-4">${transaction.amount.toFixed(2)}</td>
                      <td className="text-slate-400 py-4 px-4 capitalize">
                        {transaction.method.replace('-', ' ')}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getRiskBadgeColor(transaction.riskLevel)}`}
                        >
                          {transaction.riskLevel}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${getRiskLevelColor(transaction.riskLevel)}`}>
                          {transaction.riskScore}%
                        </span>
                      </td>
                      <td className="text-slate-400 py-4 px-4 text-sm max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {transaction.riskFactors && transaction.riskFactors.length > 0 ? (
                            transaction.riskFactors.map((factor, idx) => (
                              <span key={idx} className="bg-slate-700/50 px-2 py-1 rounded text-xs whitespace-nowrap">
                                {factor}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500">No factors</span>
                          )}
                        </div>
                      </td>
                      <td className="text-slate-400 py-4 px-4">
                        <div className="flex flex-col text-sm">
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

        {!isLoading && filteredTransactions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total Transactions</p>
              <p className="text-2xl font-bold text-white">{filteredTransactions.length}</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Total Amount</p>
              <p className="text-2xl font-bold text-white">
                ${filteredTransactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2)}
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Average Risk Score</p>
              <p className="text-2xl font-bold text-white">
                {(
                  filteredTransactions.reduce((sum, txn) => sum + txn.riskScore, 0) /
                  filteredTransactions.length
                ).toFixed(1)}
                %
              </p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm mb-1">Safe Transactions</p>
              <p className="text-2xl font-bold text-emerald-400">
                {filteredTransactions.filter((t) => t.riskLevel.toLowerCase() === 'safe').length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}