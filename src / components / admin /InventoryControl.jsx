import React, { useState } from 'react';
import { Package, Plus, Minus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

export default function InventoryControl({ stock, onAdjust, isLoading }) {
  const [adjustAmount, setAdjustAmount] = useState(1);
  const [isAdjusting, setIsAdjusting] = useState(false);

  const handleAdjust = async (change) => {
    setIsAdjusting(true);
    await onAdjust(change);
    setIsAdjusting(false);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Package className="w-5 h-5 text-purple-500" />
          מלאי
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <motion.div
            key={stock}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-purple-600 dark:text-purple-400"
          >
            {isLoading ? (
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-slate-400" />
            ) : (
              stock
            )}
          </motion.div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">יחידות במלאי</div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleAdjust(-adjustAmount)}
            disabled={isAdjusting || isLoading}
            className="w-14 h-14 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
          >
            {isAdjusting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Minus className="w-6 h-6" />
            )}
          </Button>
          
          <Input
            type="number"
            min="1"
            value={adjustAmount}
            onChange={(e) => setAdjustAmount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-20 text-center text-lg font-semibold"
          />
          
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleAdjust(adjustAmount)}
            disabled={isAdjusting || isLoading}
            className="w-14 h-14 rounded-xl text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          >
            {isAdjusting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Plus className="w-6 h-6" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
