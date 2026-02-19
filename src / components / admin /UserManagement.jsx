import React, { useState } from 'react';
import { Users, Pencil, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserManagement({ users, balances, onEditBalance, onDeleteUser, isLoading }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [editMode, setEditMode] = useState(null); // 'balance' | 'delete'
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState('add');
  const [notes, setNotes] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditBalance = async () => {
    if (!adjustAmount || parseFloat(adjustAmount) <= 0) return;
    setIsSubmitting(true);
    const amount = adjustType === 'add' ? parseFloat(adjustAmount) : -parseFloat(adjustAmount);
    await onEditBalance(selectedUser, amount, notes);
    setIsSubmitting(false);
    closeDialog();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    setIsSubmitting(true);
    await onDeleteUser(selectedUser);
    setIsSubmitting(false);
    closeDialog();
  };

  const closeDialog = () => {
    setSelectedUser(null);
    setEditMode(null);
    setAdjustAmount('');
    setAdjustType('add');
    setNotes('');
    setConfirmDelete(false);
  };

  const openEditBalance = (user) => {
    setSelectedUser(user);
    setEditMode('balance');
  };

  const openDeleteUser = (user) => {
    setSelectedUser(user);
    setEditMode('delete');
  };

  return (
    <>
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            ניהול משתמשים
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              אין משתמשים פעילים
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {users.map((user) => {
                  const balance = balances[user.id] || 0;
                  const isPositive = balance >= 0;
                  
                  return (
                    <motion.div
                      key={user.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{user.full_name || 'ללא שם'}</span>
                          {user.role === 'admin' && (
                            <Badge className="bg-indigo-500 text-white text-xs">מנהל</Badge>
                          )}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`font-bold text-lg ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {!isPositive && '-'}₪{Math.abs(balance).toFixed(2)}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEditBalance(user)}
                            className="h-9 w-9 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openDeleteUser(user)}
                            className="h-9 w-9 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Balance Dialog */}
      <Dialog open={editMode === 'balance'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl">עריכת יתרה - {selectedUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>סוג פעולה</Label>
              <Select value={adjustType} onValueChange={setAdjustType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">הוספת זיכוי</SelectItem>
                  <SelectItem value="remove">הפחתת זיכוי</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">סכום (₪)</Label>
              <Input
                id="amount"
                type="number"
                min="0"
                step="0.01"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
                placeholder="הזן סכום"
                className="text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">הערה</Label>
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
              onClick={handleEditBalance}
              disabled={!adjustAmount || parseFloat(adjustAmount) <= 0 || isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin me-2" />}
              שמור
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={editMode === 'delete'} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              מחיקת משתמש
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              האם אתה בטוח שברצונך למחוק את המשתמש <strong>{selectedUser?.full_name}</strong>?
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              פעולה זו תמחק את המשתמש וכל הנתונים הקשורים אליו. לא ניתן לבטל פעולה זו.
            </p>
            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg">
              <Checkbox
                id="confirm"
                checked={confirmDelete}
                onCheckedChange={setConfirmDelete}
              />
              <Label htmlFor="confirm" className="text-sm cursor-pointer">
                אני מאשר את מחיקת המשתמש
              </Label>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline">ביטול</Button>
            </DialogClose>
            <Button
              onClick={handleDelete}
              disabled={!confirmDelete || isSubmitting}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin me-2" />}
              מחק משתמש
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
