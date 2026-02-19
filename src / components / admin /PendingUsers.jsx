import React from 'react';
import { UserCheck, UserX, Loader2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

export default function PendingUsers({ users, onApprove, onDeny, isLoading }) {
  const [loadingId, setLoadingId] = React.useState(null);

  const handleApprove = async (user) => {
    setLoadingId(user.id + '_approve');
    await onApprove(user);
    setLoadingId(null);
  };

  const handleDeny = async (user) => {
    setLoadingId(user.id + '_deny');
    await onDeny(user);
    setLoadingId(null);
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            משתמשים ממתינים
          </CardTitle>
          {users.length > 0 && (
            <Badge className="bg-amber-500 text-white">{users.length}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            אין משתמשים ממתינים לאישור
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {users.map((user) => (
                <motion.div
                  key={user.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                >
                  <div>
                    <div className="font-medium">{user.full_name || 'ללא שם'}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">{user.email}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeny(user)}
                      disabled={loadingId !== null}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    >
                      {loadingId === user.id + '_deny' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserX className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(user)}
                      disabled={loadingId !== null}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loadingId === user.id + '_approve' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserCheck className="w-4 h-4" />
                      )}
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
