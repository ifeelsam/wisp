'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';
import { useApi } from '@/lib/api';

export default function ProfilePage() {
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    if (!user) return;

    loadProfile();
  }, [ready, authenticated, user, login]);

  const loadProfile = async () => {
    try {
      // TODO: Implement household members API
      // For now, show current user as the only member
      setMembers([{
        id: user?.id || '1',
        name: user?.email?.address?.split('@')[0] || 'You',
        color: '#EE7C2B',
        diet: [],
        items: [],
      }]);
    } catch (error) {
      console.error('Error loading profile:', error);
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

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/settings" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to settings</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile & Household</h1>

        {/* Members List */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Household members</h2>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    {member.email && (
                      <div className="text-sm text-gray-500">{member.email}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">+ Add member</Button>
          </div>
        </Card>

        {/* Per-member Preferences */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Member preferences</h2>
          <div className="space-y-4">
            {members.map((member) => (
              <div key={member.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-3">{member.name}</div>
                <div className="space-y-2">
                  <div>
                    <label className="text-sm text-gray-600">Dietary labels</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['Veg', 'Vegan', 'Lactose-free', 'Gluten-free'].map((label) => (
                        <Chip
                          key={label}
                          variant={member.diet?.includes(label) ? 'selected' : 'default'}
                          className="text-xs"
                        >
                          {label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Roles */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Roles & permissions</h2>
          <div className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">{member.name}</div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Can approve carts</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Can change budgets</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>Can modify health rules</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}
