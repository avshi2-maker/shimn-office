"use client";

import { useEffect, useMemo, useState } from "react";
import { Config, DEFAULT, buildPrompt, buildSummary } from "@/lib/config";
import Menu from "@/components/Menu";
import Sketch from "@/components/Sketch";

const KEY = "shimn-office-cfg-v1";

export default function Page() {
  const [cfg, setCfg] = useState<Config>(DEFAULT);
  const [copied, setCopied] = useState(false);

  // טעינה/שמירה מקומית בדפדפן
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<Config>;
        const merged = structuredClone(DEFAULT) as unknown as Record<string, object>;
        for (const k of Object.keys(merged)) {
          const sv = (saved as Record<string, object>)[k];
          if (sv && typeof sv === "object") merged[k] = { ...merged[k], ...sv };
        }
        setCfg(merged as unknown as Config);
      }
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(cfg));
    } catch {}
  }, [cfg]);

  const prompt = useMemo(() => buildPrompt(cfg), [cfg]);
  const summary = useMemo(() => buildSummary(cfg), [cfg]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // fallback לדפדפנים שחוסמים clipboard API
      const ta = document.createElement("textarea");
      ta.value = prompt;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "shimon-config.json";
    a.click();
  }

  return (
    <div className="app">
      <header className="top">
        <div>
          <h1>משרד שמעון — מתכנן חזית וקירות</h1>
          <div className="sub">שנה פרמטרים בתפריט → הסקיצה והפרומפט מתעדכנים מיד</div>
        </div>
        <div className="actions">
          <button className="btn ghost" onClick={exportJson}>
            ייצוא JSON
          </button>
          <button className="btn" onClick={copy}>
            {copied ? "הועתק ✓" : "העתק פרומפט ל-Nano Banana"}
          </button>
        </div>
      </header>

      <Menu cfg={cfg} onChange={setCfg} onReset={() => setCfg(DEFAULT)} />

      <main className="stage">
        <section className="card">
          <h2>סקיצת תיבות</h2>
          <Sketch cfg={cfg} />
        </section>

        <section className="card">
          <h2>סיכום מידות</h2>
          <div className="summary-grid">
            {summary.map((s) => (
              <div key={s.k}>
                {s.k}
                <b>{s.v}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="card">
          <div className="actions" style={{ justifyContent: "space-between", marginBottom: 8 }}>
            <h2 style={{ margin: 0 }}>פרומפט ל-Nano Banana (Gemini image)</h2>
            <button className="btn" onClick={copy}>
              {copied ? "הועתק ✓" : "העתק הכל"}
            </button>
          </div>
          <p className="hint">
            צרף לפרומפט את התמונות: <b>C</b> = סקיצה (1.jpeg) — קובעת את הקומפוזיציה, <b>A</b> = מצב קיים (3.jpeg), <b>B</b> = רפרנס חומרים (2.jpeg).
          </p>
          <div className="prompt-box">{prompt}</div>
        </section>

        <section className="card">
          <h2>תמונות רפרנס</h2>
          <div className="refs">
            <figure>
              <img src="/ref/1.jpeg" alt="סקיצה" />
              <figcaption>C — סקיצת שמעון</figcaption>
            </figure>
            <figure>
              <img src="/ref/2.jpeg" alt="רפרנס" />
              <figcaption>B — רפרנס סגנון</figcaption>
            </figure>
            <figure>
              <img src="/ref/3.jpeg" alt="מצב קיים" />
              <figcaption>A — מצב קיים</figcaption>
            </figure>
            <figure>
              <img src="/ref/4.jpeg" alt="מצב קיים צד" />
              <figcaption>A2 — מצב קיים (צד)</figcaption>
            </figure>
            <figure>
              <img src="/ref/5.jpeg" alt="סימון אלמנטים" />
              <figcaption>סימון אלמנטים 1·2·3</figcaption>
            </figure>
          </div>
        </section>
      </main>
    </div>
  );
}
