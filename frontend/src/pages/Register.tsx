import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Loader2, Rocket } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.name);
    setLoading(false);

    if (error) {
      toast.error('Registration failed. Please try again.');
    } else {
      toast.success('Account created successfully. Welcome!');
      navigate('/dashboard');
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020817] overflow-hidden selection:bg-primary/30">
      {/* Dynamic background effects */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/10 blur-[130px] rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[110px] rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="relative w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-700">
        {/* Branding */}
        <div className="flex items-center justify-between mb-10 w-full px-2">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-black tracking-tighter text-foreground">TaskFlow</span>
          </div>
          <Link to="/login" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            Sign In
          </Link>
        </div>

        <Card className="border-none bg-card/40 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] rounded-[3rem] p-4">
          <CardHeader className="space-y-1 pt-6 px-4">
            <CardTitle className="text-3xl font-black tracking-tighter leading-none">Create Account</CardTitle>
            <CardDescription className="text-muted-foreground/80 font-bold uppercase tracking-[0.1em] text-[10px]">Join us today</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="space-y-2 px-1">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Maverick"
                    className="h-14 rounded-2xl border-muted bg-white/5 focus-visible:ring-primary/20 focus-visible:border-primary/30 py-6 border-b-2 placeholder:text-muted-foreground/30 transition-all font-semibold"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2 px-1">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@nexus.com"
                    className="h-14 rounded-2xl border-muted bg-white/5 focus-visible:ring-primary/20 focus-visible:border-primary/30 py-6 border-b-2 placeholder:text-muted-foreground/30 transition-all font-semibold"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2 px-1">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">Password (Min 6 characters)</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="h-14 rounded-2xl border-muted bg-white/5 focus-visible:ring-primary/20 focus-visible:border-primary/30 py-6 border-b-2 placeholder:text-muted-foreground/30 transition-all font-semibold"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-16 rounded-[1.5rem] text-lg font-black bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all active:scale-95 group" disabled={loading}>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <span className="flex items-center gap-2">
                    Sign Up <Rocket className="h-5 w-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-500" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-12 text-center">
              <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
                By clicking, you agree to our Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  );
}
