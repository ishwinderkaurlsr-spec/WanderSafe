import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup" | "forgot";

const AuthPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Check your email for a password reset link!");
        setMode("login");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/safety");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] bg-background phone-frame overflow-hidden">
        <div className="p-6 flex flex-col min-h-[700px]">
          {/* Logo */}
          <div className="flex flex-col items-center pt-8 pb-8">
            <div className="w-16 h-16 rounded-2xl safe-gradient flex items-center justify-center mb-4 shadow-warm">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold">SafeHer</h1>
            <p className="text-sm text-muted-foreground mt-1">Travel safely, travel boldly</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <h2 className="text-lg font-heading font-bold text-center">
              {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
            </h2>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 rounded-xl" required />
            </div>

            {mode !== "forgot" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 rounded-xl" required minLength={6} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                </button>
              </div>
            )}

            {mode === "login" && (
              <button type="button" onClick={() => setMode("forgot")} className="text-xs text-primary hover:underline block text-right w-full">
                Forgot password?
              </button>
            )}

            <Button type="submit" className="w-full rounded-xl safe-gradient text-primary-foreground" disabled={loading}>
              {loading ? "..." : mode === "login" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              {mode === "login" ? (
                <>Don't have an account? <button type="button" onClick={() => setMode("signup")} className="text-primary font-medium hover:underline">Sign up</button></>
              ) : mode === "signup" ? (
                <>Already have an account? <button type="button" onClick={() => setMode("login")} className="text-primary font-medium hover:underline">Sign in</button></>
              ) : (
                <button type="button" onClick={() => setMode("login")} className="text-primary font-medium hover:underline flex items-center gap-1 mx-auto">
                  <ArrowLeft className="w-3 h-3" /> Back to sign in
                </button>
              )}
            </div>
          </form>

          {/* Skip */}
          <div className="pt-4 pb-4 text-center">
            <button onClick={() => navigate("/safety")} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Continue without account →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
