import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, HelpCircle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#020817] p-6 selection:bg-primary/30">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[130px] rounded-full animate-pulse pointer-events-none" />

      <div className="relative z-10 text-center space-y-8 animate-in zoom-in-95 duration-700">
        {/* Central Icon */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
          <div className="relative h-24 w-24 bg-card/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
            <HelpCircle className="h-10 w-10 text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-[120px] font-black leading-none tracking-tighter text-foreground selection:bg-red-500/50">404</h1>
            <p className="text-xl font-bold uppercase tracking-[0.2em] text-muted-foreground/50">Sector Not Accessible</p>
          </div>

          <p className="max-w-md mx-auto text-muted-foreground font-medium leading-relaxed">
            The coordinates <code className="bg-muted px-2 py-0.5 rounded text-foreground font-bold">{location.pathname}</code> do not match any recognized system sectors in the TaskFlow network.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link to="/dashboard">
            <Button className="h-14 px-10 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 gap-3">
              <Zap className="h-5 w-5 fill-current" /> Return to Command Center
            </Button>
          </Link>
          <Button variant="ghost" className="h-14 px-10 rounded-2xl text-base font-bold text-muted-foreground border border-white/5 hover:bg-white/5">
            Protocol Request Support
          </Button>
        </div>

        <div className="pt-10">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground/30">Error Code: TF_SECTOR_MISMATCH_V0</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
