'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Badge } from '@/components/ui/Badge';
import { Navigation } from '@/components/Navigation';

export default function HealthPage() {
  const [timeRange, setTimeRange] = useState('30');

  const timeRanges = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '90', label: '90 days' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Health & Nutrition</h1>

        {/* Top Summary */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#799B4B]">78</div>
              <div className="text-xs text-gray-600 mt-1">Health Score</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#EE7C2B]">22%</div>
              <div className="text-xs text-gray-600 mt-1">Ultra-processed</div>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#799B4B]">✓</div>
              <div className="text-xs text-gray-600 mt-1">Protein OK</div>
            </div>
          </Card>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 mb-6">
          {timeRanges.map((range) => (
            <Chip
              key={range.value}
              variant={timeRange === range.value ? 'selected' : 'default'}
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </Chip>
          ))}
        </div>

        {/* Trends */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Trends</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Ultra-processed %</span>
                <span className="text-sm font-semibold">22%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#EE7C2B] h-2 rounded-full" style={{ width: '22%' }} />
              </div>
              <div className="text-xs text-[#799B4B] mt-1">↓ 5% from last month</div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Avg daily protein</span>
                <span className="text-sm font-semibold">85g</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-[#799B4B] h-2 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Hidden Ingredients Dashboard */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Hidden ingredients</h2>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-700">12</div>
              <div className="text-xs text-gray-600">Added sugar</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-700">3</div>
              <div className="text-xs text-gray-600">Artificial sweeteners</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xl font-bold text-orange-700">8</div>
              <div className="text-xs text-gray-600">High sodium</div>
            </div>
          </div>
          <button className="text-sm text-[#EE7C2B]">View top offenders →</button>
        </Card>

        {/* Recommendations */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Recommendations</h2>
          <div className="space-y-3">
            <div className="p-3 bg-[#799B4B] bg-opacity-10 rounded-lg border border-[#799B4B]">
              <div className="font-medium text-gray-900 mb-1">Swap Brand A cereal → Brand B</div>
              <div className="text-sm text-gray-600 mb-2">-35% sugar, +10% protein</div>
              <div className="text-xs text-gray-500">Price: +$2.50</div>
            </div>
            <div className="p-3 bg-[#799B4B] bg-opacity-10 rounded-lg border border-[#799B4B]">
              <div className="font-medium text-gray-900 mb-1">Add high-protein staple</div>
              <div className="text-sm text-gray-600">Consider adding Greek yogurt to next cart</div>
            </div>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}


