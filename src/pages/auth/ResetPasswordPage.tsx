import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Shield } from "lucide-react";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      navigate("/safety");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] bg-background phone-frame overflow-hidden p-6">
        <div className="flex flex-col items-center pt-8 pb-8">
          <div className="w-16 h-16 rounded-2xl safe-gradient flex items-center justify-center mb-4 shadow-warm">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-heading font-bold">Set New Password</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 rounded-xl" required minLength={6} />
          </div>
          <Button type="submit" className="w-full rounded-xl safe-gradient text-primary-foreground" disabled={loading}>
            {loading ? "..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
