'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';

const items = [
  { id: 1, name: 'Rolled Oats', quantity: '1.2 kg', days: 3, status: 'low', health: 'clean' },
  { id: 2, name: 'Whole Milk', quantity: '2L', days: 2, status: 'low', health: 'clean' },
  { id: 3, name: 'Whole Wheat Bread', quantity: '1 loaf', days: 5, status: 'ok', health: 'clean' },
  { id: 4, name: 'Bananas', quantity: '6 pieces', days: 4, status: 'ok', health: 'clean' },
  { id: 5, name: 'Potato Chips', quantity: '1 bag', days: 7, status: 'ok', health: 'flagged' },
  { id: 6, name: 'Greek Yogurt', quantity: '500g', days: 6, status: 'ok', health: 'clean' },
];

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const categories = ['Staples', 'Produce', 'Snacks', 'Drinks', 'Cleaning', 'Other'];
  const statuses = ['OK', 'Running low', 'Out'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || true; // Simplified
    const matchesStatus = !statusFilter || 
      (statusFilter === 'OK' && item.status === 'ok') ||
      (statusFilter === 'Running low' && item.status === 'low') ||
      (statusFilter === 'Out' && item.status === 'out');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    if (status === 'low') return 'warning';
    if (status === 'out') return 'warning';
    return 'default';
  };

  const getHealthColor = (health: string) => {
    if (health === 'clean') return 'health';
    if (health === 'flagged') return 'warning';
    return 'default';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Pantry</h1>
          <Input
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4"
          />
          
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {categories.map((cat) => (
              <Chip
                key={cat}
                variant={categoryFilter === cat ? 'selected' : 'default'}
                onClick={() => setCategoryFilter(categoryFilter === cat ? null : cat)}
              >
                {cat}
              </Chip>
            ))}
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statuses.map((status) => (
              <Chip
                key={status}
                variant={statusFilter === status ? 'selected' : 'default'}
                onClick={() => setStatusFilter(statusFilter === status ? null : status)}
              >
                {status}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <Link key={item.id} href={`/inventory/${item.id}`}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${
                        item.health === 'clean' ? 'bg-[#799B4B]' :
                        item.health === 'flagged' ? 'bg-[#EE7C2B]' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} • ~{item.days} days left
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Chip variant={getStatusColor(item.status) as any} className="text-xs">
                      {item.status === 'low' ? 'Low' : item.status === 'out' ? 'Out' : 'OK'}
                    </Chip>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="fixed bottom-24 right-4">
          <Button className="rounded-full w-14 h-14 shadow-lg">
            <span className="text-2xl">+</span>
          </Button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

