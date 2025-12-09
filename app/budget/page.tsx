'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';
import { useApi } from '@/lib/api';

export default function BudgetPage() {
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState({ spent: 0, total: 500, remaining: 500 });
  const [categories, setCategories] = useState<any[]>([]);
  const [hasReceipts, setHasReceipts] = useState(false);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    if (!user) return;

    loadBudget();
  }, [ready, authenticated, user, login]);

  const loadBudget = async () => {
    try {
      // Load receipts to calculate spending
      const receiptsRes = await fetchWithAuth('/api/receipts');
      if (receiptsRes.ok) {
        const receipts = await receiptsRes.json();
        setHasReceipts(receipts.length > 0);
        
        // Calculate total spent from receipts
        const totalSpent = receipts.reduce((sum: number, r: any) => sum + (r.total || 0), 0);
        
        // Calculate category spending from receipt items
        const categorySpending: Record<string, number> = {};
        receipts.forEach((receipt: any) => {
          receipt.items?.forEach((item: any) => {
            const cat = item.category || 'Other';
            categorySpending[cat] = (categorySpending[cat] || 0) + (item.price || 0);
          });
        });

        // Build category breakdown
        const categoryList = [
          { name: 'Staples', cap: 150 },
          { name: 'Snacks', cap: 60 },
          { name: 'Drinks', cap: 40 },
          { name: 'Cleaning', cap: 30 },
          { name: 'Produce', cap: 100 },
          { name: 'Dairy', cap: 80 },
          { name: 'Other', cap: 40 },
        ].map(cat => ({
          ...cat,
          spent: categorySpending[cat.name] || 0,
          color: categorySpending[cat.name] > cat.cap ? '#EE7C2B' : '#799B4B',
        }));

        setCategories(categoryList);
        setBudget({ spent: totalSpent, total: 500, remaining: 500 - totalSpent });
      }
    } catch (error) {
      console.error('Error loading budget:', error);
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

  if (!hasReceipts) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Budget & Spending</h1>
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No spending data yet</h2>
            <p className="text-gray-600 mb-6">
              Scan receipts to track your grocery spending and budget
            </p>
            <Link href="/receipts">
              <Button>Scan Receipt</Button>
            </Link>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Budget & Spending</h1>

        {/* Overall Budget */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly budget</h2>
          <ProgressBar value={budget.spent} max={budget.total} label="Month-to-date" />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-600">Spent: <span className="font-semibold text-gray-900">${budget.spent.toFixed(2)}</span></span>
            <span className="text-[#799B4B]">Remaining: <span className="font-semibold">${budget.remaining.toFixed(2)}</span></span>
          </div>
        </Card>

        {/* Category Breakdown */}
        {categories.length > 0 && (
          <Card className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Category breakdown</h2>
            <div className="space-y-4">
              {categories.filter(cat => cat.spent > 0).map((cat) => {
                const percentage = (cat.spent / cat.cap) * 100;
                const isOver = cat.spent > cat.cap;
                const isNear = percentage >= 80 && !isOver;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      <span className={`text-sm font-semibold ${
                        isOver ? 'text-red-600' : isNear ? 'text-[#EE7C2B]' : 'text-[#799B4B]'
                      }`}>
                        ${cat.spent.toFixed(2)} / ${cat.cap}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isOver ? 'bg-red-500' : isNear ? 'bg-[#EE7C2B]' : 'bg-[#799B4B]'
                        }`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Controls */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Adjust budget</h2>
          <div className="space-y-4">
            <Input
              label="Monthly budget"
              type="number"
              defaultValue={budget.total.toString()}
            />
            <Button className="w-full">Save changes</Button>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
