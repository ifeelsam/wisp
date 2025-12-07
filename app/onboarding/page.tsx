'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { useApi } from '@/lib/api';

export default function OnboardingPage() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth } = useApi();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1);
  const [household, setHousehold] = useState({ type: '', members: 1, names: [] });
  const [goals, setGoals] = useState<string[]>([]);
  const [diet, setDiet] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [budget, setBudget] = useState({ monthly: '', weekly: '', categories: {} });
  const [dataSources, setDataSources] = useState({ receipts: false, email: false, amazon: false, walmart: false });
  const [storageMode, setStorageMode] = useState('local');

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    // Check if onboarding is already completed
    const checkOnboarding = async () => {
      try {
        const response = await fetchWithAuth('/api/onboarding');
        if (response.ok) {
          const data = await response.json();
          if (data.completed) {
            router.push('/home');
            return;
          }
          // Load existing data if any
          if (data.householdType) {
            setHousehold(prev => ({
              ...prev,
              type: data.householdType || '',
              members: data.householdMembers || 1,
            }));
          }
          if (data.goals) setGoals(data.goals);
          if (data.diet) setDiet(data.diet);
          if (data.ingredients) setIngredients(data.ingredients);
          if (data.monthlyBudget) setBudget(prev => ({ ...prev, monthly: data.monthlyBudget }));
          if (data.weeklyBudget) setBudget(prev => ({ ...prev, weekly: data.weeklyBudget }));
          if (data.dataSources) setDataSources(data.dataSources);
          if (data.storageMode) setStorageMode(data.storageMode);
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [ready, authenticated, router, login, fetchWithAuth]);

  const toggleGoal = (goal: string) => {
    setGoals(prev => prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]);
  };

  const toggleIngredient = (ing: string) => {
    setIngredients(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]);
  };

  const handleNext = async () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      // Save onboarding data
      setSaving(true);
      try {
        const response = await fetchWithAuth('/api/onboarding', {
          method: 'POST',
          body: JSON.stringify({
            householdType: household.type,
            householdMembers: household.members,
            goals,
            diet,
            ingredients,
            monthlyBudget: budget.monthly,
            weeklyBudget: budget.weekly,
            dataSources,
            storageMode,
            completed: true,
          }),
        });

        if (response.ok) {
          router.push('/home');
        } else {
          console.error('Failed to save onboarding data');
        }
      } catch (error) {
        console.error('Error saving onboarding:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Privy will handle the login modal
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step} of 7</span>
            <span>{Math.round((step / 7) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#EE7C2B] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold text-gray-900">Your private grocery copilot.</h1>
            <p className="text-lg text-gray-600">Automated pantry, healthier carts, under your control.</p>
            <div className="pt-8">
              <Button onClick={handleNext} size="lg" className="w-full">
                Set up my pantry
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Household Setup */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tell us about your household</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Household type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Single', 'Couple', 'Family', 'Custom'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setHousehold({ ...household, type: type.toLowerCase() })}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        household.type === type.toLowerCase()
                          ? 'border-[#EE7C2B] bg-[#EE7C2B] bg-opacity-5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <Input
                label="Number of members"
                type="number"
                min="1"
                value={household.members.toString()}
                onChange={(e) => setHousehold({ ...household, members: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">What are your goals?</h2>
            <p className="text-gray-600">Select all that apply</p>
            <div className="space-y-3">
              {[
                'Never run out of essentials',
                'Eat healthier at home',
                'Control grocery spending',
              ].map((goal) => (
                <Card
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={goals.includes(goal) ? 'border-[#EE7C2B] bg-[#EE7C2B] bg-opacity-5' : ''}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{goal}</span>
                    {goals.includes(goal) && <span className="text-[#EE7C2B]">✓</span>}
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {/* Step 4: Diet & Ingredients */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Diet & preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dietary pattern</label>
                <div className="flex flex-wrap gap-2">
                  {['Veg', 'Vegan', 'Lactose-free', 'Gluten-free', 'Keto-ish', 'No preference'].map((pattern) => (
                    <button
                      key={pattern}
                      onClick={() => setDiet(pattern)}
                      className={`px-4 py-2 rounded-full border-2 transition-colors ${
                        diet === pattern
                          ? 'border-[#EE7C2B] bg-[#EE7C2B] bg-opacity-10 text-[#EE7C2B]'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {pattern}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ingredient preferences</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Avoid added sugar',
                    'Minimize seed oils',
                    'Avoid artificial sweeteners',
                    'Prefer low-sodium',
                  ].map((ing) => (
                    <Chip
                      key={ing}
                      variant={ingredients.includes(ing) ? 'health' : 'default'}
                      onClick={() => toggleIngredient(ing)}
                    >
                      {ing}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {/* Step 5: Budget */}
        {step === 5 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Set your budget</h2>
            <div className="space-y-4">
              <Input
                label="Monthly budget"
                type="number"
                placeholder="e.g., 500"
                value={budget.monthly}
                onChange={(e) => setBudget({ ...budget, monthly: e.target.value })}
              />
              <Input
                label="Weekly soft limit (optional)"
                type="number"
                placeholder="e.g., 125"
                value={budget.weekly}
                onChange={(e) => setBudget({ ...budget, weekly: e.target.value })}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {/* Step 6: Data Sources */}
        {step === 6 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Connect data sources</h2>
            <p className="text-gray-600">Choose how you want to track your pantry</p>
            <div className="space-y-4">
              <Toggle
                label="Receipt scanning"
                checked={dataSources.receipts}
                onChange={(checked) => setDataSources({ ...dataSources, receipts: checked })}
                description="Scan receipts with your camera. Data stays on your device."
              />
              <Toggle
                label="Email/receipt parsing"
                checked={dataSources.email}
                onChange={(checked) => setDataSources({ ...dataSources, email: checked })}
                description="Forward receipts to a special address. Only receipts are read."
              />
              <Toggle
                label="Amazon sandbox integration"
                checked={dataSources.amazon}
                onChange={(checked) => setDataSources({ ...dataSources, amazon: checked })}
                description="Read orders and build carts. Sandbox mode only."
              />
              <Toggle
                label="Walmart sandbox integration"
                checked={dataSources.walmart}
                onChange={(checked) => setDataSources({ ...dataSources, walmart: checked })}
                description="Read orders and build carts. Sandbox mode only."
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1">Back</Button>
              <Button onClick={handleNext} className="flex-1">Next</Button>
            </div>
          </div>
        )}

        {/* Step 7: Storage & Privacy */}
        {step === 7 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Storage & privacy</h2>
            <div className="space-y-4">
              <Card
                onClick={() => setStorageMode('local')}
                className={storageMode === 'local' ? 'border-[#EE7C2B] bg-[#EE7C2B] bg-opacity-5' : ''}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Local only (recommended)</h3>
                    {storageMode === 'local' && <span className="text-[#EE7C2B]">✓</span>}
                  </div>
                  <p className="text-sm text-gray-600">All data stays on your device. Encrypted at rest.</p>
                </div>
              </Card>
              <Card
                onClick={() => setStorageMode('cloud')}
                className={storageMode === 'cloud' ? 'border-[#EE7C2B] bg-[#EE7C2B] bg-opacity-5' : ''}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Local + my cloud</h3>
                    {storageMode === 'cloud' && <span className="text-[#EE7C2B]">✓</span>}
                  </div>
                  <p className="text-sm text-gray-600">Encrypted client-side before sync to your personal cloud.</p>
                </div>
              </Card>
            </div>
            <div className="pt-4">
              <Button variant="outline" onClick={() => router.push('/settings/privacy')} className="w-full text-sm">
                View full data & privacy settings
              </Button>
            </div>
            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleBack} className="flex-1" disabled={saving}>Back</Button>
              <Button onClick={handleNext} className="flex-1" disabled={saving}>
                {saving ? 'Saving...' : 'Complete setup'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

