import React from 'react';
import { CheckCircle, XCircle, Loader2, Banknote } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

export default function PendingDeposits({ deposits, onApprove, onDeny, isLoading }) {
  const [loadingId, setLoadingId] = React.useState(null);

  const handleApprove = async (deposit) => {
    setLoadingId(deposit.id + '_approve');
    await onApprove(deposit);
    setLoadingId(null);
  };

  const handleDeny = async (deposit) => {
    setLoadingId(deposit.id + '_deny');
    await onDeny(deposit);
    setLoadingId(null);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Banknote className="w-5 h-5 text-blue-500" />
            הפקדות ממתינות
          </CardTitle>
          {deposits.length > 0 && (
            <Badge className="bg-blue-500 text-white">{deposits.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : deposits.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            אין הפקדות ממתינות לאישור
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {deposits.map((deposit) => (
                <motion.div
                  key={deposit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-medium">{deposit.profile_name || 'ללא שם'}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {format(new Date(deposit.created_date), 'dd/MM/yyyy HH:mm')}
                      </div>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      ₪{deposit.amount.toFixed(2)}
                    </div>
                  </div>
                  {deposit.notes && (
                    <div className="text-sm text-slate-600 dark:text-slate-300 mb-3 p-2 bg-slate-100 dark:bg-slate-600/50 rounded-lg">
                      {deposit.notes}
                    </div>
                  )}
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeny(deposit)}
                      disabled={loadingId !== null}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      {loadingId === deposit.id + '_deny' ? (
                        <Loader2 className="w-4 h-4 animate-spin me-1" />
                      ) : (
                        <XCircle className="w-4 h-4 me-1" />
                      )}
                      דחה
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(deposit)}
                      disabled={loadingId !== null}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loadingId === deposit.id + '_approve' ? (
                        <Loader2 className="w-4 h-4 animate-spin me-1" />
                      ) : (
                        <CheckCircle className="w-4 h-4 me-1" />
                      )}
                      אשר
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
