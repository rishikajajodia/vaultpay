'use client';
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface Metrics {
  totalTransactions: number;
  averageRiskScore: number;
  safeCount: number;
  moderateCount: number;
  highCount: number;
  totalAmount: number;
}

interface RiskPattern {
  type: string;
  count: number;
  description: string;
  icon: string;
}

export default function AnalysisPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalTransactions: 0,
    averageRiskScore: 0,
    safeCount: 0,
    moderateCount: 0,
    highCount: 0,
    totalAmount: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [riskPatterns, setRiskPatterns] = useState<RiskPattern[]>([]);

  useEffect(() => {
    fetchTransactionData();
  }, []);

  const fetchTransactionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/transactions');
      if (!response.ok) throw new Error('Failed to fetch transactions');
      
      const data = await response.json();
      const txns = data.transactions || [];
      setTransactions(txns);
      
      calculateMetrics(txns);
      analyzeRiskPatterns(txns);
      setLastUpdated(new Date().toLocaleString());
    } catch (error) {
      console.error('Error fetching transaction data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (txns: Transaction[]) => {
    if (txns.length === 0) {
      setMetrics({
        totalTransactions: 0,
        averageRiskScore: 0,
        safeCount: 0,
        moderateCount: 0,
        highCount: 0,
        totalAmount: 0
      });
      return;
    }

    const totalRisk = txns.reduce((sum, t) => sum + t.riskScore, 0);
    const totalAmount = txns.reduce((sum, t) => sum + t.amount, 0);
    
    setMetrics({
      totalTransactions: txns.length,
      averageRiskScore: Math.round(totalRisk / txns.length),
      safeCount: txns.filter(t => t.riskLevel.toLowerCase() === 'safe').length,
      moderateCount: txns.filter(t => t.riskLevel.toLowerCase() === 'moderate').length,
      highCount: txns.filter(t => t.riskLevel.toLowerCase() === 'high').length,
      totalAmount: totalAmount
    });
  };

  const analyzeRiskPatterns = (txns: Transaction[]) => {
    const patterns: RiskPattern[] = [];

    const lateNight = txns.filter(t => {
      const hour = new Date(t.createdAt).getHours();
      return hour >= 23 || hour < 5;
    }).length;

    const newRecipients = txns.filter(t => 
      t.riskFactors.some(f => f.toLowerCase().includes('new recipient'))
    ).length;

    const largeAmounts = txns.filter(t => 
      t.riskFactors.some(f => f.toLowerCase().includes('large') || f.toLowerCase().includes('above'))
    ).length;

    const rapidTransactions = txns.filter(t => 
      t.riskFactors.some(f => f.toLowerCase().includes('rapid') || f.toLowerCase().includes('repeated'))
    ).length;

    if (lateNight > 0) {
      patterns.push({
        type: 'Late Night Activity',
        count: lateNight,
        description: `${lateNight} transaction${lateNight > 1 ? 's' : ''} occurred between 11PM-5AM`,
        icon: '🌙'
      });
    }

    if (newRecipients > 0) {
      patterns.push({
        type: 'New Recipients',
        count: newRecipients,
        description: `${newRecipients} transaction${newRecipients > 1 ? 's' : ''} to unfamiliar recipients`,
        icon: '👤'
      });
    }

    if (largeAmounts > 0) {
      patterns.push({
        type: 'Large Amounts',
        count: largeAmounts,
        description: `${largeAmounts} transaction${largeAmounts > 1 ? 's' : ''} with unusually high amounts`,
        icon: '💰'
      });
    }

    if (rapidTransactions > 0) {
      patterns.push({
        type: 'Rapid Transactions',
        count: rapidTransactions,
        description: `${rapidTransactions} instance${rapidTransactions > 1 ? 's' : ''} of repeated transactions`,
        icon: '⚡'
      });
    }

    setRiskPatterns(patterns);
  };

  const getRiskTrendData = () => {
    if (transactions.length === 0) return [];
    
    const sorted = [...transactions].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return sorted.map((t, idx) => ({
      name: `#${idx + 1}`,
      riskScore: t.riskScore,
      date: new Date(t.createdAt).toLocaleDateString()
    }));
  };

  const getRiskDistributionData = () => {
    return [
      { name: 'Safe', value: metrics.safeCount, color: '#10b981' },
      { name: 'Moderate', value: metrics.moderateCount, color: '#f59e0b' },
      { name: 'High', value: metrics.highCount, color: '#ef4444' }
    ].filter(item => item.value > 0);
  };

  const getPaymentMethodData = () => {
    const methodCounts: { [key: string]: number } = {};
    transactions.forEach(t => {
      const method = t.method.replace('-', ' ').split(' ').map(w => 
        w.charAt(0).toUpperCase() + w.slice(1)
      ).join(' ');
      methodCounts[method] = (methodCounts[method] || 0) + 1;
    });

    return Object.entries(methodCounts).map(([method, count]) => ({
      method,
      count
    }));
  };

  const downloadReport = () => {
    let reportContent = `VaultPay Security Analysis Report\n`;
    reportContent += `Generated: ${lastUpdated}\n\n`;
    reportContent += `=== TRANSACTION SUMMARY ===\n`;
    reportContent += `Total Transactions: ${metrics.totalTransactions}\n`;
    reportContent += `Average Risk Score: ${metrics.averageRiskScore}%\n`;
    reportContent += `Total Amount: $${metrics.totalAmount.toFixed(2)}\n\n`;
    reportContent += `=== RISK DISTRIBUTION ===\n`;
    reportContent += `Safe: ${metrics.safeCount} (${((metrics.safeCount/metrics.totalTransactions)*100).toFixed(1)}%)\n`;
    reportContent += `Moderate: ${metrics.moderateCount} (${((metrics.moderateCount/metrics.totalTransactions)*100).toFixed(1)}%)\n`;
    reportContent += `High: ${metrics.highCount} (${((metrics.highCount/metrics.totalTransactions)*100).toFixed(1)}%)\n\n`;
    reportContent += `=== RISK PATTERNS DETECTED ===\n`;
    riskPatterns.forEach(pattern => {
      reportContent += `${pattern.icon} ${pattern.type}: ${pattern.description}\n`;
    });
    reportContent += `\n=== SECURITY RECOMMENDATIONS ===\n`;
    reportContent += `• Enable two-factor authentication for all transactions\n`;
    reportContent += `• Avoid large transfers during late-night hours (11PM-5AM)\n`;
    reportContent += `• Verify recipient details before sending to new contacts\n`;
    reportContent += `• Set up transaction alerts for amounts above your average\n`;
    reportContent += `• Review and update payment methods regularly\n`;
    reportContent += `• Use secure networks only - avoid public WiFi\n`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VaultPay-Analysis-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const securityTips = [
    {
      title: 'Enable Multi-Factor Authentication',
      description: 'Add an extra layer of security to protect your transactions',
      icon: '🔐'
    },
    {
      title: 'Avoid Late-Night Large Transfers',
      description: 'Schedule significant transactions during business hours',
      icon: '🌙'
    },
    {
      title: 'Verify New Recipients',
      description: 'Always confirm recipient details before first-time transfers',
      icon: '✅'
    },
    {
      title: 'Set Transaction Limits',
      description: 'Configure daily/monthly limits to prevent unauthorized large transfers',
      icon: '💳'
    },
    {
      title: 'Regular Security Audits',
      description: 'Review your transaction history weekly for suspicious activity',
      icon: '🔍'
    },
    {
      title: 'Use Secure Networks',
      description: 'Avoid public WiFi for financial transactions',
      icon: '📶'
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Security Analysis Dashboard</h1>
              <p className="text-slate-400">Comprehensive insights into your transaction security</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigateTo('/DemoPage')}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                ← Back to Demo
              </button>
              <button 
                onClick={() => navigateTo('/')}
                className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors font-medium"
              >
                🏠 Home
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={fetchTransactionData}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm font-medium"
            >
              🔄 Refresh Data
            </button>
            <button
              onClick={downloadReport}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              📥 Download Report
            </button>
            {lastUpdated && (
              <span className="text-slate-400 text-sm">Last updated: {lastUpdated}</span>
            )}
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-12 border border-slate-700 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-4">No Transaction Data Yet</h2>
            <p className="text-slate-400 mb-6">Start by creating some transactions in the demo to see analytics here.</p>
            <button 
              onClick={() => navigateTo('/DemoPage')}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold"
            >
              Go to Demo Page
            </button>
          </div>
        ) : (
          <>
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Total Transactions</span>
                  <span className="text-2xl">📊</span>
                </div>
                <div className="text-3xl font-bold text-white">{metrics.totalTransactions}</div>
                <div className="text-xs text-slate-500 mt-1">All time</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Avg Risk Score</span>
                  <span className="text-2xl">⚠️</span>
                </div>
                <div className="text-3xl font-bold text-white">{metrics.averageRiskScore}%</div>
                <div className={`text-xs mt-1 ${metrics.averageRiskScore < 30 ? 'text-emerald-400' : metrics.averageRiskScore < 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {metrics.averageRiskScore < 30 ? 'Low Risk' : metrics.averageRiskScore < 60 ? 'Moderate Risk' : 'High Risk'}
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Safe Transactions</span>
                  <span className="text-2xl">✅</span>
                </div>
                <div className="text-3xl font-bold text-emerald-400">{metrics.safeCount}</div>
                <div className="text-xs text-slate-500 mt-1">
                  {metrics.totalTransactions > 0 ? ((metrics.safeCount / metrics.totalTransactions) * 100).toFixed(1) : 0}% of total
                </div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm font-medium">Total Amount</span>
                  <span className="text-2xl">💰</span>
                </div>
                <div className="text-3xl font-bold text-white">${metrics.totalAmount.toFixed(2)}</div>
                <div className="text-xs text-slate-500 mt-1">Processed</div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {/* Risk Trend Chart */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-white text-xl font-semibold mb-6">Risk Score Trend</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={getRiskTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Line type="monotone" dataKey="riskScore" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Distribution Pie Chart */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
                <h2 className="text-white text-xl font-semibold mb-6">Risk Distribution</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={getRiskDistributionData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {getRiskDistributionData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-slate-400 text-sm">Safe ({metrics.safeCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-slate-400 text-sm">Moderate ({metrics.moderateCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-slate-400 text-sm">High ({metrics.highCount})</span>
                  </div>
                </div>
              </div>

              {/* Payment Method Distribution */}
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 lg:col-span-2">
                <h2 className="text-white text-xl font-semibold mb-6">Transactions by Payment Method</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={getPaymentMethodData()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="method" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                      labelStyle={{ color: '#e2e8f0' }}
                    />
                    <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Risk Patterns Section */}
            {riskPatterns.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 mb-12">
                <h2 className="text-white text-xl font-semibold mb-6">🔍 Risk Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {riskPatterns.map((pattern, idx) => (
                    <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{pattern.icon}</span>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold mb-1">{pattern.type}</h3>
                          <p className="text-slate-400 text-sm">{pattern.description}</p>
                          <div className="mt-2">
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
                              {pattern.count} detected
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security Tips Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
              <h2 className="text-white text-xl font-semibold mb-6">🛡️ Security Tips & Best Practices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {securityTips.map((tip, idx) => (
                  <div key={idx} className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 transition-colors">
                    <div className="text-3xl mb-3">{tip.icon}</div>
                    <h3 className="text-white font-semibold mb-2">{tip.title}</h3>
                    <p className="text-slate-400 text-sm">{tip.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}