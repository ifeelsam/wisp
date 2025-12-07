'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Navigation } from '@/components/Navigation';

const logEntries = [
  {
    id: 1,
    timestamp: '2 hours ago',
    type: 'cart',
    description: 'Created draft cart on Amazon: 8 items, $45.20',
    details: 'Items: Oats, Milk, Yogurt, Bananas, Bread, Eggs, Cheese, Apples',
  },
  {
    id: 2,
    timestamp: '1 day ago',
    type: 'model',
    description: 'Adjusted oats consumption estimate based on last 3 weeks',
    details: 'Changed from 0.3kg/day to 0.4kg/day',
  },
  {
    id: 3,
    timestamp: '2 days ago',
    type: 'substitution',
    description: 'Suggested swap: Brand A cereal → Brand B cereal',
    details: '-40% sugar, +$2.00 price difference',
  },
  {
    id: 4,
    timestamp: '3 days ago',
    type: 'inventory',
    description: 'Updated inventory: Added 2L milk from receipt scan',
    details: 'Receipt from Whole Foods, scanned via camera',
  },
  {
    id: 5,
    timestamp: '5 days ago',
    type: 'order',
    description: 'Approved and placed order on Amazon',
    details: '6 items, $38.50, delivered next day',
  },
];

const actionTypes = ['All', 'Inventory', 'Model', 'Cart', 'Order', 'Substitution'];

export default function AuditPage() {
  const [selectedType, setSelectedType] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredEntries = selectedType === 'All'
    ? logEntries
    : logEntries.filter(entry => entry.type === selectedType.toLowerCase());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cart': return '🛒';
      case 'model': return '📊';
      case 'substitution': return '🔄';
      case 'inventory': return '📦';
      case 'order': return '✓';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/settings" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to settings</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Log</h1>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {actionTypes.map((type) => (
            <Chip
              key={type}
              variant={selectedType === type ? 'selected' : 'default'}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </Chip>
          ))}
        </div>

        {/* Log Entries */}
        <div className="space-y-3 mb-6">
          {filteredEntries.map((entry) => (
            <Card
              key={entry.id}
              onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
              className="cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">{getTypeIcon(entry.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm font-medium text-gray-900">{entry.description}</div>
                    <span className="text-xs text-gray-500">{entry.timestamp}</span>
                  </div>
                  {expandedId === entry.id && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      {entry.details}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="space-y-2">
          <Button variant="outline" className="w-full">Export log</Button>
          <Button variant="ghost" className="w-full text-red-600">Clear log</Button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}


