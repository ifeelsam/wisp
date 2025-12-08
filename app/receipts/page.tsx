'use client';

import { useState, useRef, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Navigation } from '@/components/Navigation';
import { useApi } from '@/lib/api';

interface ReceiptItem {
  name: string;
  quantity?: string;
  price?: number;
  category?: string;
}

interface Receipt {
  id: string;
  imageUrl?: string;
  items: ReceiptItem[];
  total?: number;
  store?: string;
  date?: string | Date;
  processed: boolean;
  createdAt: string;
}

export default function ReceiptsPage() {
  const { ready, authenticated, login } = usePrivy();
  const { fetchWithAuth, user } = useApi();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!ready) return;

    if (!authenticated) {
      login();
      return;
    }

    if (!user) return;

    loadReceipts();
  }, [ready, authenticated, user, login]);

  const loadReceipts = async () => {
    try {
      const response = await fetchWithAuth('/api/receipts');
      if (response.ok) {
        const data = await response.json();
        setReceipts(data);
      }
    } catch (error) {
      console.error('Error loading receipts:', error);
    } finally {
      setLoading(false);
    }
  };

  const startCamera = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setScanning(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob(async (blob) => {
      if (blob) {
        await processReceipt(blob);
      }
    }, 'image/jpeg', 0.9);

    stopCamera();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    await processReceipt(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processReceipt = async (file: File | Blob) => {
    setProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await fetchWithAuth('/api/receipts/scan', {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });

      if (!response.ok) {
        throw new Error('Failed to process receipt');
      }

      const receipt = await response.json();
      setReceipts([receipt, ...receipts]);
      setSelectedReceipt(receipt);
    } catch (err) {
      console.error('Error processing receipt:', err);
      setError('Failed to process receipt. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddToInventory = async (receipt: Receipt) => {
    try {
      const response = await fetchWithAuth('/api/receipts/add-to-inventory', {
        method: 'POST',
        body: JSON.stringify({ receiptId: receipt.id }),
      });

      if (response.ok) {
        // Update receipt as processed
        setReceipts(receipts.map(r => 
          r.id === receipt.id ? { ...r, processed: true } : r
        ));
        setSelectedReceipt(null);
        // Optionally redirect to inventory
        window.location.href = '/inventory';
      }
    } catch (error) {
      console.error('Error adding to inventory:', error);
      setError('Failed to add items to inventory');
    }
  };

  const handleDeleteReceipt = async (id: string) => {
    if (!confirm('Are you sure you want to delete this receipt?')) return;

    try {
      const response = await fetchWithAuth(`/api/receipts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReceipts(receipts.filter(r => r.id !== id));
        if (selectedReceipt?.id === id) {
          setSelectedReceipt(null);
        }
      }
    } catch (error) {
      console.error('Error deleting receipt:', error);
    }
  };

  if (!ready || loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center pb-20">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Receipt Scanner</h1>

        {error && (
          <Card className="mb-4 bg-red-50 border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        {/* Camera View */}
        {scanning && (
          <Card className="mb-4">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="border-2 border-[#EE7C2B] rounded-lg w-4/5 h-64" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <Button variant="outline" onClick={stopCamera} className="flex-1">
                Cancel
              </Button>
              <Button onClick={capturePhoto} className="flex-1">
                Capture
              </Button>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        {!scanning && !processing && (
          <div className="flex gap-3 mb-6">
            <Button onClick={startCamera} className="flex-1">
              📷 Scan Receipt
            </Button>
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              📁 Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {processing && (
          <Card className="mb-4">
            <div className="text-center py-8">
              <div className="text-4xl mb-2">⏳</div>
              <p className="text-gray-600">Processing receipt...</p>
            </div>
          </Card>
        )}

        {/* Selected Receipt Details */}
        {selectedReceipt && (
          <Card className="mb-4 border-2 border-[#EE7C2B]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">Receipt Details</h2>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              {selectedReceipt.store && (
                <div>
                  <span className="text-sm text-gray-600">Store: </span>
                  <span className="font-medium">{selectedReceipt.store}</span>
                </div>
              )}
              
              {selectedReceipt.date && (
                <div>
                  <span className="text-sm text-gray-600">Date: </span>
                  <span className="font-medium">
                    {selectedReceipt.date instanceof Date 
                      ? selectedReceipt.date.toLocaleDateString()
                      : new Date(selectedReceipt.date).toLocaleDateString()}
                  </span>
                </div>
              )}

              {selectedReceipt.total && (
                <div>
                  <span className="text-sm text-gray-600">Total: </span>
                  <span className="font-medium">${selectedReceipt.total.toFixed(2)}</span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Items ({selectedReceipt.items.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        {item.quantity && (
                          <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                        )}
                      </div>
                      {item.price && (
                        <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {!selectedReceipt.processed && (
                <Button 
                  onClick={() => handleAddToInventory(selectedReceipt)}
                  className="w-full"
                >
                  Add to Inventory
                </Button>
              )}

              {selectedReceipt.processed && (
                <Chip variant="health" className="w-full justify-center">
                  ✓ Added to inventory
                </Chip>
              )}
            </div>
          </Card>
        )}

        {/* Receipts List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Recent Receipts</h2>
          {receipts.length === 0 ? (
            <Card>
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🧾</div>
                <p>No receipts yet. Scan your first receipt!</p>
              </div>
            </Card>
          ) : (
            receipts.map((receipt) => (
              <Card 
                key={receipt.id}
                onClick={() => setSelectedReceipt(receipt)}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">
                      {receipt.store || 'Receipt'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {receipt.items.length} items
                      {receipt.total && ` • $${receipt.total.toFixed(2)}`}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(receipt.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {receipt.processed && (
                      <Chip variant="health" className="text-xs">Processed</Chip>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteReceipt(receipt.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm px-2"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}

