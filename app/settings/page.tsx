'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Navigation } from '@/components/Navigation';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        <div className="space-y-4">
          <Link href="/settings/privacy">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Data & Privacy</div>
                  <div className="text-sm text-gray-600">Storage, permissions, encryption</div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Card>
          </Link>

          <Link href="/settings/rules">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Shopping Rules</div>
                  <div className="text-sm text-gray-600">Approval modes, preferences</div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Card>
          </Link>

          <Link href="/settings/integrations">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Integrations</div>
                  <div className="text-sm text-gray-600">Retailers, email, devices</div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Card>
          </Link>

          <Link href="/settings/profile">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Profile & Household</div>
                  <div className="text-sm text-gray-600">Members, preferences, roles</div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Card>
          </Link>

          <Link href="/settings/audit">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Audit Log</div>
                  <div className="text-sm text-gray-600">View agent actions and history</div>
                </div>
                <span className="text-gray-400">→</span>
              </div>
            </Card>
          </Link>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

