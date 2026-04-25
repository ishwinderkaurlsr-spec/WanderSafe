import { useState, useRef, useCallback, useEffect } from "react";
import {
  ArrowLeft, Camera, Scan, AlertTriangle, Upload,
  RotateCcw, Loader2, ShieldAlert, ZapOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const LANGUAGES = [
  "English", "Spanish", "French", "Japanese", "Arabic",
  "Hindi", "Thai", "Korean", "German", "Italian", "Portuguese", "Chinese",
];
const SCAN_MODES = ["Menus", "Signs", "Documents"];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const API_KEY  = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

type CameraState = "idle" | "requesting" | "active" | "denied" | "captured";

// ── Inline SSE streamer (handles vision message format) ───────────────────────
async function streamVisionTranslation(
  imageBase64: string,
  targetLang: string,
  scanMode: string,
  onDelta: (t: string) => void,
  onDone: () => void,
  onError: (e: string) => void,
) {
  let resp: Response;
  try {
    resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
      body: JSON.stringify({
        feature: "translator",
        messages: [{
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a camera translator for travelers. Look at this image and translate ALL visible text into ${targetLang}. This is a "${scanMode}" scan.\n\nFormat your response clearly:\n- Show each original text snippet and its translation\n- Flag any allergens 🚨 or safety warnings ⚠️\n- Keep it concise and easy to read`,
            },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
            },
          ],
        }],
      }),
    });
  } catch {
    onError("Network error — please check your connection."); return;
  }

  if (!resp.ok) {
    if (resp.status === 429) { onError("Rate limit — please wait a moment."); return; }
    if (resp.status === 402) { onError("AI credits exhausted."); return; }
    onError("AI service unavailable — try again."); return;
  }
  if (!resp.body) { onError("Empty response from AI."); return; }

  const reader  = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const parsed = JSON.parse(json);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch { /* ignore partial chunk */ }
    }
  }
  onDone();
}

// ─────────────────────────────────────────────────────────────────────────────

const CameraTranslatorPage = () => {
  const navigate = useNavigate();
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const streamRef   = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [cameraState, setCameraState]     = useState<CameraState>("idle");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [targetLang, setTargetLang]       = useState("English");
  const [scanMode, setScanMode]           = useState("Menus");
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult]               = useState("");
  const [visionUnsupported, setVisionUnsupported] = useState(false);

  // Stop camera stream on unmount
  useEffect(() => () => stopCamera(), []);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const startCamera = useCallback(async () => {
    setCameraState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraState("active");
    } catch (err: any) {
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setCameraState("denied");
      } else {
        toast.error(`Camera error: ${err.message}`);
        setCameraState("idle");
      }
    }
  }, []);

  const captureFrame = useCallback(() => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    stopCamera();
    setCapturedImage(dataUrl);
    setCameraState("captured");
    runTranslation(dataUrl);
  }, [targetLang, scanMode]);                               // eslint-disable-line

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const dataUrl = ev.target?.result as string;
      setCapturedImage(dataUrl);
      setCameraState("captured");
      runTranslation(dataUrl);
    };
    reader.readAsDataURL(file);
  }, [targetLang, scanMode]);                               // eslint-disable-line

  const runTranslation = useCallback(async (dataUrl: string) => {
    setIsTranslating(true);
    setResult("");
    setVisionUnsupported(false);
    const base64 = dataUrl.split(",")[1];

    await streamVisionTranslation(
      base64, targetLang, scanMode,
      chunk => setResult(prev => prev + chunk),
      ()    => setIsTranslating(false),
      err   => {
        setIsTranslating(false);
        // If the model doesn't support vision, the gateway returns a 400/500 with a descriptive error
        if (err.toLowerCase().includes("vision") || err.toLowerCase().includes("image") || err.toLowerCase().includes("unsupported")) {
          setVisionUnsupported(true);
        } else {
          toast.error(err);
        }
      },
    );
  }, [targetLang, scanMode]);

  const reset = () => {
    stopCamera();
    setCapturedImage(null);
    setCameraState("idle");
    setResult("");
    setIsTranslating(false);
    setVisionUnsupported(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="px-5 pt-2 pb-3 flex items-center gap-3 border-b border-border">
        <button onClick={() => { stopCamera(); navigate("/translate"); }} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm font-heading font-bold">Camera Translate</h1>
          <p className="text-[10px] text-muted-foreground">Point at signs, menus & documents</p>
        </div>
      </div>

      {/* Controls row */}
      <div className="px-5 py-2 flex items-center gap-2">
        <select
          value={targetLang}
          onChange={e => setTargetLang(e.target.value)}
          className="flex-1 text-xs rounded-xl border border-border bg-card px-3 py-2 font-medium focus:outline-none"
        >
          {LANGUAGES.map(l => <option key={l}>{l}</option>)}
        </select>

        <div className="flex gap-1">
          {SCAN_MODES.map(m => (
            <button
              key={m}
              onClick={() => setScanMode(m)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-medium transition-all border",
                scanMode === m
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Viewfinder / Camera area */}
      <div className="mx-5 rounded-2xl bg-foreground/90 relative overflow-hidden flex items-center justify-center"
           style={{ aspectRatio: "4/3", maxHeight: 300 }}>

        {/* Live video */}
        <video
          ref={videoRef}
          className={cn("absolute inset-0 w-full h-full object-cover", cameraState !== "active" && "hidden")}
          playsInline muted
        />

        {/* Captured image */}
        {capturedImage && cameraState === "captured" && (
          <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover" alt="captured" />
        )}

        {/* Hidden canvas for frame capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Corner scan brackets */}
        {(cameraState === "active") && (
          <>
            <div className="absolute top-3 left-3 w-7 h-7 border-t-2 border-l-2 border-white/70 rounded-tl-lg z-10" />
            <div className="absolute top-3 right-3 w-7 h-7 border-t-2 border-r-2 border-white/70 rounded-tr-lg z-10" />
            <div className="absolute bottom-3 left-3 w-7 h-7 border-b-2 border-l-2 border-white/70 rounded-bl-lg z-10" />
            <div className="absolute bottom-3 right-3 w-7 h-7 border-b-2 border-r-2 border-white/70 rounded-br-lg z-10" />
            {/* Scan line */}
            <motion.div
              animate={{ top: ["15%", "85%", "15%"] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              className="absolute inset-x-4 h-0.5 bg-primary/70 z-10"
            />
          </>
        )}

        {/* Translating overlay */}
        {isTranslating && capturedImage && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 z-20">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-white text-sm font-medium">Translating…</p>
          </div>
        )}

        {/* Idle state */}
        {cameraState === "idle" && (
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <Camera className="w-10 h-10 text-white/50" />
            <p className="text-white/70 text-sm">Tap "Start Camera" below<br/>or upload a photo</p>
          </div>
        )}

        {/* Requesting */}
        {cameraState === "requesting" && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-white/70 text-sm">Requesting camera…</p>
          </div>
        )}

        {/* Denied */}
        {cameraState === "denied" && (
          <div className="flex flex-col items-center gap-2 text-center px-6">
            <ShieldAlert className="w-8 h-8 text-destructive" />
            <p className="text-white text-sm font-semibold">Camera access blocked</p>
            <p className="text-white/60 text-xs">Click the 🔒 in your address bar → Site settings → Camera → Allow, then reload</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="px-5 py-3 flex items-center justify-center gap-3">
        {cameraState === "captured" ? (
          <button
            onClick={reset}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-card border border-border text-sm font-medium hover:border-primary/30 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Retake
          </button>
        ) : (
          <>
            <button
              onClick={cameraState === "active" ? captureFrame : startCamera}
              disabled={cameraState === "requesting" || cameraState === "denied"}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all",
                cameraState === "active"
                  ? "safe-gradient text-white shadow-lg"
                  : "bg-primary text-primary-foreground",
                (cameraState === "requesting" || cameraState === "denied") && "opacity-50 cursor-not-allowed"
              )}
            >
              {cameraState === "active"
                ? <><Scan className="w-4 h-4" /> Capture & Translate</>
                : <><Camera className="w-4 h-4" /> Start Camera</>
              }
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-border text-sm font-medium hover:border-primary/30 transition-all"
            >
              <Upload className="w-4 h-4" /> Upload Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-5 pb-4">
        <AnimatePresence>
          {visionUnsupported && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex gap-3 mb-3"
            >
              <ZapOff className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800 mb-1">Vision not supported by AI model</p>
                <p className="text-xs text-amber-700">The connected AI doesn't support image analysis. Try uploading a clearer photo or typing the text you want translated in the Conversation Translator.</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="px-4 py-2 border-b border-border bg-primary/5 flex items-center gap-2">
                <Scan className="w-3.5 h-3.5 text-primary" />
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {scanMode} → {targetLang}
                </p>
              </div>
              <div className="px-4 py-3 prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-sm">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CameraTranslatorPage;
