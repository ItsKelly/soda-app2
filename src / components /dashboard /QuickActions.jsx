import React, { useState } from 'react';
import { ShoppingCart, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export default function QuickActions({ bottlePrice, onPurchase, onAddFunds, isLoading }) {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    setIsSubmitting(true);
    await onAddFunds(parseFloat(amount), notes);
    setIsSubmitting(false);
    setAmount('');
    setNotes('');
    setIsAddFundsOpen(false);
  };

  const handleQuickBuy = async () => {
    await onPurchase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="grid grid-cols-2 gap-4"
    >
      <Button
        onClick={handleQuickBuy}
        disabled={isLoading}
        className="h-24 bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg shadow-emerald-500/25 dark:shadow-emerald-500/10 rounded-2xl flex flex-col gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? (
          <Loader2 className="w-8 h-8 animate-spin" />
        ) : (
          <>
            <ShoppingCart className="w-8 h-8" />
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg">קנייה מהירה</span>
              <span className="text-xs text-white/80">₪{bottlePrice}</span>
            </div>
          </>
        )}
      </Button>

      <Dialog open={isAddFundsOpen} onOpenChange={setIsAddFundsOpen}>
        <DialogTrigger asChild>
          <Button
            className="h-24 bg-gradient-to-br from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/10 rounded-2xl flex flex-col gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-8 h-8" />
            <span className="font-bold text-lg">טעינת יתרה</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl">טעינת יתרה</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">סכום (₪)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="הזן סכום"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">הערות (אופציונלי)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="הוסף הערה..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">ביטול</Button>
            </DialogClose>
            <Button
              onClick={handleAddFunds}
              disabled={!amount || parseFloat(amount) <= 0 || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin me-2" />
              ) : null}
              שלח בקשה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
