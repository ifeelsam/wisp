'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';
import { useApi } from '@/lib/api';

interface GroceryItem {
  id: string;
  name: string;
  quantity: string | null;
  daysLeft: number | null;
  status: string;
  health: string;
  category: string | null;
}

export default function InventoryPage() {
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', quantity: '', daysLeft: '', category: '' });

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    // Wait for user to be available
    if (!user) return;

    loadGroceries();
  }, [ready, authenticated, user, login]);

  const loadGroceries = async () => {
    try {
      const response = await fetchWithAuth('/api/groceries');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error loading groceries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;

    try {
      const response = await fetchWithAuth('/api/groceries', {
        method: 'POST',
        body: JSON.stringify({
          name: newItem.name,
          quantity: newItem.quantity || null,
          daysLeft: newItem.daysLeft ? parseInt(newItem.daysLeft) : null,
          category: newItem.category || null,
        }),
      });

      if (response.ok) {
        const item = await response.json();
        setItems([item, ...items]);
        setNewItem({ name: '', quantity: '', daysLeft: '', category: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding grocery:', error);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetchWithAuth(`/api/groceries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting grocery:', error);
    }
  };

  const categories = ['Staples', 'Produce', 'Snacks', 'Drinks', 'Cleaning', 'Other'];
  const statuses = ['OK', 'Running low', 'Out'];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === 'OK' && item.status === 'ok') ||
      (statusFilter === 'Running low' && item.status === 'low') ||
      (statusFilter === 'Out' && item.status === 'out');
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

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
          {filteredItems.length === 0 ? (
            <Card>
              <div className="text-center py-8 text-gray-500">
                <p>No items found. Add your first grocery item!</p>
              </div>
            </Card>
          ) : (
            filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <Link href={`/inventory/${item.id}`}>
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
                        {item.quantity && `${item.quantity} • `}
                        {item.daysLeft !== null && `~${item.daysLeft} days left`}
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Chip variant={getStatusColor(item.status) as any} className="text-xs">
                        {item.status === 'low' ? 'Low' : item.status === 'out' ? 'Out' : 'OK'}
                      </Chip>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDeleteItem(item.id);
                        }}
                        className="text-red-500 hover:text-red-700 text-sm px-2"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </Link>
              </Card>
            ))
          )}
        </div>

        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md p-6">
              <h2 className="text-xl font-bold mb-4">Add Grocery Item</h2>
              <div className="space-y-4">
                <Input
                  label="Item name"
                  placeholder="e.g., Rolled Oats"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                />
                <Input
                  label="Quantity (optional)"
                  placeholder="e.g., 1.2 kg"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                />
                <Input
                  label="Days left (optional)"
                  type="number"
                  placeholder="e.g., 5"
                  value={newItem.daysLeft}
                  onChange={(e) => setNewItem({ ...newItem, daysLeft: e.target.value })}
                />
                <Input
                  label="Category (optional)"
                  placeholder="e.g., Staples"
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleAddItem} className="flex-1">
                    Add
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="fixed bottom-24 right-4">
          <Button 
            className="rounded-full w-14 h-14 shadow-lg"
            onClick={() => setShowAddForm(true)}
          >
            <span className="text-2xl">+</span>
          </Button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

