import React, { useState, useEffect } from 'react';
import { Tag, Plus, Minus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function PriceControl({ currentPrice, onSave }) {
  const [price, setPrice] = useState(currentPrice);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setPrice(currentPrice);
  }, [currentPrice]);

  const handleChange = async (newPrice) => {
    if (newPrice <= 0) return;
    setIsSaving(true);
    await onSave(newPrice);
    setIsSaving(false);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Tag className="w-5 h-5 text-amber-500" />
          מחיר יחידה
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleChange(parseFloat((price - 0.5).toFixed(2)))}
            disabled={isSaving || price <= 0.5}
            className="w-14 h-14 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Minus className="w-6 h-6" />}
          </Button>

          <Input
            type="number"
            min="0.5"
            step="0.5"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            onBlur={() => { if (price > 0) handleChange(price); }}
            className="w-20 text-center text-lg font-semibold"
          />

          <Button
            size="lg"
            variant="outline"
            onClick={() => handleChange(parseFloat((price + 0.5).toFixed(2)))}
            disabled={isSaving}
            className="w-14 h-14 rounded-xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
