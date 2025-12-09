'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Navigation } from '@/components/Navigation';
import { useApi } from '@/lib/api';

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    if (!user) return;

    loadItem();
  }, [ready, authenticated, user, id, login]);

  const loadItem = async () => {
    try {
      const response = await fetchWithAuth(`/api/groceries/${id}`);
      if (response.ok) {
        const data = await response.json();
        setItem(data);
      }
    } catch (error) {
      console.error('Error loading item:', error);
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

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <Link href="/inventory" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to pantry</Link>
          <Card>
            <div className="text-center py-8 text-gray-500">
              <p>Item not found</p>
            </div>
          </Card>
        </div>
        <Navigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/inventory" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to pantry</Link>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{item.name}</h1>
          {item.category && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{item.category}</span>
            </div>
          )}
        </div>

        {/* Inventory & Forecast */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Inventory & Forecast</h2>
          <div className="space-y-3">
            {item.quantity && (
              <div>
                <div className="text-sm text-gray-600">Current quantity</div>
                <div className="text-lg font-semibold">{item.quantity}</div>
              </div>
            )}
            {item.daysLeft !== null && (
              <div>
                <div className="text-sm text-gray-600">Run-out estimate</div>
                <div className={`text-lg font-semibold ${item.daysLeft <= 3 ? 'text-[#EE7C2B]' : ''}`}>
                  Likely to run out in {item.daysLeft} days
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-600 mb-2">Status</div>
              <Chip variant={item.status === 'low' ? 'warning' : item.status === 'out' ? 'warning' : 'default'}>
                {item.status === 'low' ? 'Running Low' : item.status === 'out' ? 'Out of Stock' : 'In Stock'}
              </Chip>
            </div>
          </div>
        </Card>

        {/* Health Status */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Health Status</h2>
          <Chip variant={item.health === 'clean' ? 'health' : 'warning'}>
            {item.health === 'clean' ? 'Clean' : 'Flagged'}
          </Chip>
        </Card>

        {/* Actions */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">
              Edit Item
            </Button>
            <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
              Delete Item
            </Button>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
