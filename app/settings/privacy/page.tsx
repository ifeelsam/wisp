'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Navigation } from '@/components/Navigation';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <Link href="/settings" className="text-[#EE7C2B] text-sm mb-4 inline-block">← Back to settings</Link>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Data & Privacy</h1>

        {/* Storage Mode */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Storage mode</h2>
          <div className="space-y-3">
            <div className="p-3 bg-[#799B4B] bg-opacity-10 rounded-lg border border-[#799B4B]">
              <div className="font-medium text-gray-900 mb-1">Local only (current)</div>
              <div className="text-sm text-gray-600">All data stays on your device. Encrypted at rest.</div>
            </div>
            <Button variant="outline" className="w-full">Change storage mode</Button>
          </div>
        </Card>

        {/* Permissions */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Permissions</h2>
          <div className="space-y-4">
            <Toggle
              label="Camera / Receipts"
              checked={true}
              onChange={() => {}}
              description="Scan receipts with camera. Images processed locally."
            />
            <Toggle
              label="Email parsing"
              checked={false}
              onChange={() => {}}
              description="Parse receipts from forwarded emails. Only receipt data is read."
            />
            <Toggle
              label="Retailer integrations"
              checked={true}
              onChange={() => {}}
              description="Amazon and Walmart sandbox APIs. Orders and catalog only."
            />
            <Toggle
              label="Smart devices"
              checked={false}
              onChange={() => {}}
              description="Future integrations with smart scales, etc."
            />
          </div>
        </Card>

        {/* Data Actions */}
        <Card className="mb-4">
          <h2 className="font-semibold text-gray-900 mb-4">Data actions</h2>
          <div className="space-y-3">
            <Button variant="outline" className="w-full">Export all data (JSON/CSV)</Button>
            <Button variant="outline" className="w-full text-red-600 border-red-300 hover:bg-red-50">
              Delete all data
            </Button>
            <p className="text-xs text-gray-500">
              Deletion includes all logs, inventory, health data, and preferences. This cannot be undone.
            </p>
          </div>
        </Card>

        {/* Security Status */}
        <Card>
          <h2 className="font-semibold text-gray-900 mb-4">Security status</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">At-rest encryption</span>
              <span className="text-[#799B4B] font-medium">ON</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last local backup</span>
              <span className="text-gray-900">2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last cloud sync</span>
              <span className="text-gray-500">Not enabled</span>
            </div>
          </div>
        </Card>
      </div>
      <Navigation />
    </div>
  );
}



