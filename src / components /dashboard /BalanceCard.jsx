import React from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export default function BalanceCard({ balance, isLoading }) {
  const isPositive = balance >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-700 dark:via-purple-700 dark:to-pink-600 border-0 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-white/5 opacity-30" style={{backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")"}} />
        <CardContent className="p-8 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <span className="text-white/90 font-medium text-lg">יתרה נוכחית</span>
            </div>
            {isPositive ? (
              <TrendingUp className="w-5 h-5 text-emerald-300" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-300" />
            )}
          </div>
          
          <div className="text-center py-6">
            {isLoading ? (
              <div className="h-16 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className={`text-5xl md:text-6xl font-bold tracking-tight ${isPositive ? 'text-white' : 'text-red-200'}`}
              >
                ₪{Math.abs(balance).toFixed(2)}
                {!isPositive && <span className="text-2xl me-2">-</span>}
              </motion.div>
            )}
          </div>
          
          <div className="text-center text-white/70 text-sm">
            {isPositive ? 'זכות' : 'חובה'}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
