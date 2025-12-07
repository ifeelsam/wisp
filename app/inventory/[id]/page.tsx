'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Badge } from '@/components/ui/Badge';
import { Toggle } from '@/components/ui/Toggle';
import { Navigation } from '@/components/Navigation';

export default function ItemDetailPage({ params }: { params: { id: string } }) {
  const item = {
    name: 'Rolled Oats',
    brand: 'Quaker',
    category: 'Staples',
    owner: 'Mostly you',
    quantity: '1.2 kg',
    servings: 6,
    daysLeft: 3,
    consumptionRate: 0.4,
    nutrition: {
      calories: 150,
      protein: 5,
      carbs: 27,
      fat: 3,
    },
    flags: [
      'No added sugar',
      'Whole grain',
    ],
    concerns: [],
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/inventory" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to pantry</Link>
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{item.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{item.brand}</span>
            <span>•</span>
            <span>{item.category}</span>
          </div>
          <Chip variant="default" className="mt-2">{item.owner}</Chip>
        </div>

        {/* Inventory & Forecast */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Inventory & Forecast</h2>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Current quantity</div>
              <div className="text-lg font-semibold">{item.quantity} ({item.servings} servings)</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Run-out estimate</div>
              <div className="text-lg font-semibold text-[#EE7C2B]">Likely to run out in {item.daysLeft}-5 days</div>
            </div>
            <div className="pt-2 border-t">
              <div className="text-sm text-gray-600 mb-2">Daily consumption rate</div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={item.consumptionRate}
                className="w-full"
              />
              <div className="text-xs text-gray-500 mt-1">Adjust if you use this faster or slower</div>
            </div>
          </div>
        </Card>

        {/* Nutrition Overview */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Nutrition (per serving)</h2>
          <div className="grid grid-cols-4 gap-2 mb-3">
            <div className="text-center">
              <div className="text-lg font-semibold">{item.nutrition.calories}</div>
              <div className="text-xs text-gray-600">Cal</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{item.nutrition.protein}g</div>
              <div className="text-xs text-gray-600">Protein</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{item.nutrition.carbs}g</div>
              <div className="text-xs text-gray-600">Carbs</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold">{item.nutrition.fat}g</div>
              <div className="text-xs text-gray-600">Fat</div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="success">High fiber</Badge>
            <Badge variant="success">Whole grain</Badge>
          </div>
        </Card>

        {/* Hidden Ingredients */}
        {item.concerns.length > 0 && (
          <Card className="mb-4">
            <h2 className="font-semibold text-gray-900 mb-3">Ingredient flags</h2>
            <div className="space-y-2">
              {item.concerns.map((concern, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span className="text-[#EE7C2B]">⚠️</span>
                  <span>{concern}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Healthier Alternatives */}
        <Card className="mb-4">
          <Button variant="outline" className="w-full">
            See cleaner alternatives
          </Button>
        </Card>

        {/* Actions */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-3">Actions</h2>
          <div className="space-y-3">
            <Toggle
              label="Pin as staple"
              checked={false}
              onChange={() => {}}
              description="Always keep this item stocked"
            />
            <Toggle
              label="Exclude from health metrics"
              checked={false}
              onChange={() => {}}
              description="For occasional treats"
            />
            <div className="pt-2">
              <div className="text-sm font-medium text-gray-700 mb-2">Track primarily for</div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option>All members</option>
                <option>You</option>
                <option>Partner</option>
              </select>
            </div>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}


