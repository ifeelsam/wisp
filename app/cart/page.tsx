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

export default function CartPage() {
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [budget, setBudget] = useState({ spent: 0, total: 500 });

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    if (!user) return;

    loadCart();
  }, [ready, authenticated, user, login]);

  const loadCart = async () => {
    try {
      // TODO: Implement cart API endpoint
      // For now, show empty state
      // const response = await fetchWithAuth('/api/cart');
      // if (response.ok) {
      //   const data = await response.json();
      //   setCartItems(data.items || []);
      // }

      // Load budget
      const receiptsRes = await fetchWithAuth('/api/receipts');
      if (receiptsRes.ok) {
        const receipts = await receiptsRes.json();
        const totalSpent = receipts.reduce((sum: number, r: any) => sum + (r.total || 0), 0);
        setBudget({ spent: totalSpent, total: 500 });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
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

  const total = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
  const budgetAfterCart = budget.spent + total;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart Builder</h1>
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No cart items yet</h2>
            <p className="text-gray-600 mb-6">
              Your agent will build carts based on your pantry inventory and preferences
            </p>
            <Link href="/receipts">
              <Button variant="outline">Scan receipts to build inventory</Button>
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart Builder</h1>

        {/* Cart Summary Header */}
        <Card className="mb-4 bg-[#EE7C2B] text-white border-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Draft Cart</div>
                <div className="text-2xl font-bold">{cartItems.length} items</div>
              </div>
              <Chip variant="default" className="bg-white text-[#EE7C2B]">${total.toFixed(2)}</Chip>
            </div>
            <div className="pt-2 border-t border-white border-opacity-20">
              <ProgressBar 
                value={budgetAfterCart} 
                max={budget.total} 
                label={`Budget: ${Math.round((budgetAfterCart / budget.total) * 100)}%`}
                showValue={false}
                className="text-white"
              />
              <div className="text-sm mt-1 opacity-90">
                This cart keeps you at {Math.round((budgetAfterCart / budget.total) * 100)}% of monthly budget
              </div>
            </div>
          </div>
        </Card>

        {/* Item List */}
        <div className="space-y-3 mb-6">
          {cartItems.map((item, idx) => (
            <Card key={idx}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity || 1} × ${item.price?.toFixed(2) || '0.00'} = ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                {item.reason && (
                  <Chip variant="default" className="text-xs">
                    {item.reason}
                  </Chip>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="space-y-3">
          <Button className="w-full" size="lg">Approve order</Button>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">Save draft</Button>
            <Button variant="ghost" className="flex-1">Discard</Button>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
