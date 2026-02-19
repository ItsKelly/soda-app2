import React from 'react';
import { ShoppingCart, ArrowUpCircle, Settings, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const typeConfig = {
  purchase: {
    icon: ShoppingCart,
    label: 'קנייה',
    color: 'text-rose-500 bg-rose-500/10',
  },
  payment: {
    icon: ArrowUpCircle,
    label: 'תשלום',
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  adjustment: {
    icon: Settings,
    label: 'התאמה',
    color: 'text-amber-500 bg-amber-500/10',
  },
};

export default function RecentTransactions({ transactions, isLoading }) {
  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">פעילות אחרונה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 dark:bg-slate-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">פעילות אחרונה</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              אין פעילות עדיין
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx, index) => {
                const config = typeConfig[tx.type];
                const Icon = config.icon;
                const isPositive = tx.type === 'payment';
                
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className={`p-2.5 rounded-xl ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{config.label}</span>
                        {tx.status === 'pending' ? (
                          <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                            <Clock className="w-3 h-3 me-1" />
                            ממתין
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 me-1" />
                            אושר
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {format(new Date(tx.created_date), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                    <div className={`font-bold text-lg ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {isPositive ? '+' : '-'}₪{Math.abs(tx.amount).toFixed(2)}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
