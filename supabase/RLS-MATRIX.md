# RLS permission matrix

Roles: **anon** (not signed in) · **cand** (candidate) · **empl** (employer, company owner) · **staff** · **admin**.
`own` = only rows belonging to that user. `—` = no policy, so the action is denied.

Every table has `ENABLE ROW LEVEL SECURITY`. `applications` and `documents` additionally have
`FORCE ROW LEVEL SECURITY`, so even the table owner goes through the policies.

| Table | Command | anon | cand | empl | staff | admin |
|---|---|---|---|---|---|---|
| profiles | SELECT | — | own | own | all | all |
| profiles | INSERT | — | own | own | own | own |
| profiles | UPDATE | — | own | own | all | all |
| profiles | DELETE | — | — | — | — | ✅ |
| user_roles | SELECT | — | own | own | all | all |
| user_roles | INSERT | — | — | — | — | ✅ |
| user_roles | UPDATE | — | — | — | — | ✅ |
| user_roles | DELETE | — | — | — | — | ✅ |
| countries / visa_types / services / job_categories | SELECT | active only | active only | active only | all | all |
| countries / visa_types / services / job_categories | INSERT/UPDATE/DELETE | — | — | — | ✅ | ✅ |
| testimonials / faqs / blog_posts | SELECT | published only | published only | published only | all | all |
| testimonials / faqs / blog_posts | INSERT/UPDATE/DELETE | — | — | — | ✅ | ✅ |
| site_settings | SELECT | ✅ | ✅ | ✅ | ✅ | ✅ |
| site_settings | INSERT/UPDATE/DELETE | — | — | — | ✅ | ✅ |
| companies | SELECT | verified only | verified only | verified + own | all | all |
| companies | INSERT | — | — | own | ✅ | ✅ |
| companies | UPDATE | — | — | own | ✅ | ✅ |
| companies | DELETE | — | — | — | ✅ | ✅ |
| jobs | SELECT | open only | open only | open + own | all | all |
| jobs | INSERT | — | — | own company | ✅ | ✅ |
| jobs | UPDATE | — | — | own company | ✅ | ✅ |
| jobs | DELETE | — | — | — | ✅ | ✅ |
| applications | SELECT | — | own | on own jobs | all | all |
| applications | INSERT | — | own | — | — | — |
| applications | UPDATE | — | own, **draft only** | — | all | all |
| applications | DELETE | — | — | — | ✅ | ✅ |
| applications.internal_notes | SELECT | column privilege REVOKED from anon + authenticated; staff read it through the service role or a staff-only RPC. Candidates use the `applications_public` view (`security_invoker = on`), which omits the column entirely. |
| application_events | SELECT | — | own application | — | all | all |
| application_events | INSERT | — | — | — | ✅ | ✅ |
| application_events | UPDATE / DELETE | — | — | — | — | — (immutable) |
| documents | SELECT | — | own | — | all | all |
| documents | INSERT | — | own | — | own | own |
| documents | UPDATE | — | — | — | ✅ | ✅ |
| documents | DELETE | — | own, only while the linked application is at draft / submitted / under_review / documents_required | — | ✅ | ✅ |
| appointments | SELECT | — | own | — | own + all | all |
| appointments | INSERT/UPDATE/DELETE | — | — | — | ✅ | ✅ |
| notifications | SELECT | — | own | own | own | own |
| notifications | INSERT | — | — | — | ✅ | ✅ |
| notifications | UPDATE | — | own | own | own | own |
| notifications | DELETE | — | own | own | own | own |
| inquiries | INSERT | ✅ | ✅ | ✅ | ✅ | ✅ |
| inquiries | SELECT | — | — | — | ✅ | ✅ |
| inquiries | UPDATE / DELETE | — | — | — | ✅ | ✅ |

## Storage

| Bucket | Public? | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| `documents` | no | owner (`{user_id}/…`) + staff | owner into own folder | — | owner + staff |
| `avatars` | yes | anyone | owner into own folder | owner | — |
| `media` | yes | anyone | staff | staff | staff |

Documents are never served by public URL. The client calls `createSignedUrl(path, 60)`, so a link is
valid for 60 seconds and cannot be forwarded usefully.

## Why roles live in their own table

Putting `role` on `profiles` and then writing `using (… from profiles where …)` inside a policy on
`profiles` causes `infinite recursion detected in policy`. Both helper functions here are
`SECURITY DEFINER` and `stable` with `search_path = public`, so a policy can ask "does this user
hold role X?" without re-entering a policy-protected table. It also means a user cannot escalate
their own privileges by updating their profile row.
