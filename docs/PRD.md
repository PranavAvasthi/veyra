# Veyra — Product Requirements

**Tagline:** Know before you trust.  
**Platforms:** iOS and Android · React Native + Expo  
**Design reference:** [Interactive prototype](https://veyra-design-prototype.pranavavasthi44.chatgpt.site/)

This is the product source of truth. Use the prototype for visual direction and `AGENTS.md` for engineering conventions. Prototype scores, accounts, sync, and submissions are demonstrations, not production behavior.

## Product

Veyra helps people inspect suspicious screenshots, messages, links, QR codes, phone numbers, and payment requests before interacting with them. It extracts evidence, identifies risk signals, explains a score, and recommends a safer next action.

Every report answers: **what was detected, where it appeared, why it matters, and what to do next.** The primary audience is everyday smartphone users, including older family members, job seekers, and marketplace shoppers.

## Principles

- Explain calmly; avoid fear, accusations, and technical jargon.
- Scores describe risk signals, not the probability that something is a scam. Never guarantee safety or fraud.
- Core analysis, history, and learning work locally without an account or internet.
- Screenshots stay on-device unless the user separately enables media backup.
- Never automatically open decoded links, authorize payments, read private conversations, access OTPs, or scrape contacts.
- Request permissions only when the relevant feature is used.

## V1 scope

| Area       | Requirements                                                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Entry      | Splash, three onboarding slides, guest/account choice, sign-up, sign-in, password recovery, permission explanation                   |
| Home       | Prominent screenshot CTA, text/link/QR/number shortcuts, up to three actual recent scans, security tip, first-use and offline states |
| Scan       | Image selection/capture and preview, pasted text, URL entry, QR camera/import and decoded preview, phone number entry                |
| Analysis   | On-device OCR, entity extraction, local rules, basic domain similarity, accurate progress, optional online reputation                |
| Reports    | Score, risk label, summary, recommended action, signals, entities, matched evidence, screenshot highlights                           |
| History    | Search, risk filters, bookmarks, saved scans, deletion with confirmation                                                             |
| Learn      | Scam IQ/progress, daily challenge, eight categories, quiz questions, answer explanations, session completion                         |
| Profile    | Guest/signed-in views, account updates, password change, sign-out, account deletion                                                  |
| Settings   | Privacy, notifications, System/Dark/Light appearance, reduced motion, English language, help, about                                  |
| Cloud      | Optional Supabase authentication, summary sync and restore; separately consented screenshot backup                                   |
| Actions    | Report suspicious activity, share a redacted summary, review before sharing full details                                             |
| Resilience | Loading, empty, error, permission-denied, offline, and partial-analysis states                                                       |

Email, UPI IDs, amounts, and claimed brands are extracted from text/images/QR payloads; separate email/UPI entry screens are not required for V1.

Excluded: family collaboration, public feeds/chat/comments, automatic SMS/call interception, browser/desktop apps, video scanning, complex subscriptions, and autonomous AI verdicts. Share extensions, advanced reputation, AI semantics, and regional languages require later scope decisions. No pricing or paywall is defined.

## Navigation and core flows

Four tabs: **Home · History · Learn · Profile**. Home has a large **Scan Screenshot** action opening a method sheet: choose screenshot, take photo, paste text, paste link, scan QR, check number. Detail flows use deeper screens; confirmations use sheets/dialogs.

| Journey          | Flow                                                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| First use        | Splash → onboarding → guest/account choice → permission explanation as appropriate → Home                      |
| Screenshot       | Home → method → select/capture → preview → analysis → report → signal/source evidence                          |
| Text/link/number | Home shortcut → enter/paste → validate → analysis → report                                                     |
| QR               | Camera/import → decode → preview payload → Analyze Safely → report; never open automatically                   |
| History          | Completed scan → local history → search/filter → report → save or confirm deletion                             |
| Learning         | Learn/category → challenge → choose answer → submit → explanation → next question → results                    |
| Reporting        | Report/entity → category and optional details → explicit data-sharing choice → submit → actual acknowledgement |
| Sharing          | Report → redacted preview → native share/copy; full report requires review and consent                         |
| Sync/restore     | Sign in → opt into sync → optional separate media consent; existing backup → restore/skip → local history      |

Returning users reach Home after initialization. Preserve scan identity and context between reports, signals, entities, and evidence. Cancelling input does not create a completed scan. New users must not see fabricated history, IQ, or streaks.

## Scanner and reports

Inputs must validate before analysis. Image preview supports replace, cancel, and optional crop. Text supports paste, clear, count, and explicitly selected educational examples. URL inspection does not navigate to the destination. Phone checks state that a number alone cannot verify identity. QR preview shows decoded URL/UPI/other content and whether it has been analyzed.

The pipeline is acquisition/validation → OCR or QR decode when needed → normalization → entity extraction → local checks → optional online enrichment → scoring/explanation → local persistence. Progress must follow actual work without artificial delays. Missing reputation checks are shown as unavailable/pending, not successful. Unreadable input or failed analysis must not produce a reassuring low score.

| Score  | Stored level | User-facing label |
| ------ | ------------ | ----------------- |
| 0–29   | LOW          | Low Risk          |
| 30–59  | MEDIUM       | Review Carefully  |
| 60–100 | HIGH         | High Risk         |

Show **Risk Score: 82 / 100**, never “82% scam.” Stronger signals at 80+ may be explained without adding a dramatic critical category.

Report order: score/label/count → safe next action → explanation/signals → source evidence → detected entities → secondary save/report/share actions. High-risk advice prioritizes avoiding the supplied link/payment and verifying through an independently sourced official channel. Low risk still includes caution.

Signals include suspicious/lookalike/shortened links, credential requests, OTP/PIN/CVV requests, urgency/threats, upfront fees, payment pressure, impersonation, prize/job/investment patterns, and suspicious QR/UPI requests. Each signal needs actual matched evidence, severity, explanation, and appropriate advice. HTTPS, a familiar logo, or an extracted entity is not proof of trust.

Image evidence uses actual OCR coordinates and source dimensions; mapping must survive resize, orientation, and crop. Signal taps focus the matching region; region taps show its explanation. Missing images retain available text evidence with an explanation. Entity details and Copy must use the selected entity's actual type/value.

Every result includes: **“Veyra identifies risk signals and does not guarantee whether content is legitimate or fraudulent.”**

## Accounts, privacy, and data

Guests can scan, use local history/bookmarks, learn, change preferences, and share summaries. Accounts add optional sync, restore, and linked cloud reporting. Declining authentication never blocks local use. Creating an account does not enable uploads or notifications automatically.

During screen development, typed JSON fixtures flow through async services and hooks into UI. Production uses local SQLite for scans, OCR/evidence, bookmarks, learning progress, preferences, and pending operations; Supabase handles optional auth, cloud metadata, reports, and explicitly enabled media storage. Keep UI independent of storage/engine implementation.

Core resources: User, Scan, Signal, Entity, ScamReport, source evidence, learning session/progress, preferences/consent, and sync operations. Use stable IDs, timestamps, relationships, engine version, and check status. Sensitive source content remains local by default.

History sync primarily covers summaries, scores, levels, categories, timestamps, permitted signals/entities, and settings. Extracted values can still be private. Screenshot backup is a distinct opt-in, off by default. Report-data sharing is a separate per-submission choice, also off by default. Default share summaries exclude original messages, images, and sensitive extracted values.

Deletion, restore, account switching, and consent changes must not silently lose unsynced work, expose another account's data, resurrect deleted scans, or upload after consent is revoked. Reporting success requires real acknowledgement; queued operations must be described as queued. Policies, terms, support destinations, and diagnostic disclosures must match the implemented services.

## Learning and preferences

Learning categories: Banking/KYC, UPI/Payments, Jobs, Investment, Delivery, Government impersonation, Social media, Marketplace. Provide category-specific guides and fictional practice messages. Quiz submission is explicit; explain both correct and incorrect answers without shame. Progress persists locally and remains distinct from risk scores.

Appearance supports System, Dark, Light and reduced motion. English is V1; accommodate longer future translations. Notification preferences cover security tips, trend alerts, account/security updates, and learning reminders, separately from OS permission. Privacy controls distinguish clear history, clear OCR cache, sync, media backup, and optional diagnostics.

## Design and quality

Premium, calm consumer utility: shield/V radar identity, deep navy, restrained cyan/blue, rounded surfaces, clear hierarchy, generous whitespace. Preserve the prototype's intent while correcting its History/quiz horizontal overflow and light-mode IQ contrast.

Use existing Manrope family classes, semantic palettes from `src/theme/color.ts`, and the conventions in `AGENTS.md`. Reference size is 390 × 844; adapt to small/large devices, safe areas, keyboard, and enlarged text. Minimum touch targets are 44pt. Risk always has text/icons as well as color.

Motion supports scanning, report reveal, evidence focus, and press feedback. Respect reduced motion; never delay actual results or rely on animation/haptics alone. Handle every resource's loading/error/empty states and every input's invalid/denied/cancelled states. Core local use remains available during network/session failures.

Before completion: validate both themes, accessibility, responsive layout, real per-scan relationships, persistence/consent boundaries, and relevant failure paths. Run lint and typecheck. Production detection additionally needs representative accuracy evaluation, real OCR geometry, and end-to-end sync/deletion checks.

## Decisions to resolve before dependent integration

- Final first-run routing, auth providers, password/verification/recovery policies.
- OCR/QR package, image/text limits, supported formats, phone normalization and regions.
- Scoring weights/aggregation, contextual rules, coverage semantics, and accuracy targets.
- Reputation provider, phone-check capability, freshness, and online data consent.
- Anonymous guest reporting, submission payload/status, and offline queue behavior.
- Cloud field allowlist/redaction, guest import, account-local ownership, merge/conflicts, and deletion scope.
- Screenshot opt-in coverage, opt-out consequences, retention, and cloud-media deletion.
- Scam IQ/streak formula, challenge rotation, replay, and progress rules.
- Analysis cancellation/background recovery, notification delivery, support/legal copy, and full-report/link sharing policy.

Build shared theme/font/safe-area primitives first, then Home/entry, scan inputs, analysis/reports/evidence, history/privacy, learning, and profile/settings. Integrate the real local engine/persistence and optional cloud behind the same service boundaries. Update this document when product decisions change.
