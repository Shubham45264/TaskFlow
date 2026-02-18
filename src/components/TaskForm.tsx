import { useState } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Task, Priority, Status } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface TaskFormProps {
  projectId: string;
  task: Task | null;
  profiles?: Record<string, string>; // Kept for compatibility but we'll use api for future-proof
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TaskForm({ projectId, task, onSuccess, onCancel }: TaskFormProps) {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'Todo',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate || '',
    assignedTo: task?.assignedTo || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error('Task title is required');
      return;
    }

    setSubmitting(true);
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status as Status,
      priority: form.priority as Priority,
      dueDate: form.dueDate || null,
      assignedTo: form.assignedTo || null,
      project: projectId,
      created_by: task?.created_by || user?.id || 'u1'
    };

    const res = task
      ? await api.tasks.update(task.id, payload)
      : await api.tasks.create(payload);

    setSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(task ? 'Task updated' : 'Task created');
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-2">
      <div className="space-y-2">
        <Label className="text-sm font-bold ml-1">Task Title <span className="text-red-500">*</span></Label>
        <Input
          placeholder="e.g. Design system integration"
          className="h-12 rounded-xl border-muted bg-muted/20 focus-visible:ring-primary/20"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          required
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold ml-1">Detailed Description</Label>
        <Textarea
          placeholder="Break down the requirements for this task..."
          rows={3}
          className="rounded-xl border-muted bg-muted/20 resize-none min-h-[100px]"
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Status</Label>
          <Select
            value={form.status}
            onValueChange={v => setForm(f => ({ ...f, status: v as Status }))}
          >
            <SelectTrigger className="h-12 rounded-xl border-muted bg-muted/20 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Todo">To Do</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-bold ml-1">Priority</Label>
          <Select
            value={form.priority}
            onValueChange={v => setForm(f => ({ ...f, priority: v as Priority }))}
          >
            <SelectTrigger className="h-12 rounded-xl border-muted bg-muted/20 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-bold ml-1">Target Date</Label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            type="date"
            className="h-12 pl-11 rounded-xl border-muted bg-muted/20 appearance-none font-medium"
            value={form.dueDate}
            onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          className="flex-1 h-12 rounded-xl"
          onClick={onCancel}
        >
          Discard
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20"
        >
          {submitting ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            task ? 'Apply Changes' : 'Launch Task'
          )}
        </Button>
      </div>
    </form>
  );
}
