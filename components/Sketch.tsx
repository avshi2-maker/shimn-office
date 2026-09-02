"use client";

import { Config } from "@/lib/config";

// סקיצת "קופסאות" — חזית (elevation) + תוכנית (plan) קטנה.
// קנה מידה: S פיקסלים למטר. כל תיבה נגזרת ישירות מהפרמטרים.
const S = 46;
const STONE = "#d9c39a";
const STONE_DARK = "#b8a070";
const CONCRETE = "#c9c9c4";
const PLASTER = "#f7f7f5";
const INK = "#374151";

type Box = { x: number; w: number; h: number; fill: string; label: string; dim: string; hatch?: boolean };

export default function Sketch({ cfg }: { cfg: Config }) {
  const rise = cfg.stairs.on ? (cfg.stairs.count * cfg.stairs.riser) / 100 : 0;
  const midLanding = cfg.stairs.split ? cfg.stairs.midLanding / 100 : 0;
  const run = cfg.stairs.on ? (cfg.stairs.count * cfg.stairs.tread) / 100 + midLanding : 0;
  const lower = cfg.stairs.split ? Math.min(cfg.stairs.lowerCount, cfg.stairs.count - 1) : cfg.stairs.count;

  // ---- רצף אופקי של אלמנטים (מטרים) ----
  const seq: Box[] = [];
  if (cfg.gardenTerrace.on)
    seq.push({ x: 0, w: cfg.gardenTerrace.len, h: cfg.gardenTerrace.h, fill: STONE, label: "טרסת גינה 1", dim: `${cfg.gardenTerrace.len}×${cfg.gardenTerrace.h} מ'` });
  const baseLen = cfg.baseWall.fullLength ? Math.max(cfg.baseWall.len, cfg.patio.width) : cfg.baseWall.len;
  if (cfg.baseWall.on)
    seq.push({ x: 0, w: baseLen, h: cfg.baseWall.h, fill: STONE, label: "חומת בסיס", dim: `${cfg.baseWall.fullLength ? "עד לסוף הקיר" : baseLen + " מ'"} × ${cfg.baseWall.h} מ'` });
  const stairsBox: Box | null = cfg.stairs.on
    ? { x: 0, w: run, h: rise, fill: CONCRETE, label: "מדרגות 2", dim: `${cfg.stairs.count}×${cfg.stairs.riser}/${cfg.stairs.tread} · אורך ${run.toFixed(1)} מ'` }
    : null;
  const tallBox: Box | null = cfg.tallWall.on
    ? { x: 0, w: cfg.tallWall.len, h: cfg.tallWall.h, fill: STONE, label: "קיר גבוה 3", dim: `${cfg.tallWall.len}×${cfg.tallWall.h} מ' · ${cfg.tallWall.thickness} ס"מ` }
    : null;

  if (stairsBox) seq.push(stairsBox);
  if (tallBox) seq.push(tallBox);
  if (cfg.stairs.side === "left") seq.reverse();

  let cursor = 0.5;
  for (const b of seq) {
    b.x = cursor;
    cursor += b.w + 0.15;
  }
  const totalW = Math.max(cursor + 0.5, cfg.patio.width + 1);

  const houseH = 6;
  const maxH = Math.max(houseH + Math.max(cfg.baseWall.h, rise), cfg.tallWall.h, 3);
  const W = totalW * S + 40;
  const G = maxH * S + 30; // קו קרקע
  const planH = cfg.patio.on ? cfg.patio.depth * S + 60 : 0;
  const H = G + 70 + planH;

  const houseX = (cfg.baseWall.on ? seq.find((b) => b.label === "חומת בסיס")!.x : 0.5) * S + 20;
  const houseW = ((cfg.baseWall.on ? baseLen : 6) + run) * S;
  const houseBase = G - Math.max(cfg.baseWall.h, rise) * S;

  return (
    <div className="sketch-wrap">
      <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" fontFamily="system-ui, Arial" fontSize="11">
        <defs>
          <pattern id="stone" width="14" height="10" patternUnits="userSpaceOnUse">
            <rect width="14" height="10" fill={STONE} />
            <path d="M0 5 H14 M7 0 V5 M3 5 V10 M11 5 V10" stroke={STONE_DARK} strokeWidth="0.8" fill="none" />
          </pattern>
          <pattern id="pave" width="18" height="18" patternUnits="userSpaceOnUse">
            <rect width="18" height="18" fill="#e5e5e0" />
            <path d="M0 0 H18 V18" stroke="#b9b9b3" strokeWidth="0.8" fill="none" />
          </pattern>
        </defs>

        {/* ---- חזית ---- */}
        <text x={W / 2} y={16} textAnchor="middle" fontWeight="700" fontSize="13" fill={INK}>
          חזית — 1 מ' = {S}px
        </text>

        {cfg.house.show && (
          <g>
            <rect x={houseX} y={houseBase - houseH * S} width={houseW} height={houseH * S} fill={PLASTER} stroke={INK} strokeWidth="1.2" />
            <rect x={houseX} y={houseBase - cfg.house.claddingBandH * S} width={houseW} height={cfg.house.claddingBandH * S} fill="url(#stone)" stroke={INK} strokeWidth="0.8" />
            <rect x={houseX + houseW * 0.1} y={houseBase - houseH * S + 40} width={houseW * 0.25} height={60} fill="#cfe3ee" stroke={INK} strokeWidth="0.8" />
            <rect x={houseX + houseW * 0.55} y={houseBase - houseH * S + 40} width={houseW * 0.3} height={60} fill="#cfe3ee" stroke={INK} strokeWidth="0.8" />
            {cfg.house.windowPlanter && (
              <rect x={houseX + houseW * 0.55} y={houseBase - houseH * S + 100} width={houseW * 0.3} height={22} fill="url(#stone)" stroke={INK} strokeWidth="0.8" />
            )}
            <path d={`M${houseX - 10} ${houseBase - houseH * S} H${houseX + houseW + 10}`} stroke="#5b3a1e" strokeWidth="6" />
            <text x={houseX + houseW / 2} y={houseBase - houseH * S + 28} textAnchor="middle" fill={INK}>
              הבית (קיים)
            </text>
          </g>
        )}

        {seq.map((b, i) => {
          const x = b.x * S + 20;
          const y = G - b.h * S;
          const isStairs = b.label.startsWith("מדרגות");
          return (
            <g key={i}>
              {isStairs ? (
                (() => {
                  const n = cfg.stairs.count;
                  const tr = (cfg.stairs.tread / 100) * S;
                  const rs = (cfg.stairs.riser / 100) * S;
                  const up = cfg.stairs.side === "right"; // עולה לכיוון הבית (שמאלה בציור)
                  const dirX = up ? -1 : 1;
                  let cx = up ? x + b.w * S : x;
                  let cy = G;
                  let d = `M${cx} ${G}`;
                  const nosings: [number, number][] = [];
                  for (let k = 0; k < n; k++) {
                    cy -= rs;
                    d += ` V${cy}`;
                    nosings.push([cx, cy]);
                    cx += dirX * tr;
                    d += ` H${cx}`;
                    if (cfg.stairs.split && k === lower - 1) {
                      cx += dirX * midLanding * S; // פודסט ביניים
                      d += ` H${cx}`;
                    }
                  }
                  nosings.push([cx, cy]);
                  d += ` V${G} Z`;
                  const rh = (cfg.railing.height / 100) * S;
                  return (
                    <g>
                      <path d={d} fill={b.fill} stroke={INK} strokeWidth="1" />
                      {cfg.stairs.split && (
                        <text x={up ? x + b.w * S - (lower * tr + (midLanding * S) / 2) : x + lower * tr + (midLanding * S) / 2} y={G - lower * rs - 4} textAnchor="middle" fontSize="9" fill={INK}>
                          פודסט {cfg.stairs.midLanding}
                        </text>
                      )}
                      {cfg.railing.on && (
                        <g stroke="#7a6a4a" strokeWidth="1.2" fill="none">
                          {/* מאחז עליון עוקב אחרי קו האף */}
                          <path d={nosings.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px} ${py - rh}`).join(" ")} />
                          {/* עמודים לפי מרווח */}
                          {nosings
                            .filter((_, i) => i % Math.max(1, Math.round(cfg.railing.postSpacing / cfg.stairs.tread)) === 0 || i === nosings.length - 1)
                            .map(([px, py], i) => (
                              <path key={i} d={`M${px} ${py} V${py - rh}`} />
                            ))}
                          {/* מילוי רשת — מסומן כקו מקווקו */}
                          <path d={nosings.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px} ${py - rh / 2}`).join(" ")} strokeDasharray="2 3" strokeWidth="0.8" />
                        </g>
                      )}
                    </g>
                  );
                })()
              ) : (
                <rect x={x} y={y} width={b.w * S} height={b.h * S} fill="url(#stone)" stroke={INK} strokeWidth="1.2" />
              )}
              {!isStairs && (cfg.baseWall.cap || cfg.tallWall.cap) && b.label !== "טרסת גינה 1" && (
                <rect x={x - 2} y={y - 4} width={b.w * S + 4} height={4} fill={STONE_DARK} />
              )}
              <text x={x + (b.w * S) / 2} y={y - 8} textAnchor="middle" fontWeight="700" fill={INK}>
                {b.label}
              </text>
              <text x={x + (b.w * S) / 2} y={y - (b.h * S > 40 ? -16 : 20)} textAnchor="middle" fill="#6b7280" fontSize="10">
                {b.dim}
              </text>
              {/* קו מידה תחתון */}
              <path d={`M${x} ${G + 14} H${x + b.w * S}`} stroke={INK} strokeWidth="0.8" markerStart="url(#t)" />
              <path d={`M${x} ${G + 10} V${G + 18} M${x + b.w * S} ${G + 10} V${G + 18}`} stroke={INK} strokeWidth="0.8" />
              <text x={x + (b.w * S) / 2} y={G + 30} textAnchor="middle" fontSize="10" fill={INK}>
                {b.w.toFixed(1)} מ'
              </text>
            </g>
          );
        })}

        {/* קו קרקע */}
        <path d={`M10 ${G} H${W - 10}`} stroke={INK} strokeWidth="1.5" />
        <text x={W - 12} y={G - 4} textAnchor="end" fontSize="10" fill="#6b7280">
          ±0.00 רחבה / מדרכה
        </text>

        {/* ---- תוכנית ---- */}
        {cfg.patio.on && (
          <g transform={`translate(100 ${G + 60})`}>
            <text x={(W - 40) / 2} y={-6} textAnchor="middle" fontWeight="700" fontSize="13" fill={INK}>
              תוכנית — רחבה {cfg.patio.width} × {cfg.patio.depth} מ'
            </text>
            <rect x={0} y={0} width={cfg.patio.width * S} height={cfg.patio.depth * S} fill="url(#pave)" stroke={INK} strokeWidth="1.2" />
            {/* קו הבית בחלק העליון */}
            <path d={`M0 0 H${cfg.patio.width * S}`} stroke="#5b3a1e" strokeWidth="4" />
            <text x={(cfg.patio.width * S) / 2} y={14} textAnchor="middle" fontSize="10" fill="#5b3a1e">
              קיר הבית
            </text>
            {cfg.stairs.on && (
              <g>
                <rect
                  x={cfg.stairs.side === "right" ? cfg.patio.width * S - run * S : 0}
                  y={0}
                  width={run * S}
                  height={cfg.stairs.width * S}
                  fill={CONCRETE}
                  stroke={INK}
                  strokeWidth="1"
                />
                {Array.from({ length: cfg.stairs.count }).map((_, k) => {
                  const x0 = cfg.stairs.side === "right" ? cfg.patio.width * S - run * S : 0;
                  const off = cfg.stairs.split && k >= lower ? midLanding * S : 0;
                  const xx = x0 + ((k + 1) * cfg.stairs.tread * S) / 100 + off;
                  return <path key={k} d={`M${xx} 0 V${cfg.stairs.width * S}`} stroke={INK} strokeWidth="0.5" />;
                })}
                <text x={cfg.stairs.side === "right" ? cfg.patio.width * S - (run * S) / 2 : (run * S) / 2} y={cfg.stairs.width * S + 12} textAnchor="middle" fontSize="10" fill={INK}>
                  מדרגות {run.toFixed(1)} × {cfg.stairs.width} מ'
                </text>
              </g>
            )}
            {cfg.tallWall.on && (
              <rect
                x={cfg.stairs.side === "right" ? cfg.patio.width * S : -(cfg.tallWall.thickness / 100) * S}
                y={0}
                width={(cfg.tallWall.thickness / 100) * S}
                height={Math.min(cfg.tallWall.len, cfg.patio.depth) * S}
                fill="url(#stone)"
                stroke={INK}
                strokeWidth="1"
              />
            )}
            {cfg.curvedWall.on && (
              <path
                d={(() => {
                  // קשת שמעגלת את פינת הרחבה הרחוקה מהמדרגות (כמו בסקיצה)
                  const r = Math.min(cfg.curvedWall.radius, cfg.patio.depth, cfg.patio.width) * S;
                  const a = (Math.min(cfg.curvedWall.arc, 90) * Math.PI) / 180;
                  const left = cfg.stairs.side === "left";
                  const cx = left ? r : cfg.patio.width * S - r;
                  const cy = cfg.patio.depth * S - r;
                  const dir = left ? -1 : 1;
                  const x1 = cx + dir * r; // נקודה על הדופן הצדדית
                  const y1 = cy;
                  const x2 = cx + dir * r * Math.cos(a);
                  const y2 = cy + r * Math.sin(a);
                  return `M${x1} ${y1} A${r} ${r} 0 0 ${left ? 0 : 1} ${x2} ${y2}`;
                })()}
                fill="none"
                stroke={STONE_DARK}
                strokeWidth="7"
                strokeLinecap="round"
              />
            )}
            {cfg.curvedWall.on && cfg.curvedWall.gravelStrip && (
              <path
                d={(() => {
                  const r = Math.min(cfg.curvedWall.radius, cfg.patio.depth, cfg.patio.width) * S + 8;
                  const a = (Math.min(cfg.curvedWall.arc, 90) * Math.PI) / 180;
                  const left = cfg.stairs.side === "left";
                  const cx = left ? r - 8 : cfg.patio.width * S - r + 8;
                  const cy = cfg.patio.depth * S - r + 8;
                  const dir = left ? -1 : 1;
                  return `M${cx + dir * r} ${cy} A${r} ${r} 0 0 ${left ? 0 : 1} ${cx + dir * r * Math.cos(a)} ${cy + r * Math.sin(a)}`;
                })()}
                fill="none"
                stroke="#9a9a90"
                strokeWidth="4"
                strokeDasharray="1 4"
                strokeLinecap="round"
              />
            )}
            {cfg.curvedWall.on && (
              <text x={cfg.stairs.side === "left" ? 6 : cfg.patio.width * S - 6} y={cfg.patio.depth * S - 8} textAnchor={cfg.stairs.side === "left" ? "start" : "end"} fontSize="10" fill={STONE_DARK}>
                קיר מעוגל R{cfg.curvedWall.radius} · {cfg.curvedWall.arc}°{cfg.curvedWall.gravelStrip ? " · חצץ" : ""}
              </text>
            )}
            {cfg.steppingStones.on &&
              Array.from({ length: cfg.steppingStones.count }).map((_, k) => {
                const left = cfg.stairs.side === "left";
                const bx = left ? -22 - k * 20 : cfg.patio.width * S + 22 + k * 20;
                const by = cfg.patio.depth * S - 30 - k * 16;
                return <ellipse key={k} cx={bx} cy={by} rx={11} ry={7} fill={STONE} stroke={INK} strokeWidth="0.8" />;
              })}
            {cfg.steppingStones.on && (
              <text x={cfg.stairs.side === "left" ? -14 : cfg.patio.width * S + 14} y={cfg.patio.depth * S - 30 - cfg.steppingStones.count * 16} textAnchor="middle" fontSize="9" fill={INK}>
                {cfg.steppingStones.count} אבני מדרך
              </text>
            )}
            <text x={(cfg.patio.width * S) / 2} y={cfg.patio.depth * S + 16} textAnchor="middle" fontSize="10" fill={INK}>
              רוחב {cfg.patio.width} מ' (5.6–6 בסקיצה)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
