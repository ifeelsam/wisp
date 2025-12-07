'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';

const members = [
  { id: 1, name: 'You', color: '#EE7C2B', diet: ['No preference'], items: ['Oats', 'Milk'] },
  { id: 2, name: 'Partner', color: '#799B4B', diet: ['Veg'], items: ['Yogurt', 'Bread'] },
];

export default function ProfilePage() {
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
                    {member.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{member.name}</div>
                    <div className="flex gap-1 mt-1">
                      {member.diet.map((d) => (
                        <Chip key={d} variant="default" className="text-xs">{d}</Chip>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Mostly consumes: {member.items.join(', ')}
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
                          variant={member.diet.includes(label) ? 'selected' : 'default'}
                          className="text-xs"
                        >
                          {label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Mostly consumes</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {['Oats', 'Milk', 'Yogurt', 'Bread', 'Bananas'].map((item) => (
                        <Chip
                          key={item}
                          variant={member.items.includes(item) ? 'health' : 'default'}
                          className="text-xs"
                        >
                          {item}
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
                    <input type="checkbox" className="rounded" defaultChecked={member.id === 1} />
                    <span>Can approve carts</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" defaultChecked={member.id === 1} />
                    <span>Can change budgets</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" defaultChecked={member.id === 1} />
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


