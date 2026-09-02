"use client";

import { Config, LABELS } from "@/lib/config";

// שרטוט ביצוע למדרגות + מעקה — חתך צד בקנה מידה גדול + טבלת מידות לקבלן.
const S = 90; // px למטר
const INK = "#1f2937";
const DIM = "#b91c1c";
const CONCRETE = "#d4d4cf";
const RAIL = "#6b5b3e";

export default function StairsDetail({ cfg }: { cfg: Config }) {
  const st = cfg.stairs;
  const rl = cfg.railing;
  const n = st.count;
  const lower = st.split ? Math.min(st.lowerCount, n - 1) : n;
  const upper = n - lower;
  const tr = st.tread / 100;
  const rs = st.riser / 100;
  const land = st.split ? st.midLanding / 100 : 0;
  const runLower = lower * tr;
  const runUpper = upper * tr;
  const runTotal = runLower + land + runUpper;
  const riseLower = lower * rs;
  const riseTotal = n * rs;
  const rh = rl.height / 100;

  const padL = 70;
  const padB = 70;
  const W = runTotal * S + padL + 120;
  const H = (riseTotal + rh) * S + padB + 60;
  const G = H - padB; // קו קרקע
  const x0 = padL;

  // פרופיל המדרגות (עולה מימין לשמאל? לא — כאן עולה משמאל לימין לקריאות הקבלן)
  let d = `M${x0} ${G}`;
  let cx = x0;
  let cy = G;
  const nos: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    cy -= rs * S;
    d += ` V${cy}`;
    nos.push([cx, cy]);
    cx += tr * S;
    d += ` H${cx}`;
    if (st.split && k === lower - 1) {
      cx += land * S;
      d += ` H${cx}`;
    }
  }
  nos.push([cx, cy]);
  d += ` V${G} Z`;

  const postEvery = Math.max(1, Math.round(rl.postSpacing / st.tread));
  const posts = nos.filter((_, i) => i % postEvery === 0 || i === nos.length - 1);

  const Dim = ({ x1, x2, y, label, above }: { x1: number; x2: number; y: number; label: string; above?: boolean }) => (
    <g stroke={DIM} fill={DIM} fontSize="10">
      <path d={`M${x1} ${y} H${x2}`} strokeWidth="0.8" />
      <path d={`M${x1} ${y - 5} V${y + 5} M${x2} ${y - 5} V${y + 5}`} strokeWidth="0.8" />
      <text x={(x1 + x2) / 2} y={above ? y - 5 : y + 13} textAnchor="middle" stroke="none">
        {label}
      </text>
    </g>
  );
  const VDim = ({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) => (
    <g stroke={DIM} fill={DIM} fontSize="10">
      <path d={`M${x} ${y1} V${y2}`} strokeWidth="0.8" />
      <path d={`M${x - 5} ${y1} H${x + 5} M${x - 5} ${y2} H${x + 5}`} strokeWidth="0.8" />
      <text x={x + 6} y={(y1 + y2) / 2 + 4} stroke="none">
        {label}
      </text>
    </g>
  );

  const rows: [string, string][] = [
    ["סה\"כ מדרגות", `${n}`],
    ["רום (גובה מדרגה)", `${st.riser} ס"מ`],
    ["שלח (עומק מדרגה)", `${st.tread} ס"מ`],
    ["רוחב מהלך", `${st.width.toFixed(2)} מ'`],
    ["חומר", LABELS.stairMaterial[st.material]],
    ...(st.split
      ? ([
          ["מהלך תחתון", `${lower} מדרגות · אורך ${runLower.toFixed(2)} מ' · עלייה ${riseLower.toFixed(2)} מ'`],
          ["פודסט ביניים", `${st.midLanding} ס"מ עומק × ${st.width.toFixed(2)} מ' רוחב · מפלס +${riseLower.toFixed(2)}`],
          ["מהלך עליון", `${upper} מדרגות · אורך ${runUpper.toFixed(2)} מ' · עלייה ${(upper * rs).toFixed(2)} מ'`],
        ] as [string, string][])
      : []),
    ["אורך כולל (אופקי)", `${runTotal.toFixed(2)} מ'`],
    ["עלייה כוללת", `${riseTotal.toFixed(2)} מ'`],
    ["בדיקת נוחות 2R+T", `${2 * st.riser + st.tread} ס"מ (מומלץ 60–65)`],
  ];
  const railRows: [string, string][] = rl.on
    ? [
        ["גובה מעקה", `${rl.height} ס"מ מקו האף`],
        ["פרופיל", `פרופיל פלדה מרובע ${rl.profile}×${rl.profile} מ"מ, עובי דופן 2 מ"מ`],
        ["צד הבית", rl.wallPlate ? `פלטת פלדה שטוחה 40×8 מ"מ רציפה, מעוגנת לקיר הבית בברגי עיגון M10 כל 60 ס"מ, מרותכת לזוויתן המדרגות` : "מאחז יד קירי"],
        ["צד חיצוני", `עמודים כל ${rl.postSpacing} ס"מ מעוגנים לדופן המדרגות (${posts.length} עמודים), מאחז עליון + סרגל תחתון`],
        ["מילוי מגן", LABELS.mesh[rl.mesh] + " — פתח מרבי 10 ס\"מ, ללא אפשרות טיפוס"],
        ["גימור", `צביעה בתנור (פאודר) ${LABELS.railColor[rl.color]}`],
      ]
    : [];

  return (
    <div className="detail">
      <div className="sketch-wrap">
        <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg" fontFamily="system-ui, Arial" fontSize="11">
          <text x={W / 2} y={18} textAnchor="middle" fontWeight="700" fontSize="14" fill={INK}>
            חתך מדרגות לביצוע — {st.split ? `${lower} + ${upper} מדרגות עם פודסט` : `${n} מדרגות`} · 1 מ' = {S}px
          </text>

          {/* גוף המדרגות */}
          <path d={d} fill={CONCRETE} stroke={INK} strokeWidth="1.4" />
          {/* קו קרקע */}
          <path d={`M${x0 - 40} ${G} H${W - 20}`} stroke={INK} strokeWidth="1.6" />
          <text x={x0 - 42} y={G - 4} fontSize="10" fill={INK} textAnchor="start">
            ±0.00
          </text>
          {/* קיר הבית בקצה העליון */}
          <rect x={cx} y={cy - rh * S - 30} width={14} height={G - cy + rh * S + 30} fill="#eee" stroke={INK} strokeWidth="1" />
          <text x={cx + 7} y={cy - rh * S - 36} textAnchor="middle" fontSize="9" fill={INK}>
            קיר הבית
          </text>

          {/* מעקה */}
          {rl.on && (
            <g stroke={RAIL} fill="none">
              <path d={nos.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px} ${py - rh * S}`).join(" ")} strokeWidth="2.2" />
              <path d={nos.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px} ${py - 0.1 * S}`).join(" ")} strokeWidth="1.2" />
              {posts.map(([px, py], i) => (
                <path key={i} d={`M${px} ${py} V${py - rh * S}`} strokeWidth="2" />
              ))}
              {/* רשת מגן — סימון */}
              {nos.slice(0, -1).map(([px, py], i) => {
                const [nx, ny] = nos[i + 1];
                return (
                  <path
                    key={"m" + i}
                    d={`M${px} ${py - 0.1 * S} L${nx} ${ny - rh * S + 0.1 * S} M${px} ${py - rh * S + 0.1 * S} L${nx} ${ny - 0.1 * S}`}
                    strokeWidth="0.5"
                    strokeDasharray="3 2"
                  />
                );
              })}
              <text x={nos[Math.floor(nos.length / 2)][0]} y={nos[Math.floor(nos.length / 2)][1] - rh * S - 8} textAnchor="middle" fontSize="10" fill={RAIL} stroke="none">
                מעקה {rl.height} ס"מ · פרופיל {rl.profile} · {LABELS.mesh[rl.mesh].split(" —")[0]}
              </text>
            </g>
          )}

          {/* מידות אופקיות */}
          <Dim x1={x0} x2={x0 + runLower * S} y={G + 22} label={`${lower}×${st.tread} = ${(runLower * 100).toFixed(0)} ס"מ`} />
          {st.split && (
            <>
              <Dim x1={x0 + runLower * S} x2={x0 + (runLower + land) * S} y={G + 22} label={`פודסט ${st.midLanding}`} />
              <Dim x1={x0 + (runLower + land) * S} x2={x0 + runTotal * S} y={G + 22} label={`${upper}×${st.tread} = ${(runUpper * 100).toFixed(0)} ס"מ`} />
            </>
          )}
          <Dim x1={x0} x2={x0 + runTotal * S} y={G + 46} label={`סה"כ ${runTotal.toFixed(2)} מ'`} />

          {/* מידות אנכיות */}
          <VDim x={x0 - 22} y1={G} y2={G - riseLower * S} label={`${lower}×${st.riser} = ${(riseLower * 100).toFixed(0)}`} />
          {st.split && <VDim x={x0 - 22} y1={G - riseLower * S} y2={G - riseTotal * S} label={`${upper}×${st.riser} = ${(upper * rs * 100).toFixed(0)}`} />}
          <VDim x={x0 - 50} y1={G} y2={G - riseTotal * S} label={`${riseTotal.toFixed(2)} מ'`} />

          {/* פרט מדרגה אחת */}
          <g transform={`translate(${x0 + 40} 40)`} fontSize="9" fill={INK}>
            <path d={`M0 ${rs * S * 1.6} V0 H${tr * S * 1.6}`} fill="none" stroke={INK} strokeWidth="1.2" />
            <text x={-4} y={(rs * S * 1.6) / 2} textAnchor="end">
              רום {st.riser}
            </text>
            <text x={(tr * S * 1.6) / 2} y={-4} textAnchor="middle">
              שלח {st.tread}
            </text>
            <text x={0} y={rs * S * 1.6 + 14}>
              פרט מדרגה (ס"מ)
            </text>
          </g>
        </svg>
      </div>

      <div className="spec">
        <table>
          <thead>
            <tr>
              <th colSpan={2}>מדרגות</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
          {rl.on && (
            <>
              <thead>
                <tr>
                  <th colSpan={2}>מעקה בטיחות (שני צדדים)</th>
                </tr>
              </thead>
              <tbody>
                {railRows.map(([k, v]) => (
                  <tr key={k}>
                    <td>{k}</td>
                    <td>{v}</td>
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
      </div>
    </div>
  );
}
