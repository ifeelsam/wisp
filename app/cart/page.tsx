'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Navigation } from '@/components/Navigation';

const cartItems = [
  { name: 'Rolled Oats', quantity: 2, price: 4.99, reason: 'Running out', healthNote: null },
  { name: 'Whole Milk', quantity: 2, price: 3.49, reason: 'Running out', healthNote: null },
  { name: 'Greek Yogurt', quantity: 1, price: 5.99, reason: 'Healthier swap', healthNote: '-25% sugar vs usual brand' },
  { name: 'Bananas', quantity: 6, price: 2.99, reason: 'Pinned staple', healthNote: null },
];

export default function CartPage() {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const monthlyBudget = 500;
  const spent = 340;
  const remaining = monthlyBudget - spent;
  const budgetAfterCart = spent + total;

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cart Builder</h1>

        {/* Cart Summary Header */}
        <Card className="mb-4 bg-[#EE7C2B] text-white border-0">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm opacity-90">Amazon Sandbox</div>
                <div className="text-2xl font-bold">{cartItems.length} items</div>
              </div>
              <Chip variant="default" className="bg-white text-[#EE7C2B]">${total.toFixed(2)}</Chip>
            </div>
            <div className="pt-2 border-t border-white border-opacity-20">
              <ProgressBar 
                value={budgetAfterCart} 
                max={monthlyBudget} 
                label={`Budget: ${Math.round((budgetAfterCart / monthlyBudget) * 100)}%`}
                showValue={false}
                className="text-white"
              />
              <div className="text-sm mt-1 opacity-90">
                This cart keeps you at {Math.round((budgetAfterCart / monthlyBudget) * 100)}% of monthly budget
              </div>
            </div>
          </div>
        </Card>

        {/* Health Impact Banner */}
        <Card className="mb-4 bg-orange-50 border-[#799B4B]">
          <div className="flex items-start gap-2">
            <span className="text-2xl">💚</span>
            <div>
              <div className="font-semibold text-gray-900 mb-1">Health impact</div>
              <div className="text-sm text-gray-700">
                If you approve, next week's snacks will be 30% lower in added sugar vs your last order.
              </div>
            </div>
          </div>
        </Card>

        {/* Item List */}
        <div className="space-y-3 mb-6">
          {cartItems.map((item, idx) => (
            <Card key={idx}>
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity} × ${item.price.toFixed(2)} = ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">×</button>
                </div>
                <div className="flex items-center gap-2">
                  <Chip variant="default" className="text-xs">
                    {item.reason}
                  </Chip>
                  {item.healthNote && (
                    <Chip variant="health" className="text-xs">
                      {item.healthNote}
                    </Chip>
                  )}
                </div>
                {item.reason === 'Healthier swap' && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <div className="font-medium mb-1">Alternative comparison</div>
                    <div className="flex justify-between text-gray-600">
                      <span>Current choice</span>
                      <span className="text-[#799B4B]">Suggested swap</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Brand A: $5.99</span>
                      <span className="text-[#799B4B]">Brand B: $5.99</span>
                    </div>
                    <button className="text-[#EE7C2B] text-xs mt-1">Accept swap →</button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="space-y-3">
          <Button className="w-full" size="lg">Approve order</Button>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">Save draft</Button>
            <Button variant="ghost" className="flex-1">Discard</Button>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

