'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Navigation } from '@/components/Navigation';
import { useApi } from '@/lib/api';

export default function HomePage() {
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [loading, setLoading] = useState(true);
  const [runOutItems, setRunOutItems] = useState<any[]>([]);
  const [budget, setBudget] = useState({ spent: 0, total: 500, remaining: 500 });
  const [hasReceipts, setHasReceipts] = useState(false);
  const [hasGroceries, setHasGroceries] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    if (!user) return;

    loadData();
  }, [ready, authenticated, user, login]);

  const loadData = async () => {
    try {
      // Load groceries to find items running low
      const groceriesRes = await fetchWithAuth('/api/groceries');
      if (groceriesRes.ok) {
        const groceries = await groceriesRes.json();
        setHasGroceries(groceries.length > 0);
        const lowItems = groceries.filter((item: any) => 
          item.status === 'low' || (item.daysLeft && item.daysLeft <= 5)
        ).slice(0, 5);
        setRunOutItems(lowItems);
      }

      // Check if user has receipts
      const receiptsRes = await fetchWithAuth('/api/receipts');
      if (receiptsRes.ok) {
        const receipts = await receiptsRes.json();
        setHasReceipts(receipts.length > 0);
      }

      // TODO: Load budget from API when available
      // For now, calculate from receipts
      if (receiptsRes.ok) {
        const receipts = await receiptsRes.json();
        const totalSpent = receipts.reduce((sum: number, r: any) => sum + (r.total || 0), 0);
        setBudget({ spent: totalSpent, total: 500, remaining: 500 - totalSpent });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center pb-20">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  // Show prompt to scan receipts if no data
  if (!hasReceipts && !hasGroceries) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🧾</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Get started by scanning a receipt</h2>
            <p className="text-gray-600 mb-6">
              Scan your grocery receipts to automatically track your pantry inventory
            </p>
            <Link href="/receipts">
              <Button size="lg">Scan Receipt</Button>
            </Link>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  const statusMessage = runOutItems.length > 0 
    ? `${runOutItems.length} items running low` 
    : hasGroceries 
    ? 'Pantry is stable' 
    : 'No items tracked yet';

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Top Summary Card */}
        <Card className="bg-[#EE7C2B] text-white mb-6 border-0">
          <div className="space-y-3">
            <div className="text-sm font-medium opacity-90">{statusMessage}</div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">{runOutItems.length}</div>
                <div className="text-xs opacity-90">Running low</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{Math.round((budget.spent / budget.total) * 100)}%</div>
                <div className="text-xs opacity-90">Budget used</div>
              </div>
              <div>
                <div className="text-2xl font-bold">—</div>
                <div className="text-xs opacity-90">Health score</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Run-out Alerts */}
        {runOutItems.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Running low soon</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {runOutItems.map((item) => (
                <Link key={item.id} href={`/inventory/${item.id}`}>
                  <Card className="min-w-[140px] cursor-pointer hover:shadow-md transition-shadow">
                    <div className="text-center space-y-1">
                      <div className="text-2xl mb-1">📦</div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">
                        {item.daysLeft ? `~${item.daysLeft} days left` : 'Running low'}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : hasGroceries ? (
          <Card className="mb-6">
            <div className="text-center py-4 text-gray-600">
              <p>All items are well stocked! 🎉</p>
            </div>
          </Card>
        ) : (
          <Card className="mb-6">
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📦</div>
              <p className="text-gray-600 mb-4">No items in your pantry yet</p>
              <Link href="/receipts">
                <Button variant="outline">Scan a receipt to get started</Button>
              </Link>
            </div>
          </Card>
        )}

        {/* Draft Cart Preview - TODO: Fetch from API */}
        {/* Removed hardcoded cart for now */}

        {/* Quick Health Insight - TODO: Fetch from API */}
        {/* Removed hardcoded insight for now */}

        {/* Budget Snapshot */}
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Budget this month</h3>
              <Link href="/budget" className="text-sm text-[#EE7C2B]">Details</Link>
            </div>
            <ProgressBar value={budget.spent} max={budget.total} label="Spent" />
            <div className="text-sm text-gray-600">
              ${budget.remaining.toFixed(2)} remaining • {budget.spent < budget.total * 0.8 ? 'On track' : 'Getting tight'}
            </div>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
