'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, formatPrice, type CartItem as CartItemType } from '@/lib/store/cartStore';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Minus, Plus, Trash2, RefreshCw } from 'lucide-react';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    }
  };

  const blendUrl = item.metadata.blendSlug ? `/blends/${item.metadata.blendSlug}` : '#';
  const itemTotal = item.amount * item.quantity;

  return (
    <div className="flex gap-4 py-6 border-b border-gray-200">
      {/* Product Image */}
      {item.image && (
        <Link href={blendUrl} className="flex-shrink-0">
          <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={item.image}
              alt={item.productName}
              fill
              className="object-cover"
            />
          </div>
        </Link>
      )}

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={blendUrl} className="hover:text-accent-primary transition-colors">
            <h3 className="font-semibold text-lg text-gray-900">
              {item.productName}
            </h3>
          </Link>
          {item.metadata.variantLabel && (
            <p className="text-sm text-gray-600 mt-1">{item.metadata.variantLabel}</p>
          )}

          {/* Subscription Badge */}
          {item.productType === 'subscription' ? (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-xs font-semibold">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Subscription - Renews Monthly</span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mt-2">One-time purchase</p>
          )}
        </div>

        {/* Mobile Price */}
        <div className="flex items-center justify-between mt-2 md:hidden">
          <p className="text-lg font-bold text-gray-900">{formatPrice(itemTotal)}</p>
        </div>
      </div>

      {/* Quantity Controls */}
      <div className="flex flex-col items-end justify-between">
        {item.productType === 'subscription' ? (
          /* Subscription - Fixed quantity */
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-2">
            <span className="text-sm font-semibold text-gray-700">Qty: 1</span>
            <span className="text-xs text-gray-500">(Subscription)</span>
          </div>
        ) : (
          /* One-time - Adjustable quantity */
          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="p-2 hover:bg-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-semibold">Qty: {item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-2 hover:bg-white rounded-md transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Desktop Price and Remove */}
        <div className="hidden md:flex flex-col items-end gap-2">
          <p className="text-lg font-bold text-gray-900">{formatPrice(itemTotal)}</p>
          <button
            onClick={() => setShowRemoveConfirm(true)}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>

        {/* Mobile Remove */}
        <button
          onClick={() => setShowRemoveConfirm(true)}
          className="md:hidden text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors mt-2"
          aria-label="Remove item"
        >
          <Trash2 className="w-4 h-4" />
          Remove
        </button>
      </div>

      {/* Remove Item Confirmation Modal */}
      <ConfirmModal
        isOpen={showRemoveConfirm}
        onClose={() => setShowRemoveConfirm(false)}
        onConfirm={() => removeItem(item.id)}
        title="Remove Item?"
        message={`Are you sure you want to remove "${item.productName}" from your cart?`}
        confirmText="Remove"
        cancelText="Keep it"
        variant="danger"
      />
    </div>
  );
}
