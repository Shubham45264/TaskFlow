import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Shield, Mail, BadgeCheck, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, signOut, updateProfile, changePassword } = useAuth();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwLoading, setPwLoading] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Display name cannot be empty');
      return;
    }
    setLoading(true);
    const { error } = await updateProfile({ name: name.trim() });
    setLoading(false);

    if (error) toast.error(error);
    else toast.success('Profile updated successfully');
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setPwLoading(true);
    const { error } = await changePassword(pwForm.currentPassword, pwForm.newPassword);
    setPwLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Password updated successfully');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center gap-8 bg-card/30 backdrop-blur-sm border border-border/50 p-8 rounded-3xl">
          <div className="relative group">
            <div className="h-32 w-32 rounded-3xl bg-primary flex items-center justify-center text-4xl font-extrabold text-primary-foreground shadow-2xl shadow-primary/40 ring-4 ring-background group-hover:scale-105 transition-transform duration-300">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl border-4 border-background shadow-lg">
              <BadgeCheck className="h-5 w-5" />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{user.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                <Mail className="h-4 w-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-indigo-500 bg-indigo-500/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
                <Shield className="h-4 w-4" />
                {user.role}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-6 rounded-xl border-red-500/20 text-red-500 hover:bg-red-500/10 gap-2 transition-all"
              onClick={signOut}
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Navigation/Sidebar-ish inside profile */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">Settings</h3>
              <p className="text-sm text-muted-foreground">Manage your account and security.</p>
            </div>

            <nav className="flex flex-col gap-1 mt-6">
              <button className="flex items-center gap-3 w-full p-4 rounded-2xl bg-muted/60 text-foreground font-bold text-sm shadow-sm transition-all text-left">
                <User className="h-4 w-4 text-primary" />
                Info
              </button>
              <button className="flex items-center gap-3 w-full p-4 rounded-2xl text-muted-foreground hover:bg-muted/30 font-semibold text-sm transition-all text-left">
                <Shield className="h-4 w-4" />
                Security
              </button>
            </nav>
          </div>

          <div className="md:col-span-3 space-y-8">
            {/* Personal Info Form */}
            <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-primary/5 pb-8 pt-6">
                <CardTitle className="text-lg font-bold">Profile</CardTitle>
                <CardDescription className="font-medium">Your public information.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold ml-1">Display Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-12 rounded-xl border-muted bg-background/50 focus-visible:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-bold ml-1">Email Address</Label>
                    <div className="h-12 flex items-center px-4 rounded-xl bg-muted/30 border border-transparent text-muted-foreground font-medium text-sm">
                      {user.email}
                      <BadgeCheck className="ml-auto h-4 w-4 text-emerald-500 opacity-60" />
                    </div>
                    <p className="text-[10px] text-muted-foreground ml-1 uppercase font-bold tracking-widest mt-1 opacity-70">Email cannot be changed</p>
                  </div>

                  <Button type="submit" disabled={loading} className="h-12 w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 px-8">
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="border-none bg-card/50 backdrop-blur-sm shadow-xl rounded-3xl overflow-hidden">
              <CardHeader className="bg-amber-500/5 pb-8 pt-6">
                <CardTitle className="text-lg font-bold">Password</CardTitle>
                <CardDescription className="font-medium">Update your password.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-bold ml-1">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter existing password"
                      value={pwForm.currentPassword}
                      onChange={e => setPwForm(f => ({ ...f, currentPassword: e.target.value }))}
                      className="h-12 rounded-xl border-muted bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-bold ml-1">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="At least 6 characters"
                      value={pwForm.newPassword}
                      onChange={e => setPwForm(f => ({ ...f, newPassword: e.target.value }))}
                      className="h-12 rounded-xl border-muted bg-background/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-bold ml-1">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Repeat password"
                      value={pwForm.confirmPassword}
                      onChange={e => setPwForm(f => ({ ...f, confirmPassword: e.target.value }))}
                      className="h-12 rounded-xl border-muted bg-background/50"
                    />
                  </div>
                  <Button type="submit" variant="secondary" disabled={pwLoading} className="h-12 w-full sm:w-auto rounded-xl px-8">
                    {pwLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div >
    </Layout >
  );
}
