# Selfietail implementation plan

## Product scope

Selfietail is a free, English-only social community for dog and cat owners, delivered on iOS, Android, and a read-only public web experience.

Members can create a profile and pet profiles; follow other members; publish one-photo posts with captions, tags, and pet tags; like, comment, direct-message, report, and block. The four mobile tabs are **Home**, **Messages**, **Explore**, and **Profile**.

The app also supports user-created groups and opt-in AI resemblance challenges. Health/medical pet features, video, and events are out of scope for v1.

## Technology decisions

| Area | Decision |
| --- | --- |
| Client | React Native with Expo SDK 57 and Expo Router |
| Navigation | SDK 57 `expo-router/unstable-native-tabs` on mobile; a platform-specific web layout |
| Styling | NativeWind, pinned to a stable Expo 57-compatible release |
| Backend | Convex |
| Authentication | Clerk: email/password, Apple, and Google |
| AI scoring | Gemini, invoked only from secure backend actions |
| Automated moderation | Dedicated text/image moderation provider (vendor still to select) |
| Push | Expo notifications, with global opt-out |
| Public web | Read/search-only pages for public content |

Before implementation, validate every dependency against the exact Expo SDK 57 documentation. Do not use NativeWind v5 while it is pre-release.

## Membership, privacy, and safety

- Signup collects a private date of birth and blocks users under 17.
- Signup requires acceptance of Terms of Service, Privacy Policy, and Community Guidelines.
- Visibility has three levels:
  - **Private:** mutual follows only.
  - **Members:** signed-in members only; the default.
  - **Everybody:** accessible on the public web after explicit warning and confirmation.
- A profile default and per-post/per-group-post override control visibility. An override must not make a post more public accidentally.
- Anonymous visitors can read and search public content only. They cannot interact or access member/private content.
- Public browsing requires bot filtering and separate anonymous-view counting.
- All text and image uploads are screened before public release. Members can report and block. Moderation evidence is retained according to the deletion/review policy.

## Core data model

Create Convex tables and indexes for:

- `users`, `userSettings`, `policyAcceptances`, `notificationPreferences`
- `pets`
- `follows` / mutual-friend relationships
- `posts`, `postMedia`, `tags`, `postTags`, `likes`, `comments`, `postViews`
- `conversations`, `messageRequests`, `messages`, `messageReceipts`, `blocks`
- `groups`, `groupMemberships`, `groupRules`, `groupJoinQuestions`, `groupJoinAnswers`, `groupPosts`, `groupMessages`
- `challenges`, `challengeEntries`, `challengeScoreJobs`, `leaderboardSnapshots`
- `reports`, `moderationActions`, `auditLog`, `bans`
- `notifications`, `pushTokens`, `rateLimitEvents`

All mutations enforce authorization from the verified Clerk identity and server-side visibility/group rules.

## Mobile and web flows

### Onboarding

1. Select email/password, Apple, or Google authentication.
2. Enter DOB; reject users under 17.
3. Accept required policies.
4. Enter display name and first pet name/species.
5. Land on the following feed, with clear discovery and first-post paths.

### Home and Explore

- Home is newest-first content from followed accounts.
- Explore ranks trending public/member-eligible posts, people, groups, and challenges.
- Feed cards support likes, comments, report/block, and navigation to profiles/groups.

### Create post

1. Capture with the camera or select from the library.
2. Enforce one photo and the upload limit.
3. Add caption, optional tags, optional pet tag, and visibility.
4. If Everybody is selected, show the public-web warning and confirmation.
5. Run moderation and publish only if allowed.

### Direct messages

- Text and photos.
- Message requests before a recipient accepts a new conversation.
- Delivery/read status.
- Delete for self at any time; unsend for everyone for five minutes.
- Reports preserve relevant messages for safety review.

### Groups

- Any eligible signed-in member can create a public or private group.
- Group owner configures custom rules, required acknowledgement, custom join questions, join approval, and post approval.
- Groups include a board and group chat.
- Group admins can moderate their own groups. Platform owner powers are global.

### Challenges

1. Creator defines title, prompt, optional cover/default placeholder, start/end time, and visibility.
2. Entrant takes/selects a new photo and gives one-time AI consent.
3. Gemini verifies that an owner and dog/cat are present and returns a resemblance score.
4. Failure/low confidence produces a friendly retry message; unvalidated entries are not published.
5. Gemini outages keep entries pending, show a pet animation and outage message, retry safely, and notify on completion.
6. Leaderboard formula: 60% Gemini resemblance score, 25% likes, 15% views.

## Phased delivery

### Phase 0 — repository and service setup

- Audit existing code and preserve unrelated changes.
- Configure development, staging, and production environments.
- Create Clerk, Convex, Gemini, moderation, and Expo push configuration boundaries; never commit secrets.
- Configure linting, tests, CI, and error/analytics foundations.

### Phase 1 — app shell and identity

- Set up Expo Router, native tabs, NativeWind theme/tokens, responsive web layout, and accessibility primitives.
- Integrate Clerk and Convex authentication.
- Build onboarding, age gate, policy acceptance, profile, and pet management.
- Build platform authorization utilities and visibility policy tests.

### Phase 2 — social foundation

- Implement follows/mutual friends, profile views, Home feed, Explore trending feed, post creation, likes, comments, and view counting.
- Implement media upload, image compression, loading/error states, and public-web read/search pages.

### Phase 3 — conversations and notifications

- Implement message requests, conversations, photo messages, read receipts, block/report, and message deletion semantics.
- Register push tokens; add global push opt-out confirmation and in-app critical notices.

### Phase 4 — groups and moderation

- Implement public/private groups, membership workflows, custom rules/questions, boards, chats, and group-admin powers.
- Select and connect the dedicated moderation provider.
- Build reports queue, review/removal/ban actions, audit logs, web admin dashboard, and restricted in-app admin views.

### Phase 5 — challenges and Gemini

- Implement challenge creation, entries, consent, image validation, scoring jobs, retries, pending UI, and leaderboard snapshots.
- Enforce no retention of derived visual-analysis data after scoring.
- Add Gemini cost quotas, idempotency keys, retries, and alerts.

### Phase 6 — hardening and release

- Accessibility audit: screen readers, scalable type, contrast, focus order, and touch targets.
- Low-bandwidth audit: image optimization, pagination, retry behavior, and graceful offline/error states.
- Add unit, integration, end-to-end, and device tests.
- Produce store metadata, legal documents, privacy disclosures, community rules, consent copy, and public-content warning copy.
- Deploy staging, run moderation/abuse drills, then release to iOS, Android, and web.

## Non-functional requirements

- Photo-only v1: one image per standard post/challenge entry, no video.
- Maximum image upload: 10 MB.
- Direct messages support up to three images per message.
- Deleted posts/comments/messages hide immediately, remain privately available for 30 days for recovery/abuse review, then purge; reports may retain necessary evidence.
- Rate limits apply to all accounts, including posts, comments, follows, messages, uploads, groups, challenges, views, and Gemini analyses.
- Accessibility and low-bandwidth resilience are required release criteria.

## Testing and acceptance criteria

- Unit-test authorization, privacy, friendship, group membership, moderation, rate limiting, challenge states, and deletion rules.
- Integration-test Clerk-to-Convex identity propagation and privileged mutations.
- End-to-end test sign-up/age gate, post creation, public-web visibility, messaging, groups, reports, admin actions, and Gemini outage/retry behavior.
- Test iOS, Android, and web layouts with keyboard/screen reader/scalable text coverage.
- No public content may be accessible when visibility, group membership, block, or ban rules deny it.
- No AI API key or moderation secret may be present in a client build.

## Delivery dependencies and open decisions

- Apple Developer and Google Play developer accounts.
- Production domain.
- Clerk, Convex, Gemini, moderation-provider, and Expo push credentials.
- Selection of a dedicated moderation vendor, including cost, regions, retention policy, and escalation coverage.
- Final legal review of global 17+ policy, public-photo disclosures, community guidelines, AI consent, and data-retention terms.
- Confirm the initial Gemini budget and operational quotas before production launch.
