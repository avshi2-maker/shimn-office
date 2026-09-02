"use client";

import { Config, LABELS, PRESET_SKETCH, PRESET_PHOTO } from "@/lib/config";

type Props = {
  cfg: Config;
  onChange: (next: Config) => void;
  onReset: () => void;
};

// עדכון עמוק בלי ספריות: set(cfg, "stairs.count", 8)
function set(cfg: Config, path: string, value: unknown): Config {
  const next = structuredClone(cfg) as unknown as Record<string, Record<string, unknown>>;
  const [a, b] = path.split(".");
  next[a][b] = value;
  return next as unknown as Config;
}

function Num({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <div className="row">
        <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} />
        <span className="val">
          {value} {unit}
        </span>
      </div>
    </div>
  );
}

function Sel<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)}>
        {(Object.keys(options) as T[]).map((k) => (
          <option key={k} value={k}>
            {options[k]}
          </option>
        ))}
      </select>
    </div>
  );
}

function Chk({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function Group({
  title,
  on,
  children,
  defaultOpen,
}: {
  title: string;
  on?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details className="group" open={defaultOpen}>
      <summary>
        {title}
        {on !== undefined && <span className={"badge" + (on ? "" : " off")}>{on ? "פעיל" : "כבוי"}</span>}
      </summary>
      <div className="body">{children}</div>
    </details>
  );
}

export default function Menu({ cfg, onChange, onReset }: Props) {
  const u = (path: string) => (v: unknown) => onChange(set(cfg, path, v));

  return (
    <aside className="menu">
      <div className="actions" style={{ marginBottom: 10 }}>
        <button className="btn" onClick={() => onChange(structuredClone(PRESET_SKETCH))} title="מאפס את כל הפרמטרים למה שמצויר בסקיצה 1.jpeg">
          100% לפי הסקיצה
        </button>
        <button className="btn ghost" onClick={() => onChange(structuredClone(PRESET_PHOTO))} title="לפי תמונה 2 + סימון 1·2·3">
          לפי תמונה 2
        </button>
        <button className="btn ghost" onClick={onReset}>
          איפוס
        </button>
      </div>

      <Group title="כללי — סגנון ומצלמה" defaultOpen>
        <Sel label="סוג אבן (לכל הקירות)" value={cfg.global.stone} options={LABELS.stone} onChange={u("global.stone")} />
        <Sel label="פוגה (מישקים)" value={cfg.global.mortar} options={LABELS.mortar} onChange={u("global.mortar")} />
        <Sel label="זווית צילום" value={cfg.global.camera} options={LABELS.camera} onChange={u("global.camera")} />
        <Sel label="תאורה" value={cfg.global.time} options={LABELS.time} onChange={u("global.time")} />
        <Sel label="סוג תוצר" value={cfg.global.realism} options={LABELS.realism} onChange={u("global.realism")} />
        <div className="field">
          <label>הערות חופשיות לפרומפט (אנגלית מומלץ)</label>
          <textarea rows={2} value={cfg.global.notes} onChange={(e) => u("global.notes")(e.target.value)} />
        </div>
      </Group>

      <Group title="הבית (רקע קבוע)" on={cfg.house.show}>
        <Chk label="הצג בית" value={cfg.house.show} onChange={u("house.show")} />
        <Num label="גובה פס אבן בחזית" value={cfg.house.claddingBandH} min={0.6} max={2.5} step={0.1} unit="מ'" onChange={u("house.claddingBandH")} />
        <Chk label="אדנית אבן מתחת לחלון" value={cfg.house.windowPlanter} onChange={u("house.windowPlanter")} />
        <Chk label="אדנית ארוכה + מעקה סורג לאורך הבית (סקיצה)" value={cfg.house.railPlanter} onChange={u("house.railPlanter")} />
        <Chk label="חלון מרתף מאחורי קיר הבסיס (סקיצה)" value={cfg.house.basementWindow} onChange={u("house.basementWindow")} />
      </Group>

      <Group title="חומת בסיס לאורך הבית" on={cfg.baseWall.on} defaultOpen>
        <Chk label="פעיל" value={cfg.baseWall.on} onChange={u("baseWall.on")} />
        <Num label="גובה" value={cfg.baseWall.h} min={0.4} max={2.5} step={0.1} unit="מ'" onChange={u("baseWall.h")} />
        <Chk label='"עד לסוף הקיר" — לכל אורך חזית הבית' value={cfg.baseWall.fullLength} onChange={u("baseWall.fullLength")} />
        {!cfg.baseWall.fullLength && (
          <Num label="אורך" value={cfg.baseWall.len} min={2} max={12} step={0.5} unit="מ'" onChange={u("baseWall.len")} />
        )}
        <Chk label="קופינג (כיסוי עליון)" value={cfg.baseWall.cap} onChange={u("baseWall.cap")} />
      </Group>

      <Group title="מדרגות (אלמנט 2 ✓)" on={cfg.stairs.on} defaultOpen>
        <Chk label="פעיל" value={cfg.stairs.on} onChange={u("stairs.on")} />
        <Num label="מספר מדרגות" value={cfg.stairs.count} min={3} max={16} step={1} unit="" onChange={u("stairs.count")} />
        <Num label="רוחב" value={cfg.stairs.width} min={0.8} max={2.5} step={0.1} unit="מ'" onChange={u("stairs.width")} />
        <Num label="רום (גובה מדרגה)" value={cfg.stairs.riser} min={12} max={20} step={1} unit='ס"מ' onChange={u("stairs.riser")} />
        <Num label="שלח (עומק מדרגה)" value={cfg.stairs.tread} min={26} max={40} step={1} unit='ס"מ' onChange={u("stairs.tread")} />
        <Sel label="חומר" value={cfg.stairs.material} options={LABELS.stairMaterial} onChange={u("stairs.material")} />
        <Sel label="צד ברחבה" value={cfg.stairs.side} options={LABELS.side} onChange={u("stairs.side")} />
        <Sel label="כיוון העלייה" value={cfg.stairs.direction} options={LABELS.direction} onChange={u("stairs.direction")} />
        <Chk label="קיר בטון חשוף לצד המדרגות" value={cfg.stairs.sideWall} onChange={u("stairs.sideWall")} />
        <Chk label="פודסט + דלת כניסה בראש המדרגות" value={cfg.stairs.landing} onChange={u("stairs.landing")} />
      </Group>

      <Group title="קיר אבן גבוה ישר (תמונה 2 — לא בסקיצה)" on={cfg.tallWall.on}>
        <Chk label="פעיל" value={cfg.tallWall.on} onChange={u("tallWall.on")} />
        <Num label="גובה" value={cfg.tallWall.h} min={1} max={4} step={0.1} unit="מ'" onChange={u("tallWall.h")} />
        <Num label="אורך" value={cfg.tallWall.len} min={1} max={8} step={0.5} unit="מ'" onChange={u("tallWall.len")} />
        <Num label="עובי" value={cfg.tallWall.thickness} min={20} max={60} step={5} unit='ס"מ' onChange={u("tallWall.thickness")} />
        <Chk label="כיסוי עליון" value={cfg.tallWall.cap} onChange={u("tallWall.cap")} />
      </Group>

      <Group title="קיר תומך מעוגל (סקיצה)" on={cfg.curvedWall.on} defaultOpen>
        <Chk label="פעיל" value={cfg.curvedWall.on} onChange={u("curvedWall.on")} />
        <Num label="גובה" value={cfg.curvedWall.h} min={0.4} max={2} step={0.1} unit="מ'" onChange={u("curvedWall.h")} />
        <Num label="רדיוס" value={cfg.curvedWall.radius} min={1} max={8} step={0.5} unit="מ'" onChange={u("curvedWall.radius")} />
        <Num label="קשת" value={cfg.curvedWall.arc} min={30} max={180} step={5} unit="°" onChange={u("curvedWall.arc")} />
        <Chk label="פס חצץ לאורך ראש הקיר" value={cfg.curvedWall.gravelStrip} onChange={u("curvedWall.gravelStrip")} />
      </Group>

      <Group title='אבני מדרך למדרכה — "3 מדרגות" (סקיצה)' on={cfg.steppingStones.on} defaultOpen>
        <Chk label="פעיל" value={cfg.steppingStones.on} onChange={u("steppingStones.on")} />
        <Num label="מספר אבנים" value={cfg.steppingStones.count} min={1} max={6} step={1} unit="" onChange={u("steppingStones.count")} />
      </Group>

      <Group title="רחבה מרוצפת" on={cfg.patio.on}>
        <Chk label="פעיל" value={cfg.patio.on} onChange={u("patio.on")} />
        <Num label="רוחב (בסקיצה 5.6–6)" value={cfg.patio.width} min={3} max={10} step={0.1} unit="מ'" onChange={u("patio.width")} />
        <Num label="עומק" value={cfg.patio.depth} min={2} max={8} step={0.5} unit="מ'" onChange={u("patio.depth")} />
        <Sel label="ריצוף" value={cfg.patio.paving} options={LABELS.paving} onChange={u("patio.paving")} />
      </Group>

      <Group title="טרסת גינה שמאל (תמונה 2 — לא בסקיצה)" on={cfg.gardenTerrace.on}>
        <Chk label="פעיל (צמוד לקיר הבית)" value={cfg.gardenTerrace.on} onChange={u("gardenTerrace.on")} />
        <Num label="גובה" value={cfg.gardenTerrace.h} min={0.4} max={1.5} step={0.1} unit="מ'" onChange={u("gardenTerrace.h")} />
        <Num label="אורך" value={cfg.gardenTerrace.len} min={2} max={8} step={0.5} unit="מ'" onChange={u("gardenTerrace.len")} />
        <Chk label="נטיעה" value={cfg.gardenTerrace.planting} onChange={u("gardenTerrace.planting")} />
      </Group>
    </aside>
  );
}
