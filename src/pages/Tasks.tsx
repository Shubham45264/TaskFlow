import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Task, Project, Status } from '@/types';
import Layout from '@/components/Layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Pencil,
  Trash2,
  Clock,
  CheckCircle2,
  CalendarDays,
  Search,
  Loader2,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import TaskForm from '@/components/TaskForm';

const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-red-500/10 text-red-500 border-red-500/20',
  Medium: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  Low: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  'Todo': <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30" />,
  'In Progress': <Clock className="h-4 w-4 text-amber-500" />,
  'Done': <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
};

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    const [tasksRes, projectsRes] = await Promise.all([
      api.tasks.list(),
      api.projects.list()
    ]);

    if (tasksRes.data) setTasks(tasksRes.data);
    if (projectsRes.data) setProjects(projectsRes.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    const { error } = await api.tasks.delete(id);
    if (error) toast.error(error);
    else {
      toast.success('Task deleted');
      fetchData();
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    const { error } = await api.tasks.update(taskId, { status: newStatus });
    if (error) toast.error(error);
    else {
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    }
  };

  const getProjectName = (id: string) => projects.find(p => p.id === id)?.title || 'Unknown Project';

  const filteredTasks = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description?.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === 'All' || t.status === filterStatus;
    const matchPriority = filterPriority === 'All' || t.priority === filterPriority;
    return matchSearch && matchStatus && matchPriority;
  });

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <section>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Tasks</h1>
              <p className="text-muted-foreground mt-1">All your tasks in one place.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-muted px-4 py-2 rounded-xl border flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">{filteredTasks.length}</span>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">tasks</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Bar */}
        <section className="bg-card/30 backdrop-blur-sm border border-border/50 p-3 rounded-2xl flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks or descriptions..."
              className="pl-9 h-11 bg-background/50 border-none rounded-xl focus-visible:ring-1 focus-visible:ring-primary/20"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-xl border border-border/20 self-stretch group focus-within:border-primary/30 transition-colors">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 w-[120px] text-xs font-bold">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="Todo">Todo</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1 bg-background/50 rounded-xl border border-border/20 self-stretch group focus-within:border-primary/30 transition-colors">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="h-8 border-none bg-transparent shadow-none focus:ring-0 w-[120px] text-xs font-bold">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-xl">
                  <SelectItem value="All">All Priorities</SelectItem>
                  <SelectItem value="High">High Priority</SelectItem>
                  <SelectItem value="Medium">Medium Priority</SelectItem>
                  <SelectItem value="Low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Unified Task List */}
        <section className="space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="py-20 text-center bg-muted/10 rounded-3xl border-2 border-dashed border-border/50">
              <p className="text-muted-foreground font-medium">
                {tasks.length === 0 ? "You don't have any tasks yet." : "No tasks match your current filters."}
              </p>
              {tasks.length === 0 && (
                <Link to="/projects">
                  <Button variant="outline" className="mt-4 rounded-full">Go to Projects</Button>
                </Link>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <Card key={task.id} className="group border-none bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="flex items-center gap-6 p-5">
                  {/* Compact Status + Priority indicator */}
                  <div className="shrink-0">
                    <Select value={task.status} onValueChange={val => handleStatusChange(task.id, val as Status)}>
                      <SelectTrigger className="border-none bg-transparent h-fit w-fit p-0 shadow-none focus:ring-0">
                        {STATUS_ICONS[task.status]}
                        <div className="hidden"><SelectValue /></div>
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="Todo">Todo</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className={`text-sm font-bold truncate transition-colors ${task.status === 'Done' ? 'line-through text-muted-foreground' : 'text-foreground hover:text-primary cursor-pointer'}`} onClick={() => { setEditingTask(task); setDialogOpen(true); }}>
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <Link to={`/projects/${task.project}`} className="text-[11px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md hover:bg-primary/10 transition-colors">
                            {getProjectName(task.project)}
                          </Link>
                          <Badge variant="outline" className={`text-[10px] uppercase font-bold px-1.5 py-0 border-none ${PRIORITY_STYLES[task.priority]}`}>
                            {task.priority}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => { setEditingTask(task); setDialogOpen(true); }}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {task.dueDate && (
                    <div className="shrink-0 hidden sm:flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-xl border border-border/20">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </section>

        {/* Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-2xl border-none">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-display">Edit Task</DialogTitle>
            </DialogHeader>
            {editingTask && (
              <TaskForm
                projectId={editingTask.project}
                task={editingTask}
                profiles={{}}
                onSuccess={() => { setDialogOpen(false); fetchData(); }}
                onCancel={() => setDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
