import { useState, useRef } from "react";

const COLORS = {
  bg: "#0D1117",
  surface: "#161B22",
  border: "#30363D",
  green: "#3FB950",
  gold: "#D29922",
  text: "#E6EDF3",
  muted: "#8B949E",
  accent: "#58A6FF",
};

export default function ArabicTranslator() {
  const [input, setText] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [docType, setDocType] = useState("general");
  const outputRef = useRef(null);

  const docTypes = [
    { value: "general", label: "General Document" },
    { value: "transcript", label: "Academic Transcript" },
    { value: "certificate", label: "Certificate / Degree" },
    { value: "personal", label: "Personal Statement" },
    { value: "recommendation", label: "Recommendation Letter" },
    { value: "birth", label: "Birth Certificate" },
    { value: "passport", label: "Passport / ID Info" },
  ];

  const translate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setOutput("");

    const systemPrompt = `You are a certified Arabic translator specializing in official government and academic documents. 
Translate the provided text into Modern Standard Arabic (Fusha/الفصحى) — the formal Arabic used in Saudi government documents.

Rules:
- Use formal, official Arabic phrasing suitable for government scholarship applications
- Preserve all names, dates, numbers, and proper nouns exactly (transliterate names into Arabic script)
- Maintain the original document structure and formatting as much as possible
- For ${docType} documents, use the appropriate formal terminology
- Output ONLY the Arabic translation, nothing else — no explanations, no notes`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: systemPrompt,
          messages: [{ role: "user", content: input }],
        }),
      });

      const data = await response.json();
      if (data?.content?.[0]?.text) {
        setOutput(data.content[0].text);
      } else {
        setError("Translation failed. Try again.");
      }
    } catch (e) {
      setError("Something went wrong. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setText("");
    setOutput("");
    setError("");
  };

  const charCount = input.length;
  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'IBM Plex Mono', 'Courier New', monospace",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "20px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: COLORS.surface,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: `linear-gradient(135deg, ${COLORS.green}, ${COLORS.accent})`,
            borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>🌍</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: "700", letterSpacing: "0.05em" }}>
              KSA SCHOLARSHIP TRANSLATOR
            </div>
            <div style={{ fontSize: "11px", color: COLORS.muted, letterSpacing: "0.08em" }}>
              EN → عربي · OFFICIAL DOCUMENT MODE
            </div>
          </div>
        </div>
        <div style={{
          fontSize: "10px",
          color: COLORS.green,
          border: `1px solid ${COLORS.green}`,
          padding: "4px 10px",
          borderRadius: "4px",
          letterSpacing: "0.1em",
        }}>FREE · AI-POWERED</div>
      </div>

      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

        {/* Notice */}
        <div style={{
          background: "rgba(210, 153, 34, 0.1)",
          border: `1px solid rgba(210, 153, 34, 0.3)`,
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "12px",
          color: COLORS.gold,
          lineHeight: "1.6",
        }}>
          ⚠️ <strong>Important:</strong> This gives you a high-quality draft translation. For final KSA submission, get a certified stamp from a local notary/translation office — they usually just stamp a pre-translated doc for much less money than doing the full translation.
        </div>

        {/* Doc Type Selector */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "11px", color: COLORS.muted, letterSpacing: "0.08em", display: "block", marginBottom: "8px" }}>
            DOCUMENT TYPE
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {docTypes.map(dt => (
              <button
                key={dt.value}
                onClick={() => setDocType(dt.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: `1px solid ${docType === dt.value ? COLORS.green : COLORS.border}`,
                  background: docType === dt.value ? "rgba(63,185,80,0.1)" : "transparent",
                  color: docType === dt.value ? COLORS.green : COLORS.muted,
                  fontSize: "11px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "inherit",
                  letterSpacing: "0.04em",
                }}
              >{dt.label}</button>
            ))}
          </div>
        </div>

        {/* Text Areas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          {/* Input */}
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "8px",
            }}>
              <label style={{ fontSize: "11px", color: COLORS.muted, letterSpacing: "0.08em" }}>
                ENGLISH TEXT
              </label>
              <span style={{ fontSize: "10px", color: COLORS.muted }}>
                {wordCount} words · {charCount} chars
              </span>
            </div>
            <textarea
              value={input}
              onChange={e => setText(e.target.value)}
              placeholder={`Paste your ${docTypes.find(d=>d.value===docType)?.label.toLowerCase()} text here...\n\nExample:\nThis is to certify that HamadUllah, son of...\nDate of Birth: ...\nGrade: ...`}
              style={{
                width: "100%",
                height: "320px",
                background: COLORS.surface,
                border: `1px solid ${COLORS.border}`,
                borderRadius: "8px",
                color: COLORS.text,
                fontFamily: "inherit",
                fontSize: "13px",
                padding: "14px",
                resize: "vertical",
                outline: "none",
                lineHeight: "1.7",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Output */}
          <div>
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: "8px",
            }}>
              <label style={{ fontSize: "11px", color: COLORS.muted, letterSpacing: "0.08em" }}>
                ARABIC TRANSLATION · ترجمة عربية
              </label>
              {output && (
                <button onClick={copyOutput} style={{
                  fontSize: "10px",
                  color: copied ? COLORS.green : COLORS.accent,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.06em",
                }}>{copied ? "✓ COPIED" : "COPY"}</button>
              )}
            </div>
            <div
              ref={outputRef}
              style={{
                width: "100%",
                height: "320px",
                background: COLORS.surface,
                border: `1px solid ${output ? COLORS.green + "44" : COLORS.border}`,
                borderRadius: "8px",
                padding: "14px",
                overflowY: "auto",
                fontSize: "15px",
                lineHeight: "2",
                direction: "rtl",
                textAlign: "right",
                fontFamily: "'Amiri', 'Traditional Arabic', 'Arial Unicode MS', serif",
                color: output ? COLORS.text : COLORS.muted,
                boxSizing: "border-box",
                whiteSpace: "pre-wrap",
                transition: "border-color 0.3s",
              }}
            >
              {loading ? (
                <div style={{ direction: "ltr", textAlign: "center", paddingTop: "120px", color: COLORS.muted, fontFamily: "monospace" }}>
                  <div style={{ fontSize: "24px", marginBottom: "12px", animation: "spin 1s linear infinite", display: "inline-block" }}>⟳</div>
                  <div style={{ fontSize: "12px", letterSpacing: "0.1em" }}>TRANSLATING...</div>
                </div>
              ) : output ? output : (
                <div style={{ direction: "ltr", color: COLORS.muted, fontSize: "12px" }}>
                  Arabic translation will appear here...
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            color: "#F85149",
            fontSize: "12px",
            marginBottom: "12px",
            padding: "10px 14px",
            background: "rgba(248,81,73,0.1)",
            border: "1px solid rgba(248,81,73,0.3)",
            borderRadius: "6px",
          }}>{error}</div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={translate}
            disabled={!input.trim() || loading}
            style={{
              flex: 1,
              padding: "14px",
              background: (!input.trim() || loading) ? "rgba(63,185,80,0.2)" : COLORS.green,
              color: (!input.trim() || loading) ? COLORS.muted : "#0D1117",
              border: "none",
              borderRadius: "8px",
              fontSize: "13px",
              fontWeight: "700",
              fontFamily: "inherit",
              letterSpacing: "0.08em",
              cursor: (!input.trim() || loading) ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "TRANSLATING..." : "TRANSLATE TO ARABIC →"}
          </button>
          <button
            onClick={clear}
            style={{
              padding: "14px 20px",
              background: "transparent",
              color: COLORS.muted,
              border: `1px solid ${COLORS.border}`,
              borderRadius: "8px",
              fontSize: "12px",
              fontFamily: "inherit",
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >CLEAR</button>
        </div>

        {/* Tips */}
        <div style={{
          marginTop: "24px",
          padding: "16px",
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: "8px",
          fontSize: "11px",
          color: COLORS.muted,
          lineHeight: "1.9",
        }}>
          <div style={{ color: COLORS.accent, marginBottom: "8px", letterSpacing: "0.08em" }}>💡 TIPS FOR KSA APPLICATION</div>
          <div>→ Translate one document at a time for best accuracy</div>
          <div>→ Always include the document title at the top of your paste</div>
          <div>→ After translating, print and get a notary stamp — costs way less than full translation service</div>
          <div>→ Saudi embassy may accept self-translated docs with notary signature depending on document type</div>
          <div>→ Check the KSA scholarship portal: <span style={{ color: COLORS.accent }}>scholarship.gov.sa</span> for exact requirements</div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Amiri:wght@400;700&display=swap');
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        textarea:focus { border-color: ${COLORS.accent} !important; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 2px; }
      `}</style>
    </div>
  );
}
