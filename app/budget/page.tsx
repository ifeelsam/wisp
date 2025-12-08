'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Input } from '@/components/ui/Input';
import { Navigation } from '@/components/Navigation';

const categories = [
  { name: 'Staples', spent: 120, cap: 150, color: '#799B4B' },
  { name: 'Snacks', spent: 45, cap: 60, color: '#EE7C2B' },
  { name: 'Drinks', spent: 30, cap: 40, color: '#EE7C2B' },
  { name: 'Cleaning', spent: 25, cap: 30, color: '#799B4B' },
  { name: 'Other', spent: 120, cap: 220, color: '#799B4B' },
];

export default function BudgetPage() {
  const monthlyBudget = 500;
  const spent = 340;
  const remaining = monthlyBudget - spent;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Budget & Spending</h1>

        {/* Overall Budget */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly budget</h2>
          <ProgressBar value={spent} max={monthlyBudget} label="Month-to-date" />
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-gray-600">Spent: <span className="font-semibold text-gray-900">${spent}</span></span>
            <span className="text-[#799B4B]">Remaining: <span className="font-semibold">${remaining}</span></span>
          </div>
        </Card>

        {/* Category Breakdown */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Category breakdown</h2>
          <div className="space-y-4">
            {categories.map((cat) => {
              const percentage = (cat.spent / cat.cap) * 100;
              const isOver = cat.spent > cat.cap;
              const isNear = percentage >= 80 && !isOver;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    <span className={`text-sm font-semibold ${
                      isOver ? 'text-red-600' : isNear ? 'text-[#EE7C2B]' : 'text-[#799B4B]'
                    }`}>
                      ${cat.spent} / ${cat.cap}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOver ? 'bg-red-500' : isNear ? 'bg-[#EE7C2B]' : 'bg-[#799B4B]'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Trend */}
        <Card className="mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">Spending trend</h2>
          <div className="h-32 flex items-end justify-between gap-2">
            {[280, 320, 310, 340].map((amount, idx) => {
              const height = (amount / 400) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-[#EE7C2B] rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-1">M{idx + 1}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Controls */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Adjust budget</h2>
          <div className="space-y-4">
            <Input
              label="Monthly budget"
              type="number"
              defaultValue={monthlyBudget.toString()}
            />
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Category caps</label>
              {categories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{cat.name}</span>
                  <Input
                    type="number"
                    defaultValue={cat.cap.toString()}
                    className="w-24"
                  />
                </div>
              ))}
            </div>
            <div className="pt-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm text-gray-700">
                  When budget is tight, suggest cheaper alternatives automatically
                </span>
              </label>
            </div>
            <Button className="w-full">Save changes</Button>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}



