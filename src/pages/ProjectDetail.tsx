import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Project, Task, User, Status } from '@/types';
import Layout from '@/components/Layout';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Loader2,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'sonner';

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

const STATUS_OPTIONS = ['Todo', 'In Progress', 'Done'] as const;

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filterStatus, setFilterStatus] = useState<'All' | typeof STATUS_OPTIONS[number]>('All');
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    const [projRes, tasksRes] = await Promise.all([
      api.projects.get(id),
      api.tasks.list(id)
    ]);

    if (projRes.data) setProject(projRes.data);
    if (tasksRes.data) setTasks(tasksRes.data);

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Delete this task?')) return;
    const { error } = await api.tasks.delete(taskId);
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

  const openCreate = () => { setEditingTask(null); setDialogOpen(true); };
  const openEdit = (task: Task) => { setEditingTask(task); setDialogOpen(true); };

  const filteredTasks = filterStatus === 'All' ? tasks : tasks.filter(t => t.status === filterStatus);

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground mt-4">Loading project details...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-16">
          <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold">Project not found</h2>
          <p className="text-muted-foreground mt-2">The project you are looking for does not exist or has been removed.</p>
          <Link to="/projects"><Button className="mt-6 rounded-full">Back to Projects</Button></Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <section>
          <Link to="/projects" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Projects
          </Link>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-3xl">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">{project.title}</h1>
              {project.description && (
                <p className="text-muted-foreground mt-2 leading-relaxed">{project.description}</p>
              )}
              <div className="flex items-center gap-4 mt-6">
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-muted/50 px-3 py-1.5 rounded-full text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold bg-primary/10 px-3 py-1.5 rounded-full text-primary">
                  {tasks.length} tasks
                </div>
              </div>
            </div>
            <Button onClick={openCreate} className="rounded-full shadow-lg shadow-primary/20 gap-2 shrink-0">
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>
        </section>

        {/* Tab-style Filter */}
        <section className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl w-fit">
          {(['All', ...STATUS_OPTIONS] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${filterStatus === s
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              {s}
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-md ${filterStatus === s ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                {s === 'All' ? tasks.length : tasks.filter(t => t.status === s).length}
              </span>
            </button>
          ))}
        </section>

        {/* Tasks List */}
        <section className="grid grid-cols-1 gap-3">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/20 border-2 border-dashed border-border rounded-2xl">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckSquareIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {filterStatus === 'All' ? 'This project has no tasks.' : `No ${filterStatus} tasks.`}
              </p>
              {filterStatus === 'All' && (
                <Button onClick={openCreate} variant="outline" className="mt-4 rounded-full border-primary/20 hover:border-primary/50 text-primary">
                  Create First Task
                </Button>
              )}
            </div>
          ) : (
            filteredTasks.map(task => (
              <Card key={task.id} className="group border-none bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="shrink-0 flex items-center">
                    <Select value={task.status} onValueChange={val => handleStatusChange(task.id, val as Status)}>
                      <SelectTrigger className="border-none bg-transparent h-fit w-fit p-0 shadow-none focus:ring-0">
                        {STATUS_ICONS[task.status]}
                        <div className="hidden"><SelectValue /></div>
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4">
                      <h4
                        className={`text-sm font-bold truncate transition-all ${task.status === 'Done' ? 'line-through text-muted-foreground' : 'text-foreground hover:text-primary cursor-pointer'}`}
                        onClick={() => openEdit(task)}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md" onClick={() => openEdit(task)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-md hover:text-red-500 hover:bg-red-500/10"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider rounded-md border-none ${PRIORITY_STYLES[task.priority]}`}>
                        {task.priority}
                      </Badge>

                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      )}

                      {task.description && (
                        <span className="text-[11px] text-muted-foreground truncate max-w-[200px] border-l pl-3">
                          {task.description}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        {/* Task Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[500px] rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">{editingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
            </DialogHeader>
            <TaskForm
              projectId={project.id}
              task={editingTask}
              profiles={{}} // Handled in TaskForm internally or via profiles service
              onSuccess={() => { setDialogOpen(false); fetchData(); }}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}

function CheckSquareIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 11 3 3L22 4" /></svg>
  );
}
