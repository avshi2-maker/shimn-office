// מודל הפרמטרים של הפרויקט — מקור אמת יחיד.
// כל תיבה בסקיצה + כל שדה בתפריט + הפרומפט נגזרים מהאובייקט הזה.

export type StoneType = "jerusalem_gold" | "jerusalem_gray" | "galilee_rough" | "cut_ashlar";
export type Paving = "concrete_slabs" | "natural_stone" | "gravel" | "exposed_concrete";
export type StairMaterial = "concrete" | "stone_clad" | "stone_slabs";
export type Side = "right" | "left";
export type Camera = "front" | "front_low" | "three_quarter" | "sketch_iso";
export type TimeOfDay = "morning" | "noon" | "golden" | "overcast";

export interface Config {
  global: {
    stone: StoneType;
    mortar: "light" | "dark" | "raked";
    camera: Camera;
    time: TimeOfDay;
    realism: "photo" | "render" | "sketch";
    notes: string;
  };
  house: {
    show: boolean;
    claddingBandH: number; // גובה פס אבן בחזית הבית (מ')
    windowPlanter: boolean; // אדנית מתחת לחלון
  };
  baseWall: {
    on: boolean;
    h: number; // גובה (מ')
    len: number; // אורך (מ')
    cap: boolean; // קופינג עליון
  };
  stairs: {
    on: boolean;
    count: number;
    width: number; // מ'
    riser: number; // ס"מ
    tread: number; // ס"מ
    material: StairMaterial;
    side: Side; // מיקום ביחס לרחבה
    sideWall: boolean; // קיר בטון חשוף לצד המדרגות (ref #2)
  };
  tallWall: {
    on: boolean;
    h: number;
    len: number;
    cap: boolean;
    thickness: number; // ס"מ
  };
  curvedWall: {
    on: boolean;
    h: number;
    radius: number; // מ'
    arc: number; // מעלות
  };
  patio: {
    on: boolean;
    width: number; // 5.6–6 לפי הסקיצה
    depth: number;
    paving: Paving;
  };
  gardenTerrace: {
    on: boolean; // אלמנט 1 בתמונה 5 — סומן X
    h: number;
    len: number;
    planting: boolean;
  };
}

export const DEFAULT: Config = {
  global: {
    stone: "jerusalem_gold",
    mortar: "light",
    camera: "front",
    time: "morning",
    realism: "photo",
    notes: "",
  },
  house: { show: true, claddingBandH: 1.2, windowPlanter: true },
  baseWall: { on: true, h: 1.0, len: 6.0, cap: true },
  // נתוני שמעון: אורך מדרגות 4 מ' (13×30 ס"מ), רוחב 5.6–6 מ', עובי חומה 40 ס"מ,
  // פרטים 1-2-3 נשארים וצמודים לקיר הבית.
  stairs: {
    on: true,
    count: 13,
    width: 1.2,
    riser: 16,
    tread: 30,
    material: "concrete",
    side: "right",
    sideWall: true,
  },
  tallWall: { on: true, h: 2.6, len: 3.0, cap: true, thickness: 40 },
  curvedWall: { on: true, h: 1.0, radius: 3.0, arc: 90 },
  patio: { on: true, width: 5.8, depth: 4.0, paving: "concrete_slabs" },
  gardenTerrace: { on: true, h: 0.8, len: 4.0, planting: true },
};

export const LABELS = {
  stone: {
    jerusalem_gold: "אבן ירושלמית זהובה (פראית)",
    jerusalem_gray: "אבן ירושלמית אפורה",
    galilee_rough: "אבן גליל גסה",
    cut_ashlar: "אבן מסותתת (גזית)",
  } as Record<StoneType, string>,
  paving: {
    concrete_slabs: "אריחי בטון 60×60",
    natural_stone: "אבן טבעית",
    gravel: "חצץ",
    exposed_concrete: "בטון מוחלק",
  } as Record<Paving, string>,
  stairMaterial: {
    concrete: "בטון חשוף",
    stone_clad: "בטון בחיפוי אבן",
    stone_slabs: "פלטות אבן",
  } as Record<StairMaterial, string>,
  camera: {
    front: "חזית ישרה (כמו תמונה 2)",
    front_low: "חזית מנקודת מבט נמוכה",
    three_quarter: "שלושת-רבעי",
    sketch_iso: "איזומטרי כמו הסקיצה",
  } as Record<Camera, string>,
  time: {
    morning: "בוקר, שמש רכה",
    noon: "צהריים",
    golden: "שעת זהב",
    overcast: "מעונן",
  } as Record<TimeOfDay, string>,
  mortar: { light: "בהיר", dark: "כהה", raked: "שקוע" },
  realism: { photo: "צילום פוטו-ריאליסטי", render: "רנדר אדריכלי", sketch: "סקיצה בעיפרון" },
  side: { right: "ימין", left: "שמאל" },
};

// ---------- English text for the image model ----------
const EN = {
  stone: {
    jerusalem_gold: "golden Jerusalem limestone, irregular rubble (fieldstone) pattern",
    jerusalem_gray: "gray Jerusalem limestone, irregular rubble pattern",
    galilee_rough: "rough Galilee limestone, large irregular blocks",
    cut_ashlar: "cut ashlar limestone, coursed rectangular blocks",
  } as Record<StoneType, string>,
  paving: {
    concrete_slabs: "large light-gray concrete paving slabs 60x60 cm",
    natural_stone: "natural stone paving",
    gravel: "compacted gravel",
    exposed_concrete: "smooth troweled concrete",
  } as Record<Paving, string>,
  stairMaterial: {
    concrete: "exposed board-formed concrete",
    stone_clad: "concrete clad with matching limestone",
    stone_slabs: "solid limestone slab treads",
  } as Record<StairMaterial, string>,
  mortar: { light: "light mortar joints", dark: "dark recessed mortar joints", raked: "deeply raked joints" },
  camera: {
    front: "straight-on front elevation from street level",
    front_low: "front view from a low camera height on the street",
    three_quarter: "three-quarter view from the street corner",
    sketch_iso: "isometric bird's-eye view, matching the hand sketch",
  } as Record<Camera, string>,
  time: {
    morning: "soft morning sunlight, clear blue sky",
    noon: "bright midday sun, short shadows",
    golden: "warm golden-hour light",
    overcast: "soft overcast diffuse light",
  } as Record<TimeOfDay, string>,
  realism: {
    photo: "photorealistic architectural photograph, 35mm lens, high detail",
    render: "clean architectural visualization render",
    sketch: "pencil architectural sketch on paper",
  },
};

export function buildPrompt(c: Config): string {
  const s = EN.stone[c.global.stone];
  const lines: string[] = [];

  lines.push(
    `${EN.realism[c.global.realism]}. ${EN.camera[c.global.camera]}, ${EN.time[c.global.time]}.`
  );
  lines.push(
    `Use the attached photos as reference: photo A is the CURRENT SITE (excavated slope with rubble, exposed foundation of a white two-story house with a limestone cladding band). Photos B/C are the target STYLE reference. Keep the house, roof, windows, trees and street exactly as in photo A; rebuild only the front landscape as described below.`
  );

  const parts: string[] = [];

  if (c.house.show) {
    parts.push(
      `House facade: white plaster, dark brown roof fascia, limestone cladding band about ${c.house.claddingBandH.toFixed(1)} m high at the base of the ground floor` +
        (c.house.windowPlanter ? ", stone planter box under the main window with ornamental grasses" : "") +
        "."
    );
  }

  if (c.baseWall.on) {
    parts.push(
      `Base retaining wall along the house: ${s}, ${EN.mortar[c.global.mortar]}, about ${c.baseWall.h.toFixed(1)} m high and ${c.baseWall.len.toFixed(1)} m long` +
        (c.baseWall.cap ? ", flat stone coping on top" : "") +
        "."
    );
  }

  if (c.stairs.on) {
    parts.push(
      `Straight outdoor staircase on the ${c.stairs.side} side of the patio, attached to the house wall, going up to the house entrance level: ${c.stairs.count} steps over a ${((c.stairs.count * c.stairs.tread) / 100).toFixed(1)} m run, ${c.stairs.width.toFixed(1)} m wide, ${c.stairs.riser} cm risers, ${c.stairs.tread} cm treads, made of ${EN.stairMaterial[c.stairs.material]}` +
        (c.stairs.sideWall ? ", with an exposed board-formed concrete cheek wall on the open side" : "") +
        "."
    );
  }

  if (c.tallWall.on) {
    parts.push(
      `Tall boundary wall next to the stairs: ${s}, about ${c.tallWall.h.toFixed(1)} m high, ${c.tallWall.len.toFixed(1)} m long, ${c.tallWall.thickness} cm thick` +
        (c.tallWall.cap ? ", with a flat stone cap" : "") +
        "."
    );
  }

  if (c.curvedWall.on) {
    parts.push(
      `Low curved retaining wall following the street corner: ${s}, about ${c.curvedWall.h.toFixed(1)} m high, radius about ${c.curvedWall.radius.toFixed(1)} m sweeping ${c.curvedWall.arc} degrees, with a gravel strip behind it.`
    );
  }

  if (c.patio.on) {
    parts.push(
      `Ground-level patio in front of the house: ${c.patio.width.toFixed(1)} m wide by ${c.patio.depth.toFixed(1)} m deep, paved with ${EN.paving[c.patio.paving]}, flush with the sidewalk.`
    );
  }

  if (c.gardenTerrace.on) {
    parts.push(
      `Stepped garden terrace on the left, attached to the house wall: ${s}, ${c.gardenTerrace.h.toFixed(1)} m high, ${c.gardenTerrace.len.toFixed(1)} m long` +
        (c.gardenTerrace.planting ? ", planted with Mediterranean shrubs, lavender and gravel mulch" : "") +
        "."
    );
  } else {
    parts.push(`Do NOT add a stepped garden terrace or planter walls on the left side; keep that area as a simple level surface.`);
  }

  lines.push(parts.join(" "));

  if (c.global.notes.trim()) lines.push(`Additional instructions: ${c.global.notes.trim()}`);

  lines.push(
    `Materials must look real and weathered. Keep proportions exactly as specified. No people, no cars, no text, no watermark.`
  );

  return lines.join("\n\n");
}

export function buildSummary(c: Config): { k: string; v: string }[] {
  const out: { k: string; v: string }[] = [];
  out.push({ k: "אבן", v: LABELS.stone[c.global.stone] });
  if (c.baseWall.on) out.push({ k: "קיר בסיס", v: `${c.baseWall.h} מ' × ${c.baseWall.len} מ'` });
  if (c.stairs.on)
    out.push({
      k: "מדרגות",
      v: `${c.stairs.count} × ${c.stairs.riser}/${c.stairs.tread} ס"מ · רוחב ${c.stairs.width} מ' · עלייה ${(
        (c.stairs.count * c.stairs.riser) /
        100
      ).toFixed(2)} מ'`,
    });
  if (c.tallWall.on) out.push({ k: "קיר גבוה", v: `${c.tallWall.h} מ' × ${c.tallWall.len} מ'` });
  if (c.curvedWall.on) out.push({ k: "קיר מעוגל", v: `R${c.curvedWall.radius} מ' · ${c.curvedWall.arc}°` });
  if (c.patio.on) out.push({ k: "רחבה", v: `${c.patio.width} × ${c.patio.depth} מ' · ${LABELS.paving[c.patio.paving]}` });
  out.push({ k: "טרסת גינה (אלמנט 1)", v: c.gardenTerrace.on ? `${c.gardenTerrace.h} מ' × ${c.gardenTerrace.len} מ' · צמוד לבית` : "לא" });
  return out;
}
