import React from 'react';
import { Activity, ShoppingCart, ArrowUpCircle, Settings, UserCheck, Package, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

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
  user_approved: {
    icon: UserCheck,
    label: 'אישור משתמש',
    color: 'text-indigo-500 bg-indigo-500/10',
  },
  inventory: {
    icon: Package,
    label: 'מלאי',
    color: 'text-purple-500 bg-purple-500/10',
  },
};

export default function ActivityLog({ activities, isLoading }) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-500" />
          יומן פעילות
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            אין פעילות עדיין
          </div>
        ) : (
          <ScrollArea className="h-[400px] px-6 pb-6">
            <div className="space-y-2">
              {activities.map((activity, index) => {
                const config = typeConfig[activity.type] || typeConfig.adjustment;
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <div className={`p-2 rounded-lg ${config.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{config.label}</span>
                        {activity.amount !== undefined && (
                          <span className={`text-sm font-semibold ${activity.type === 'payment' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {activity.type === 'payment' ? '+' : '-'}₪{Math.abs(activity.amount).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {activity.profile_name || activity.notes || ''}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 whitespace-nowrap">
                      {format(new Date(activity.created_date), 'HH:mm dd/MM')}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
