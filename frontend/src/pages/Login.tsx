import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    const { error } = await signIn(form.email, form.password);
    setLoading(false);

    if (error) {
      toast.error('Authentication failed. Please check your credentials.');
    } else {
      toast.success('Welcome back to TaskFlow');
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020817] overflow-hidden selection:bg-primary/30">
      {/* Abstract background blobs */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-primary/10 blur-[140px] rounded-full -translate-x-1/2 -translate-y-1/2 opacity-50" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full translate-x-1/3 translate-y-1/3 opacity-50" />

      <div className="relative w-full max-w-md px-6 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        {/* Branding */}
        <div className="flex items-center justify-between mb-10 w-full px-2">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-black tracking-tighter text-foreground">TaskFlow</span>
          </div>
          <Link to="/register" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            Create Account
          </Link>
        </div>

        <Card className="border-none bg-card/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[3rem] p-4">
          <CardHeader className="space-y-1 pt-6 px-4">
            <CardTitle className="text-2xl font-bold tracking-tight">Login</CardTitle>
            <CardDescription className="text-muted-foreground/80 font-medium text-xs">Please sign in to continue.</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest ml-1 opacity-70">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="h-12 rounded-2xl border-muted bg-muted/20 focus-visible:ring-primary/20 focus-visible:border-primary/30 py-6 transition-all"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest ml-1 opacity-70 block text-left">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="h-12 rounded-2xl border-muted bg-muted/20 focus-visible:ring-primary/20 focus-visible:border-primary/30 py-6 mb-1 transition-all"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot Password?</button>
              </div>
              <Button type="submit" className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <span className="flex items-center gap-2">
                    Login <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

          </CardContent>
        </Card>
      </div>
    </div >
  );
}
