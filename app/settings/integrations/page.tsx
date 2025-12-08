'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Chip } from '@/components/ui/Chip';
import { Navigation } from '@/components/Navigation';

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/settings" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to settings</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Integrations</h1>

        {/* Retailers */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Retailers</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900">Amazon Sandbox</div>
                  <div className="text-sm text-gray-600">Read orders, build carts</div>
                </div>
                <Chip variant="health">Connected</Chip>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Last sync: 2 hours ago
              </div>
              <Button variant="outline" size="sm" className="w-full">Disconnect</Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold text-gray-900">Walmart Sandbox</div>
                  <div className="text-sm text-gray-600">Read orders, build carts</div>
                </div>
                <Chip variant="default">Not connected</Chip>
              </div>
              <div className="text-xs text-gray-500 mb-3">
                Sandbox mode only. Data stays on device.
              </div>
              <Button size="sm" className="w-full">Connect</Button>
            </div>
          </div>
        </Card>

        {/* Email / Receipts */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Email / Receipts</h2>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-900 mb-1">Forward address</div>
              <div className="text-xs text-gray-600 font-mono">receipts@wisp.local</div>
              <div className="text-xs text-gray-500 mt-1">
                Forward receipt emails to this address. Only receipt data is parsed.
              </div>
            </div>
            <Toggle
              label="Email parsing enabled"
              checked={false}
              onChange={() => {}}
              description="Parse receipts from forwarded emails"
            />
            <div className="text-xs text-gray-500">
              Last processed: Never
            </div>
          </div>
        </Card>

        {/* Smart Devices */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Smart devices</h2>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">Smart scale</div>
                  <div className="text-sm text-gray-600">Track weight changes</div>
                </div>
                <Toggle
                  label=""
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-medium text-gray-900">Smart fridge</div>
                  <div className="text-sm text-gray-600">Usage counts and expiration</div>
                </div>
                <Toggle
                  label=""
                  checked={false}
                  onChange={() => {}}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Smart device integrations are future-friendly. Data usage is limited to inventory tracking only.
            </p>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}



