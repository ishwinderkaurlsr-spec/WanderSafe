import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Phone, User, Volume2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Web Audio ringtone
// ---------------------------------------------------------------------------

function createRingtone(ctx: AudioContext): { start: () => void; stop: () => void } {
  let intervalId: ReturnType<typeof setInterval> | null = null;
  const activeOscillators: OscillatorNode[] = [];

  const playBeep = () => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.45);
    activeOscillators.push(osc);
    osc.onended = () => {
      const idx = activeOscillators.indexOf(osc);
      if (idx !== -1) activeOscillators.splice(idx, 1);
    };
  };

  return {
    start() {
      playBeep();
      intervalId = setInterval(playBeep, 1200);
    },
    stop() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      activeOscillators.forEach((o) => {
        try { o.stop(); } catch (_) { /* already stopped */ }
      });
      activeOscillators.length = 0;
    },
  };
}

// ---------------------------------------------------------------------------
// Format seconds → M:SS
// ---------------------------------------------------------------------------
function formatDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------------------------------------------------------------------------
// Delay options
// ---------------------------------------------------------------------------
const DELAY_OPTIONS: { label: string; seconds: number }[] = [
  { label: "Now",    seconds: 0  },
  { label: "5 sec",  seconds: 5  },
  { label: "15 sec", seconds: 15 },
  { label: "30 sec", seconds: 30 },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const FakeCallPage = () => {
  const navigate = useNavigate();
  const [callerName, setCallerName] = useState("Mom");
  const [isRinging, setIsRinging] = useState(false);
  const [isOnCall, setIsOnCall] = useState(false);

  // Live call timer
  const [callSeconds, setCallSeconds] = useState(0);

  // Pending-call countdown (null = nothing pending)
  const [pendingSeconds, setPendingSeconds] = useState<number | null>(null);

  // Refs for timers and audio — stable across renders
  const pendingTimeoutRef  = useRef<ReturnType<typeof setTimeout>  | null>(null);
  const pendingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callIntervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioCtxRef        = useRef<AudioContext | null>(null);
  const ringtoneRef        = useRef<ReturnType<typeof createRingtone> | null>(null);

  // ------------------------------------------------------------------
  // Ringtone: start when ringing, stop otherwise
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isRinging) {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        )();
      }
      ringtoneRef.current = createRingtone(audioCtxRef.current);
      ringtoneRef.current.start();
    } else {
      ringtoneRef.current?.stop();
      ringtoneRef.current = null;
    }
    return () => {
      ringtoneRef.current?.stop();
      ringtoneRef.current = null;
    };
  }, [isRinging]);

  // ------------------------------------------------------------------
  // Call duration counter
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isOnCall) {
      setCallSeconds(0);
      callIntervalRef.current = setInterval(() => {
        setCallSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (callIntervalRef.current !== null) {
        clearInterval(callIntervalRef.current);
        callIntervalRef.current = null;
      }
      setCallSeconds(0);
    }
    return () => {
      if (callIntervalRef.current !== null) {
        clearInterval(callIntervalRef.current);
        callIntervalRef.current = null;
      }
    };
  }, [isOnCall]);

  // ------------------------------------------------------------------
  // Shake detection
  // ------------------------------------------------------------------
  useEffect(() => {
    const THRESHOLD = 15;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc) return;
      const magnitude = Math.sqrt((acc.x ?? 0) ** 2 + (acc.y ?? 0) ** 2 + (acc.z ?? 0) ** 2);
      if (magnitude > THRESHOLD && !isRinging && !isOnCall && pendingSeconds === null) {
        scheduleCall(0);
      }
    };

    window.addEventListener("devicemotion", handleMotion as EventListener);
    return () => window.removeEventListener("devicemotion", handleMotion as EventListener);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRinging, isOnCall, pendingSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { clearPending(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------------

  const clearPending = () => {
    if (pendingTimeoutRef.current !== null) {
      clearTimeout(pendingTimeoutRef.current);
      pendingTimeoutRef.current = null;
    }
    if (pendingIntervalRef.current !== null) {
      clearInterval(pendingIntervalRef.current);
      pendingIntervalRef.current = null;
    }
    setPendingSeconds(null);
  };

  const scheduleCall = (delaySecs: number) => {
    clearPending();

    if (delaySecs === 0) {
      setIsRinging(true);
      return;
    }

    setPendingSeconds(delaySecs);

    // Tick the countdown badge every second
    pendingIntervalRef.current = setInterval(() => {
      setPendingSeconds((prev) => {
        if (prev === null || prev <= 1) return null;
        return prev - 1;
      });
    }, 1000);

    // Fire the actual call after the full delay
    pendingTimeoutRef.current = setTimeout(() => {
      if (pendingIntervalRef.current !== null) {
        clearInterval(pendingIntervalRef.current);
        pendingIntervalRef.current = null;
      }
      setPendingSeconds(null);
      setIsRinging(true);
    }, delaySecs * 1000);
  };

  const answerCall = () => {
    setIsRinging(false);
    setIsOnCall(true);
  };

  const endCall = () => {
    setIsOnCall(false);
    setIsRinging(false);
  };

  const declineCall = () => {
    setIsRinging(false);
  };

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <div className="flex flex-col min-h-full">
      {/* Full-screen incoming / in-call overlay */}
      <AnimatePresence>
        {(isRinging || isOnCall) && (
          <motion.div
            key="call-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-foreground flex flex-col items-center justify-between py-16 px-8 rounded-[2.5rem]"
          >
            <div className="flex flex-col items-center gap-3 mt-8">
              <motion.div
                animate={isRinging ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="w-24 h-24 rounded-full bg-muted/20 flex items-center justify-center"
              >
                <User className="w-12 h-12 text-background" />
              </motion.div>
              <h2 className="text-2xl font-heading font-bold text-background">{callerName}</h2>
              <p className="text-sm text-background/60">
                {isRinging
                  ? "Incoming Call..."
                  : isOnCall
                  ? `Connected — ${formatDuration(callSeconds)}`
                  : ""}
              </p>
            </div>

            {isRinging ? (
              <div className="flex items-center gap-12">
                {/* Decline */}
                <button
                  onClick={declineCall}
                  className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
                >
                  <Phone className="w-7 h-7 text-primary-foreground rotate-[135deg]" />
                </button>
                {/* Answer */}
                <motion.button
                  onClick={answerCall}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="w-16 h-16 rounded-full bg-sage flex items-center justify-center"
                >
                  <Phone className="w-7 h-7 text-primary-foreground" />
                </motion.button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="flex items-center gap-8">
                  <button className="flex flex-col items-center gap-1">
                    <div className="w-12 h-12 rounded-full bg-background/10 flex items-center justify-center">
                      <Volume2 className="w-5 h-5 text-background" />
                    </div>
                    <span className="text-[10px] text-background/60">Speaker</span>
                  </button>
                </div>
                <button
                  onClick={endCall}
                  className="w-16 h-16 rounded-full bg-destructive flex items-center justify-center"
                >
                  <Phone className="w-7 h-7 text-primary-foreground rotate-[135deg]" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-5 pt-2 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/safety")} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-heading font-bold">Fake Call</h1>
      </div>

      {/* Setup body */}
      <div className="px-5 flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-6">
          Simulate a realistic incoming phone call to naturally exit uncomfortable situations.
        </p>

        <div className="space-y-4">
          {/* Caller name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Caller Name</label>
            <Input
              value={callerName}
              onChange={(e) => setCallerName(e.target.value)}
              placeholder="Enter a name"
              className="rounded-xl"
            />
          </div>

          {/* Delay buttons */}
          <div>
            <label className="text-sm font-medium mb-2 block">Delay</label>
            <div className="flex gap-2">
              {DELAY_OPTIONS.map(({ label, seconds }) => (
                <button
                  key={label}
                  onClick={() => scheduleCall(seconds)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium hover:border-primary/30 hover:bg-coral-light/30 transition-all flex-1"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Pending countdown toast */}
          <AnimatePresence>
            {pendingSeconds !== null && (
              <motion.div
                key="countdown-toast"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-between px-4 py-3 rounded-2xl bg-primary/10 border border-primary/30"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-medium text-primary">
                    Call in {pendingSeconds}s…
                  </span>
                </div>
                <button
                  onClick={clearPending}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1" />

        <div className="pb-6">
          <Button
            onClick={() => scheduleCall(0)}
            className="w-full h-12 rounded-2xl safe-gradient text-primary-foreground font-heading font-bold text-base shadow-warm"
          >
            <Phone className="w-5 h-5 mr-2" /> Trigger Fake Call
          </Button>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            Tip: You can also shake your phone to trigger
          </p>
        </div>
      </div>
    </div>
  );
};

export default FakeCallPage;
