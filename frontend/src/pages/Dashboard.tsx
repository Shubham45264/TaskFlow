import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Project, Task } from '@/types';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  CheckSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  totalProjects: number;
  totalTasks: number;
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}

const PRIORITY_STYLES: Record<string, string> = {
  High: 'bg-red-500/10 text-red-400 border-red-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalProjects: 0, totalTasks: 0, todoCount: 0, inProgressCount: 0, doneCount: 0 });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        api.projects.list(),
        api.tasks.list()
      ]);

      if (projectsRes.data && tasksRes.data) {
        const projects = projectsRes.data;
        const tasks = tasksRes.data;

        setStats({
          totalProjects: projects.length,
          totalTasks: tasks.length,
          todoCount: tasks.filter(t => t.status === 'Todo').length,
          inProgressCount: tasks.filter(t => t.status === 'In Progress').length,
          doneCount: tasks.filter(t => t.status === 'Done').length,
        });

        setRecentProjects(projects.slice(0, 4));
        setRecentTasks(tasks.slice(0, 5));
      }
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    { label: 'Projects', value: stats.totalProjects, icon: FolderKanban, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Tasks', value: stats.totalTasks, icon: CheckSquare, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'In Progress', value: stats.inProgressCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Completed', value: stats.doneCount, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-48 bg-muted rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
          <div className="h-64 bg-muted rounded-xl" />
        </div>
      </Layout>
    );
  }

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.doneCount / stats.totalTasks) * 100) : 0;

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Hello, {user?.name?.split(' ')[0]}
              </h1>
              <p className="text-muted-foreground mt-1">
                Here is a summary of your projects and tasks.
              </p>
            </div>
            <Link to="/projects">
              <Button className="rounded-full px-6 shadow-lg shadow-primary/20">
                <PlusIcon className="mr-2 h-4 w-4" /> New Project
              </Button>
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <Card key={label} className="border-none bg-card/50 backdrop-blur-sm shadow-sm hover:shadow-md transition-all">
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground">{value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Progress & Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Progress
                </CardTitle>
                <div className="text-2xl font-bold text-primary">{completionRate}%</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden mt-2">
                <div
                  className="h-full bg-primary transition-all duration-1000 ease-out"
                  style={{ width: `${completionRate}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">To Do</p>
                  <p className="text-xl font-bold">{stats.todoCount}</p>
                </div>
                <div className="space-y-1 border-l pl-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">In Progress</p>
                  <p className="text-xl font-bold text-amber-500">{stats.inProgressCount}</p>
                </div>
                <div className="space-y-1 border-l pl-4">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Done</p>
                  <p className="text-xl font-bold text-emerald-500">{stats.doneCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-card/50 backdrop-blur-sm shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base font-semibold">Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link to="/tasks">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                      <CheckSquare className="h-4 w-4 text-indigo-500" />
                    </div>
                    <span>View All Tasks</span>
                  </div>
                </Button>
              </Link>
              <Link to="/profile">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 py-6 px-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span>Profile Settings</span>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Projects */}
          <Card className="border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-lg font-semibold">Projects</CardTitle>
              <Link to="/projects">
                <Button variant="ghost" size="sm" className="text-xs group hover:bg-transparent">
                  See all <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No projects yet.</p>
                </div>
              ) : (
                recentProjects.map(project => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <div className="flex items-center gap-4 group p-3 rounded-xl hover:bg-muted/30 transition-colors">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FolderKanban className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{project.title}</h4>
                        <p className="text-xs text-muted-foreground line-clamp-1">{project.description || 'No description'}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all mr-2" />
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-6">
              <CardTitle className="text-lg font-semibold">Tasks</CardTitle>
              <Link to="/tasks">
                <Button variant="ghost" size="sm" className="text-xs group hover:bg-transparent">
                  See all <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No tasks assigned.</p>
                </div>
              ) : (
                recentTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                    <div className="mt-0.5 shrink-0">
                      {task.status === 'Done' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-medium truncate ${task.status === 'Done' ? 'line-through text-muted-foreground' : ''}`}>{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`text-[10px] uppercase font-bold px-1.5 py-0 ${PRIORITY_STYLES[task.priority]}`}>
                          {task.priority}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
