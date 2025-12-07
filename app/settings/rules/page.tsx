'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Chip } from '@/components/ui/Chip';
import { Navigation } from '@/components/Navigation';

export default function RulesPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/settings" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to settings</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Rules</h1>

        {/* Approval Mode */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Approval mode</h2>
          <div className="space-y-3">
            {[
              { value: 'manual', label: 'Manual approval for all orders', desc: 'Review every cart before ordering' },
              { value: 'auto', label: 'Auto-approve trusted staples', desc: 'Auto-order frequently purchased items' },
              { value: 'mixed', label: 'Mixed (category-based)', desc: 'Different rules per category' },
            ].map((mode) => (
              <div
                key={mode.value}
                className="p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-[#EE7C2B] transition-colors"
              >
                <div className="font-medium text-gray-900">{mode.label}</div>
                <div className="text-sm text-gray-600 mt-0.5">{mode.desc}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Trusted Staples */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Trusted staples</h2>
          <div className="space-y-2">
            {['Rolled Oats', 'Whole Milk', 'Bananas', 'Greek Yogurt'].map((item) => (
              <label key={item} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked={item === 'Rolled Oats'} />
                <span className="text-sm text-gray-700">{item}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Health Rules */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Health rules</h2>
          <div className="space-y-4">
            <Toggle
              label="Prefer lower sugar versions"
              checked={true}
              onChange={() => {}}
              description="When alternatives are available"
            />
            <Toggle
              label="Prefer less processed alternatives"
              checked={true}
              onChange={() => {}}
              description="When price increase ≤ 10%"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Health optimization intensity
              </label>
              <div className="flex gap-2">
                {['Mild', 'Balanced', 'Strict'].map((level) => (
                  <Chip key={level} variant={level === 'Balanced' ? 'selected' : 'default'}>
                    {level}
                  </Chip>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Category Rules */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Category rules</h2>
          <div className="space-y-4">
            {['Staples', 'Snacks', 'Drinks'].map((category) => (
              <div key={category} className="p-3 border border-gray-200 rounded-lg">
                <div className="font-medium text-gray-900 mb-3">{category}</div>
                <div className="space-y-2">
                  <Toggle
                    label="Always ask before ordering"
                    checked={category === 'Snacks'}
                    onChange={() => {}}
                  />
                  <Toggle
                    label="Allow substitutions"
                    checked={true}
                    onChange={() => {}}
                  />
                  <div>
                    <label className="text-sm text-gray-600">Max price increase vs last purchase</label>
                    <input type="range" min="0" max="50" defaultValue="10" className="w-full mt-1" />
                    <div className="text-xs text-gray-500 mt-1">10%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button className="w-full">Save rules</Button>
      </div>
      <Navigation />
    </div>
  );
}

