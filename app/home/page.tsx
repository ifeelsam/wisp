'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Navigation } from '@/components/Navigation';

export default function HomePage() {
  const runOutItems = [
    { name: 'Oats', days: 3 },
    { name: 'Milk', days: 2 },
    { name: 'Bread', days: 5 },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Top Summary Card */}
        <div className="rounded-xl bg-[#EE7C2B] text-white mb-6 border-0 shadow-sm p-4">
          <div className="space-y-3">
            <div className="text-sm font-medium opacity-90">Pantry is stable</div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold">{runOutItems.length}</div>
                <div className="text-xs opacity-90">Running low</div>
              </div>
              <div>
                <div className="text-2xl font-bold">68%</div>
                <div className="text-xs opacity-90">Budget used</div>
              </div>
              <div>
                <div className="text-2xl font-bold">-30%</div>
                <div className="text-xs opacity-90">Less sugary</div>
              </div>
            </div>
          </div>
        </div>

        {/* Run-out Alerts */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Running low soon</h2>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {runOutItems.map((item) => (
              <Link key={item.name} href={`/inventory/${item.name.toLowerCase()}`}>
                <Card className="min-w-[140px] cursor-pointer hover:shadow-md transition-shadow">
                  <div className="text-center space-y-1">
                    <div className="text-2xl mb-1">📦</div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-500">~{item.days} days left</div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Draft Cart Preview */}
        <Card className="mb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-gray-900">Draft cart ready</div>
                <div className="text-sm text-gray-600">Amazon • 8 items • $45.20</div>
              </div>
              <Chip variant="health">-20% processed</Chip>
            </div>
            <div className="text-sm text-white bg-[#799B4B] bg-opacity-10 p-2 rounded">
              This cart reduces ultra-processed snacks by 20% vs last order
            </div>
            <Link href="/cart">
              <Button className="w-full">Review & approve</Button>
            </Link>
          </div>
        </Card>

        {/* Quick Health Insight */}
        <Card className="mb-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Health insight</h3>
              <Link href="/health" className="text-sm text-[#EE7C2B]">View all</Link>
            </div>
            <p className="text-sm text-gray-600">
              Your protein intake is 15% higher this week. Great progress!
            </p>
          </div>
        </Card>

        {/* Budget Snapshot */}
        <Card>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Budget this month</h3>
              <Link href="/budget" className="text-sm text-[#EE7C2B]">Details</Link>
            </div>
            <ProgressBar value={340} max={500} label="Spent" />
            <div className="text-sm text-gray-600">
              $160 remaining • On track
            </div>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}

