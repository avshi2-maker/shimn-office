# Shimn Office — מתכנן חזית וקירות

Next.js 15 · Hebrew RTL · deploy on Vercel (zero config).

## מבנה

| קובץ | תפקיד |
|---|---|
| `lib/config.ts` | **מקור האמת** — כל הפרמטרים (Config), ברירות מחדל, תוויות בעברית, בניית הפרומפט באנגלית |
| `components/Menu.tsx` | תפריט עריכה (סליידרים/בחירות/מתגים) — כל שדה מצביע לנתיב ב-Config |
| `components/Sketch.tsx` | סקיצת תיבות SVG (חזית + תוכנית) שמצוירת ישירות מהפרמטרים |
| `app/page.tsx` | מסך ראשי: תפריט + סקיצה + סיכום + פרומפט + תמונות רפרנס |
| `public/ref/` | 5 תמונות המקור |
| `docs/shimon_data.docx` | נתוני שמעון (אורך מדרגות 4 מ', רוחב 5.6–6, חומה 40 ס"מ) |

## איך מוסיפים פרמטר חדש

1. `lib/config.ts` — הוסף שדה ל-`Config` + ערך ב-`DEFAULT`.
2. `components/Menu.tsx` — הוסף `<Num>` / `<Sel>` / `<Chk>` עם הנתיב `"group.field"`.
3. `lib/config.ts` → `buildPrompt` — הוסף משפט באנגלית.
4. (אופציונלי) `components/Sketch.tsx` — צייר תיבה.

## שימוש

1. שנה פרמטרים בתפריט הימני.
2. לחץ **העתק פרומפט ל-Nano Banana**.
3. ב-Gemini: צרף 3.jpeg (מצב קיים), 2.jpeg (רפרנס), 1.jpeg (סקיצה) + הדבק את הפרומפט.

## Deploy

Vercel → Import `avshi2-maker/shimn-office` → Framework: Next.js → Deploy.
