# learn-business-chinese-advanced-with-phoebe - source map

Internal build document. Not linked from any audience-facing page.

Bucket `comm`, difficulty 3, audience both, 6 sessions, single track, no code.

**Shared facts, tiers, the "never print" list and the gloss rule live in ONE place:**
`learn-business-chinese-basic-with-phoebe/materials/official-course-map.md`. Never restate or fork
them here. The gloss word list is `learn-business-chinese-basic-with-phoebe/materials/gloss.py`;
Advanced pages are glossed with it (add terms there, once).

Built 2026-10-05.

---

## Scope

Roughly the 2021 standard's intermediate stage (levels 4 to 5) plus the BCT business test's
territory: register, formal writing, presenting numbers, negotiation and face, business dining.
Same running case as Basic: Lumen Logistics and its Shanghai distributor, now negotiating.

## Facts only this course uses (tiers from the 2026-10-05 check)

| Fact | Tier | Use |
|---|---|---|
| 同比 (tóngbǐ): compared with the same period of the previous year; 环比 (huánbǐ): compared with the adjacent previous period (National Bureau of Statistics, 同比与环比有何不同) | Primary | session 4 |
| 您 (nín, you, polite); 贵公司 / 贵司 (guì gōngsī / guì sī, your company) as polite forms | Secondary (dictionaries) | sessions 1, 3 |
| 此致 敬礼 (cǐzhì jìnglǐ) as a formal letter closing: a widely observed convention. **GB/T 9704-2012 does not contain it and does not govern business letters** | Convention, unverified as a standard | session 2 says "convention" |
| Face (面子 miànzi) in negotiation: Graham and Lam, "The Chinese Negotiation", Harvard Business Review, Oct 2003 ("a broken promise or display of anger or aggression causes mutual loss of face"). Hwang 1987, "Face and Favor: The Chinese Power Game", AJS 92(4), 944-974, is about social exchange, not negotiation; cite it only for that | Primary for both citations; Hwang's argument not read | session 5 |
| BCT (A), BCT (B), BCT (oral) | Primary (CTI brochure) | landing |

## The bench (`assets/register-live.js`)

A printed list of 43 markers (casual, formal, over-formal) with weights; index = 47 + 2.1 ×
(formal + 1.6 × over-formal − casual) / √(characters / 30), clamped to 0-100; fit = 100 inside the
channel's band, minus 3 per point outside. Bands: formal email 70-92, WeChat to a partner's manager
42-68, chat to a colleague 12-40. Five constructed drafts of one message (confirm Thursday 3 pm,
contract attached, look at the price clause).

Canon, verified in node 2026-10-05 (index; fit for email / WeChat / colleague):

| Draft | Index | Email | WeChat | Colleague |
|---|---|---|---|---|
| As if to a friend | 14 | 0 | 16 | **100** |
| Translated word for word from English | 38 | 4 | 88 | 100 |
| Polite WeChat | 55 | 55 | **100** | 55 |
| Formal email | 82 | **100** | 58 | 0 |
| ANTI: polish everything (classical phrasing) | 100 | 76 | 4 | 0 |

Checks: adding 哈哈 (hāha, ha ha) to the formal email drops it to index 69 and email fit 97 (the
bench can report a worse number); three swaps on the literal draft (你好 to 王经理您好, 你可以 to
烦请您, drop 吗) lift it to 59, in the WeChat band. Findings: each draft fits one channel, not all;
the word-for-word translation is too casual for WeChat; polishing everything overshoots even a formal
email. The checker cannot judge grammar, meaning or any marker not on its list, and says so.

## Sessions

| # | Title | File |
|---|---|---|
| 1 | Register: the same sentence, three ways | 01-register.html |
| 2 | Formal emails and WeChat | 02-formal-emails-and-wechat.html |
| 3 | The formality checker | 03-the-formality-checker.html |
| 4 | Presenting numbers | 04-presenting-numbers.html |
| 5 | Negotiation and face | 05-negotiation-and-face.html |
| 6 | Business dining, and the capstone | 06-dining-and-capstone.html |

## Design

Palette ink indigo and gold: deep #16294D, primary #1F3A68, mid #2B4C80, soft #C9D4E8, tint #F1F4FA,
ink #111A2B, muted #4B5670, faint #CDD4E2, hairline #E1E6EF, gold #8A6410, gold ink #5E440A, gold
tint #F8F0DD, paper #FCFDFE. 23 pairs checked, lowest 4.87; pair sweep clean.
`PASSPORT_KEY` = `lwp-passport:business-chinese-advanced`.
