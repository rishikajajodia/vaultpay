import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/generated/prisma';
import { logTransactionToBlockchain } from '@/lib/blockchain';

// Singleton pattern for Prisma to prevent connection exhaustion
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

interface TransactionPayload {
  recipient: string;
  amount: number;
  method: string;
}

interface RiskAnalysis {
  riskScore: number;
  riskLevel: 'Safe' | 'Moderate' | 'High';
  riskFactors: string[];
  riskScoreNormalized: number;
}

// Enhanced risk calculation with dynamic learning
async function calculateRiskScore(payload: TransactionPayload): Promise<RiskAnalysis> {
  const riskFactors: string[] = [];
  let riskScore = 0;

  // Fetch user's transaction history for pattern analysis
  const userTransactions = await prisma.transaction.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  // Calculate user's actual patterns from history
  let averageAmount = 500;
  let maxAmount = 2000;
  const knownRecipients = new Set<string>();
  const methodCounts: { [key: string]: number } = {};

  if (userTransactions.length > 0) {
    const totalAmount = userTransactions.reduce((sum, txn) => sum + txn.amount, 0);
    averageAmount = totalAmount / userTransactions.length;
    maxAmount = Math.max(...userTransactions.map(txn => txn.amount));

    userTransactions.forEach(txn => {
      knownRecipients.add(txn.recipient.toLowerCase().trim());
      methodCounts[txn.method] = (methodCounts[txn.method] || 0) + 1;
    });
  }

  // 1. RECIPIENT ANALYSIS
  const recipientNormalized = payload.recipient.toLowerCase().trim();
  const isKnownRecipient = knownRecipients.has(recipientNormalized);
  
  if (!isKnownRecipient) {
    riskScore += 20;
    riskFactors.push('New recipient detected');
  } else {
    riskScore -= 5;
    riskFactors.push('Trusted recipient');
  }

  // 2. AMOUNT ANALYSIS
  const amountRatio = averageAmount > 0 ? payload.amount / averageAmount : 1;
  
  if (payload.amount > maxAmount * 1.5) {
    riskScore += 35;
    riskFactors.push(`Unusually large amount (${(amountRatio * 100).toFixed(0)}% above your maximum)`);
  } else if (payload.amount > averageAmount * 3) {
    riskScore += 25;
    riskFactors.push('Amount significantly above average');
  } else if (payload.amount > averageAmount * 1.5) {
    riskScore += 15;
    riskFactors.push('Amount above typical range');
  } else if (payload.amount < 5) {
    riskScore += 10;
    riskFactors.push('Unusually small amount (potential testing)');
  } else if (payload.amount >= averageAmount * 0.8 && payload.amount <= averageAmount * 1.2) {
    riskScore -= 5;
    riskFactors.push('Amount within normal range');
  }

  // 3. PAYMENT METHOD ANALYSIS
  const mostUsedMethod = Object.keys(methodCounts).sort((a, b) => 
    methodCounts[b] - methodCounts[a]
  )[0];
  
  if (methodCounts[payload.method] === undefined || methodCounts[payload.method] === 0) {
    riskScore += 20;
    riskFactors.push('New payment method');
  } else if (payload.method === mostUsedMethod) {
    riskScore -= 5;
    riskFactors.push('Preferred payment method');
  }

  if (payload.method === 'crypto' || payload.method === 'wire-transfer') {
    riskScore += 15;
    riskFactors.push('High-risk payment method');
  }

  // 4. TIME-BASED ANALYSIS
  const currentHour = new Date().getHours();
  if (currentHour >= 23 || currentHour < 5) {
    riskScore += 25;
    riskFactors.push('Late-night transaction (11PM-5AM)');
  } else if (currentHour >= 6 && currentHour <= 22) {
    riskScore -= 3;
  }

  // 5. VELOCITY CHECK
  const recentSimilarTransactions = userTransactions.filter(txn => {
    const txnTime = new Date(txn.createdAt).getTime();
    const now = Date.now();
    const hoursDiff = (now - txnTime) / (1000 * 60 * 60);
    return hoursDiff < 1 && txn.recipient.toLowerCase() === recipientNormalized;
  });

  if (recentSimilarTransactions.length >= 3) {
    riskScore += 30;
    riskFactors.push('Multiple rapid transactions to same recipient');
  } else if (recentSimilarTransactions.length >= 1) {
    riskScore += 15;
    riskFactors.push('Repeated transaction within 1 hour');
  }

  // 6. ROUND NUMBER ANALYSIS
  if (payload.amount % 100 === 0 && payload.amount >= 1000) {
    riskScore += 10;
    riskFactors.push('Large round number amount');
  }

  // 7. TRANSACTION FREQUENCY
  const last24Hours = userTransactions.filter(txn => {
    const txnTime = new Date(txn.createdAt).getTime();
    const now = Date.now();
    const hoursDiff = (now - txnTime) / (1000 * 60 * 60);
    return hoursDiff < 24;
  });

  if (last24Hours.length > 10) {
    riskScore += 20;
    riskFactors.push('High transaction volume today');
  } else if (last24Hours.length > 5) {
    riskScore += 10;
    riskFactors.push('Above normal daily transaction count');
  }

  // 8. PATTERN CONSISTENCY
  if (userTransactions.length >= 5) {
    const hasConsistentPattern = userTransactions.slice(0, 5).every(txn => {
      const timeDiff = Math.abs(new Date(txn.createdAt).getHours() - currentHour);
      return timeDiff < 3;
    });

    if (!hasConsistentPattern && (currentHour < 6 || currentHour > 22)) {
      riskScore += 15;
      riskFactors.push('Unusual time compared to your pattern');
    }
  }

  // 9. FIRST TRANSACTION
  if (userTransactions.length === 0) {
    riskScore += 10;
    riskFactors.push('First transaction on account');
  }

  const randomVariation = (Math.random() - 0.5) * 10;
  riskScore += randomVariation;

  // Normalize and cap
  riskScore = Math.max(0, Math.min(100, riskScore));

  // Determine risk level
  let riskLevel: 'Safe' | 'Moderate' | 'High';
  if (riskScore < 30) {
    riskLevel = 'Safe';
  } else if (riskScore < 60) {
    riskLevel = 'Moderate';
  } else {
    riskLevel = 'High';
  }

  if (riskFactors.length === 0 || riskFactors.every(f => 
    f.includes('within') || f.includes('Trusted') || f.includes('Preferred')
  )) {
    riskFactors.push('Transaction follows normal patterns');
  }

  return {
    riskScore: Math.round(riskScore),
    riskLevel,
    riskFactors: riskFactors.slice(0, 5),
    riskScoreNormalized: parseFloat((riskScore / 100).toFixed(2))
  };
}

// POST handler - Analyze, save to DB, and log to blockchain
export async function POST(request: NextRequest) {
  try {
    const body: TransactionPayload = await request.json();

    if (!body.recipient || body.amount === undefined || !body.method) {
      return NextResponse.json(
        { status: 'error', message: 'Missing required fields: recipient, amount, method' },
        { status: 400 }
      );
    }

    if (typeof body.recipient !== 'string' || typeof body.amount !== 'number' || typeof body.method !== 'string') {
      return NextResponse.json(
        { status: 'error', message: 'Invalid field types' },
        { status: 400 }
      );
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { status: 'error', message: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    if (body.recipient.trim().length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Recipient name cannot be empty' },
        { status: 400 }
      );
    }

    console.log('📊 Analyzing Transaction:', {
      recipient: body.recipient,
      amount: body.amount,
      method: body.method,
      timestamp: new Date().toISOString()
    });

    const riskAnalysis = await calculateRiskScore(body);
    console.log('✅ Enhanced Risk Analysis:', riskAnalysis);

    const transaction = await prisma.transaction.create({
      data: {
        recipient: body.recipient.trim(),
        amount: body.amount,
        method: body.method,
        status: 'analyzed',
        riskScore: riskAnalysis.riskScore,
        riskLevel: riskAnalysis.riskLevel,
        riskFactors: riskAnalysis.riskFactors.join(', ')
      }
    });

    console.log('💾 Transaction saved:', transaction.id);

    // ⛓️ LOG TO BLOCKCHAIN
    let blockchainTxHash: string | undefined;
    const blockchainResult = await logTransactionToBlockchain(
      body.recipient,
      body.amount,
      body.method
    );

    if (blockchainResult.success) {
      blockchainTxHash = blockchainResult.txHash;
      console.log('⛓️ Transaction logged to blockchain:', blockchainTxHash);
    } else {
      console.warn('⚠️ Blockchain logging failed (transaction still saved to DB):', blockchainResult.error);
    }

    return NextResponse.json(
      {
        status: 'received',
        message: 'Transaction analyzed and saved successfully',
        transaction: {
          id: transaction.id,
          recipient: transaction.recipient,
          amount: transaction.amount,
          method: transaction.method,
          status: transaction.status,
          timestamp: transaction.createdAt.toISOString(),
          blockchainTxHash: blockchainTxHash, // ← NEW: Include blockchain hash
          riskAnalysis: {
            riskScore: transaction.riskScore,
            riskLevel: transaction.riskLevel,
            riskFactors: transaction.riskFactors.split(', '),
            riskScoreNormalized: transaction.riskScore / 100
          }
        }
      },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Transaction API Error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to process transaction',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET handler
export async function GET(request: NextRequest) {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const formattedTransactions = transactions.map((txn) => ({
      id: txn.id,
      recipient: txn.recipient,
      amount: txn.amount,
      method: txn.method,
      status: txn.status,
      riskScore: txn.riskScore,
      riskLevel: txn.riskLevel,
      riskFactors: txn.riskFactors.split(', '),
      createdAt: txn.createdAt.toISOString()
    }));

    console.log(`📋 Fetched ${formattedTransactions.length} transactions`);

    return NextResponse.json(
      { status: 'success', transactions: formattedTransactions },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('❌ Failed to fetch transactions:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch transactions',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}