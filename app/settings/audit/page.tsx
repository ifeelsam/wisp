'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Navigation } from '@/components/Navigation';
import { useApi } from '@/lib/api';

const actionTypes = ['All', 'Inventory', 'Model', 'Cart', 'Order', 'Substitution'];

export default function AuditPage() {
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [logEntries, setLogEntries] = useState<any[]>([]);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    if (!user) return;

    loadLogs();
  }, [ready, authenticated, user, login]);

  const loadLogs = async () => {
    try {
      // TODO: Implement audit log API endpoint
      // For now, show empty state
      // const response = await fetchWithAuth('/api/audit-logs');
      // if (response.ok) {
      //   const data = await response.json();
      //   setLogEntries(data);
      // }
    } catch (error) {
      console.error('Error loading logs:', error);
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

  if (logEntries.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] pb-20">
        <div className="max-w-md mx-auto px-4 py-6">
          <Link href="/settings" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to settings</Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Audit Log</h1>
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No activity yet</h2>
            <p className="text-gray-600 mb-6">
              Your agent's actions will appear here as you use the app
            </p>
            <Link href="/receipts">
              <Button variant="outline">Start by scanning a receipt</Button>
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
                  {expandedId === entry.id && entry.details && (
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
