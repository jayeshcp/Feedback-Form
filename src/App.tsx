import {
  useState,
  useRef,
  useEffect,
  type ChangeEvent,
  type PropsWithChildren,
} from "react";

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;

const SPINE_STATS = [
  "Private & Secure",
  "Keep your data local",
  "Works offline",
  "Export your notes",
];

const NPS_LABELS = ["Not at all likely", "Extremely likely"];

// ── Spine (left panel) ─────────────────────────────────────────────────────
function Spine() {
  return (
    <div
      className="
        relative overflow-hidden flex flex-col justify-between
        bg-[#c0583a] px-8 py-12
        sm:flex-row sm:items-center sm:gap-5 sm:py-8
      "
    >
      {/* ruled-lines overlay */}
      <div className="spine-lines absolute inset-0 pointer-events-none" />
      {/* right shadow edge */}
      <div className="spine-shadow absolute inset-0 pointer-events-none" />

      {/* icon */}
      <div className="relative z-10 text-[44px] leading-none">📖</div>

      {/* title + sub */}
      <div className="relative z-10">
        <p className="font-serif text-[22px] font-semibold text-white leading-snug mb-2">
          My Diary Chrome Extension
        </p>
        <p className="text-[12px] text-white/65 font-light leading-relaxed">
          lightweight and beautiful personal diary
        </p>
      </div>

      {/* stats — hidden on mobile */}
      <div className="relative z-10 flex flex-col gap-3.5 sm:hidden">
        {SPINE_STATS.map((s) => (
          <div key={s} className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />
            <span className="text-[11px] text-white/60 italic font-serif">
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface QuestionProps {
  num: string;
  label: string;
  animClass: string;
}

// ── Question wrapper ───────────────────────────────────────────────────────
function Question({
  num,
  label,
  children,
  animClass,
}: PropsWithChildren<QuestionProps>) {
  return (
    <div className={`flex flex-col gap-2.5 ${animClass}`}>
      <label className="flex items-center gap-2 text-[13px] font-medium text-[#1a1410]">
        <span
          className="
            inline-flex items-center justify-center w-5 h-5 rounded-full shrink-0
            bg-[#f5ede0] border border-[#e0d4c4]
            text-[10px] text-[#9a8878] font-medium
          "
        >
          {num}
        </span>
        {label}
      </label>
      {children}
    </div>
  );
}

interface StyledTextareaProps {
  id: string;
  name: string;
  placeholder?: string;
  rows?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}
// ── Textarea ───────────────────────────────────────────────────────────────
function StyledTextarea({
  id,
  name,
  placeholder = "",
  rows = 3,
  value,
  onChange,
}: StyledTextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full px-4 py-3.5 resize-y min-h-22.5
        border border-[#e0d4c4] rounded-md
        bg-[#faf6f0] text-[13px] font-sans text-[#1a1410]
        leading-[1.7] outline-none
        placeholder:text-[#9a8878] placeholder:italic
        transition-colors duration-200
        focus:border-[#c0583a]
      "
    />
  );
}

interface NpsSelectorProps {
  value: string | null;
  onChange: (newValue: string | null) => void;
}

// ── NPS selector ───────────────────────────────────────────────────────────
function NpsSelector({ value, onChange }: NpsSelectorProps) {
  return (
    <div>
      <div className="flex gap-1.5">
        {Array.from({ length: 6 }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(String(i))}
            className={`
              flex-1 py-3 rounded-md border text-[12px] font-sans
              transition-all duration-150 cursor-pointer
              ${
                value !== null && parseInt(value) === i
                  ? "bg-[#c0583a] border-[#c0583a] text-white font-medium"
                  : "bg-[#faf6f0] border-[#e0d4c4] text-[#9a8878] hover:border-[#c0583a] hover:text-[#c0583a]"
              }
            `}
          >
            {i}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[11px] text-[#9a8878] italic font-serif">
          {NPS_LABELS[0]}
        </span>
        <span className="text-[11px] text-[#9a8878] italic font-serif">
          {NPS_LABELS[1]}
        </span>
      </div>
    </div>
  );
}

// ── Thank You state ────────────────────────────────────────────────────────
function ThankYou() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger the progress bar animation after mount
    const raf = requestAnimationFrame(() => {
      if (fillRef.current) {
        fillRef.current.style.width = "100%";
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="animate-fade-up flex flex-col items-center justify-center text-center gap-5 h-full px-10 py-16">
      <div className="text-[54px]">🕊️</div>
      <h2 className="font-serif text-[26px] font-semibold text-[#1a1410]">
        Thank you for sharing.
      </h2>
      <p className="text-[14px] text-[#9a8878] leading-[1.7] italic font-serif max-w-[320px]">
        Your words will shape the next chapter of My Diary. We hope our paths
        cross again someday.
      </p>
      <div className="w-full max-w-50 h-0.75 bg-[#e0d4c4] rounded-sm overflow-hidden">
        <div
          ref={fillRef}
          className="h-full bg-[#c0583a] rounded-sm progress-transition"
          style={{ width: "0%" }}
        />
      </div>
      <small className="text-[11px] text-[#9a8878] italic font-serif">
        This page will close in a moment…
      </small>
    </div>
  );
}

// ── Main form ──────────────────────────────────────────────────────────────
export default function FeedbackForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [uninstallReason, setUninstallReason] = useState("");
  const [nps, setNps] = useState<string | null>(null);
  const [comments, setComments] = useState("");

  function sanitize(str: string): string {
    return str?.trim().replace(/[<>]/g, "");
  }

  async function handleSubmit() {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("uninstall_reason", sanitize(uninstallReason));
      formData.append("how_likely_to_recommend", sanitize(nps ?? ""));
      formData.append("comments", sanitize(comments));

      await fetch(GOOGLE_SCRIPT_URL, { method: "POST", body: formData });
      console.log("Feedback submitted! Thanks 🙏");
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
      // setTimeout(() => window.close(), 3200); uncomment this for chrome extension
    }
  }

  return (
    <div
      className="
        min-h-screen flex items-center justify-center px-5 py-10
        bg-[#faf6f0] bg-radial font-sans text-[#1a1410]
      "
    >
      <div
        className="
          animate-fade-up
          grid w-full max-w-220 min-h-150
          border border-[#e0d4c4]
          shadow-[0_20px_60px_rgba(26,20,16,0.12),0_4px_12px_rgba(26,20,16,0.06)]
          grid-cols-[260px_1fr]
          max-sm:grid-cols-1
        "
      >
        <Spine />

        {/* Right panel */}
        <div className="bg-white">
          {submitted ? (
            <ThankYou />
          ) : (
            <div
              className="flex flex-col gap-7 px-13 py-12 max-sm:px-7 max-sm:py-8"
              style={{ padding: "48px 52px" }}
            >
              {/* Header */}
              <div>
                <h1 className="font-serif text-[28px] font-semibold text-[#1a1410] leading-snug mb-2">
                  We're sad to see you go.
                </h1>
                <p className="text-[14px] text-[#9a8878] leading-[1.7] font-light">
                  Your feedback helps us grow. Just a minute — it means more
                  than you know.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px divider-gradient" />

              {/* Q1 */}
              <Question
                num="1"
                label="What could we have done differently?"
                animClass="animate-fade-up-1"
              >
                <StyledTextarea
                  id="uninstall_reason"
                  name="uninstall_reason"
                  value={uninstallReason}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setUninstallReason(e.target.value)
                  }
                />
              </Question>

              {/* Q2: NPS */}
              <Question
                num="2"
                label="How likely are you to recommend My Diary to a friend?"
                animClass="animate-fade-up-2"
              >
                <NpsSelector value={nps} onChange={setNps} />
              </Question>

              {/* Q3 */}
              <Question
                num="3"
                label="Anything else you'd like to tell us?"
                animClass="animate-fade-up-3"
              >
                <StyledTextarea
                  id="comments"
                  name="comments"
                  placeholder="What could we have done better? What did you love? We read every single response…"
                  value={comments}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setComments(e.target.value)
                  }
                />
              </Question>

              {/* Footer */}
              <div className="flex items-center justify-between gap-4 mt-1 animate-fade-up-4">
                <span className="text-[11.5px] text-[#9a8878] italic font-serif leading-snug">
                  Your response is anonymous
                </span>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="
                    shrink-0 px-8 py-3.5
                    bg-[#c0583a] text-white
                    rounded-md text-[13.5px] font-sans font-medium tracking-[0.3px]
                    shadow-[0_2px_8px_rgba(192,88,58,0.25)]
                    transition-all duration-200
                    hover:bg-[#a84d31] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(192,88,58,0.35)]
                    active:translate-y-0
                    disabled:opacity-60 disabled:cursor-not-allowed
                    whitespace-nowrap cursor-pointer
                  "
                >
                  {loading ? "Sending…" : "Send Feedback"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
