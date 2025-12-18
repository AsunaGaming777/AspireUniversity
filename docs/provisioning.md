# 🏗️ Discord Server Provisioning Guide

## Overview

The Azerra AI School Discord bot includes a comprehensive **Server Provisioner** that automatically creates and manages all roles, channels, categories, automod rules, and onboarding flows.

## Features

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Drift Detection** - Updates only what changed
- ✅ **Dry Run Mode** - Preview changes before applying
- ✅ **Backup & Restore** - Full server configuration snapshots
- ✅ **Locked Items** - Prevent overwrites with `{locked:true}` metadata
- ✅ **Audit Logging** - All changes logged to #provision-audit
- ✅ **Safe Defaults** - Deny-by-default permissions

## Quick Start

### 1. Initial Provisioning

```bash
# In Discord, run:
/provision run dry_run:true

# Review the simulation results, then run for real:
/provision run dry_run:false
```

This creates:
- **60+ roles** in correct hierarchy
- **60+ channels** across 10+ categories
- **10 cohort sets** (each with 5 channels)
- **Automod rules** (spam, mentions, scams, profanity)
- **Role menus** in #start-here
- **Onboarding flow** in #welcome

### 2. Expected Structure

After provisioning, your server will have:

```
INFO (read-only)
├── #welcome
├── #rules
├── #start-here (role menus here)
├── #announcements
├── #changelog
├── #faq
├── #roadmap
└── #status

CAMPUS (verified members)
├── #general
├── #introductions
├── #wins
├── #qna
├── #random
├── 🔊 Lounge
└── 🔊 Study Hall

SUPPORT
├── #help-desk (ticket button)
├── #billing-support
├── #tech-support
└── #report-issue

TRACKS (track-specific)
├── #business (Business Track role)
├── #coding (Coding Track role)
├── #security-osint
├── #design-media
├── #prompt-mastery
└── 🔊 track-office-hours

LEARNING
├── #lesson-drops (bot announcements)
├── #quiz-discussion
├── #assignment-help
├── #resources
└── #showcase

CAREERS
├── #jobs-opportunities
├── #hire-a-mentor
├── #alumni-hall
└── #portfolio-reviews

AFFILIATES (Affiliate role)
├── #affiliate-hub
├── #campaign-ideas
└── #payout-announcements (read-only)

EVENTS
├── #events
├── #hackathons
├── #challenge-submissions
└── 🎤 events-stage

COHORT-01 (Cohort 01 role only)
├── #c01-chat
├── #c01-announcements (read-only)
├── #c01-assignments
├── #c01-standups
└── 🔊 c01-voice

... (COHORT-02 through COHORT-10 with same structure)

STAFF (Staff+ only)
├── #staff-ops
├── #mentor-lounge
├── #grading-queue
├── #plagiarism-alerts
├── #moderation-logs
├── #webhook-logs
├── #bot-status
└── 🔊 staff-sync

ADMIN (Admin/Overseer only)
├── #admin-ops
├── #provision-audit
├── #backups
└── #experiments
```

## Role Hierarchy

**Total: 60+ roles** (in descending order)

### Leadership (Top 10)
1. Overseer - ADMINISTRATOR
2. Council - Message/member management
3. Admin - Full guild management
4. Moderator - Moderation tools
5. Mentor - Teaching permissions
6. Instructor - Teaching permissions
7. Staff - Staff access
8. Ambassador - Community leaders
9. Partner - Partnership roles
10. Sponsor - Sponsor recognition

### Prestige & Alumni (11-20)
11. Alumni
12. Legend
13. Hall of Fame
14. Founders
15. Eternal Scholar
16. Researcher
17. Innovator
18. Collaborator
19. Top Contributor
20. Beta Tester

### Achievements (21-30)
21. Verified Testimonial
22. Challenge Winner
23. Hackathon Winner
24. Scholarship Recipient
25. Business Track
26. Coding Track
27. Security/OSINT Track
28. Design/Media Track
29. Prompt Mastery Track
30. Cohort Lead

### Cohorts (31-41)
31. Cohort Mentor
32-41. Cohort 01...10

### Study Groups (42-51)
42-51. Student 01...10

### Utility (52-60)
52. Affiliate
53. Verified
54. Member (default)
55. Muted
56. Bots
57. Announcements Ping
58. Events Ping
59. Jobs Ping
60. LFG/Study Ping

## Commands

### `/provision run [dry_run]`

Provision the entire server.

**Options:**
- `dry_run` (boolean) - Preview changes without applying (default: false)

**Example:**
```
/provision run dry_run:true
```

**Output:**
```
🏗️ Server Provision Simulation

👥 Roles
Created: 45
Updated: 5
Skipped: 10

📺 Channels
Created: 52
Updated: 3
Skipped: 8

🛡️ Automod
Rules: 4
Active: Yes

🎭 Menus
Posted: 3
Updated: 0

👋 Onboarding
Messages: 1

⏱️ Duration: 12.45s
```

### `/provision backup`

Create a backup of the current server configuration.

**Output:**
- JSON file attachment
- Backup stored in Redis (30-day retention)
- Posted to #backups channel

**Backup includes:**
- All roles (names, colors, permissions, positions)
- All categories and channels
- Permission overwrites
- Channel topics and settings
- Metadata and version info

### `/provision restore [backup_key]`

Restore server from a backup. **DANGEROUS - Use with caution!**

**Options:**
- `backup_key` (string) - Specific backup to restore (optional, defaults to latest)

**Safety:**
- Requires admin confirmation
- Creates backup of current state first
- Destructive operation
- Not recommended during active usage

### `/provision cohorts add <count>`

Add new cohort sets (roles + channels).

**Example:**
```
/provision cohorts add count:2
```

**Result:**
- Creates Cohort 11 and Cohort 12 roles
- Creates COHORT-11 and COHORT-12 categories
- Creates 5 channels in each cohort
- Updates permissions

### `/provision cohorts archive <cohort>`

Archive a cohort (lock channels, move to ARCHIVE category).

**Example:**
```
/provision cohorts archive cohort:05
```

**Result:**
- Locks all channels (read-only)
- Moves to ARCHIVE category
- Preserves history
- Removes from active cohort list

## Idempotency

The provisioner is **fully idempotent** - you can run it multiple times safely.

### How It Works

1. **Compare by name** - Finds existing roles/channels by name
2. **Check for drift** - Compares current vs. desired state
3. **Update if changed** - Only modifies what's different
4. **Skip if locked** - Respects `{locked:true}` in channel topics

### Metadata Format

Channels can include metadata in topics:
```
This is the channel topic. {locked:true, v:1, hash:abc123}
```

**Metadata fields:**
- `locked` - If true, name/topic won't be updated (permissions still sync)
- `v` - Version number
- `hash` - Configuration hash for drift detection

### Drift Detection

The system detects:
- Name changes
- Topic changes
- Permission changes
- Color changes (roles)
- Position changes

**Not detected** (by design):
- Message history
- Pinned messages
- Slowmode changes (unless specified)
- Archived threads

## Permission Model

### Default Strategy: Deny All

All channels start with `@everyone: Deny ViewChannel` and explicitly grant access.

### Permission Overwrites

Channels inherit from category, then apply specific overwrites:

```typescript
// Example: Track channel
{
  name: 'business',
  permissions: [
    { role: 'Business Track', allow: ['ViewChannel', 'SendMessages'], deny: [] },
    { role: 'Staff', allow: ['ViewChannel', 'SendMessages'], deny: [] },
  ]
}
```

### Role Permissions

| Role Level | Permissions |
|------------|-------------|
| **Overseer** | ADMINISTRATOR (all permissions) |
| **Admin** | Manage guild, channels, roles, messages, kick, ban |
| **Council** | Manage messages, members, view audit log |
| **Moderator** | Manage messages, timeout members |
| **Mentor/Instructor** | Manage threads, attach files, send messages |
| **Staff** | Standard + access to staff channels |
| **Students** | Standard permissions in allowed channels |
| **Muted** | View only in limited areas |

## Automod Rules

### 1. Spam Prevention
- **Trigger**: Discord's built-in spam detection
- **Action**: Block message + 1 minute timeout
- **Exemptions**: None

### 2. Mention Raid Protection
- **Trigger**: >5 mentions in one message
- **Action**: Block message + 5 minute timeout
- **Exemptions**: None

### 3. Scam Domain Blocker
- **Trigger**: Known scam domains
- **Action**: Block message + alert in #moderation-logs
- **Domains**: discord-nitro.gift, steamcommunnity.com, etc.

### 4. Profanity Filter
- **Trigger**: Mild profanity keywords
- **Action**: Block message
- **Exemptions**: Staff, Moderator, Admin

## Role Menus

### Track Selection (#start-here)
- Multi-select (0-5 options)
- Roles: Business Track, Coding Track, Security/OSINT Track, Design/Media Track, Prompt Mastery Track
- Auto-updates on selection change

### Ping Preferences (#start-here)
- Multi-select (0-4 options)
- Roles: Announcements Ping, Events Ping, Jobs Ping, LFG/Study Ping
- Opt-in only

### Study Groups (#start-here)
- Single-select (0-1 option)
- Roles: Student 01 through Student 10
- Automatically removes previous selection

## Onboarding Flow

### #welcome Message
- Welcome embed with course overview
- Three buttons:
  1. **Read Rules** → Links to #rules
  2. **Verify Account** → Instructions for /verify
  3. **Enroll Now** → Links to pricing page

### Verification Process
1. User clicks "Verify Account"
2. Bot sends ephemeral message with `/verify` instructions
3. User runs `/verify`
4. Bot generates short-lived code (10 min)
5. User visits verification URL on site
6. Site validates and links accounts
7. Site sends webhook to bot: `user.enrolled`
8. Bot assigns: Verified + Member + Track + Cohort roles
9. Bot sends welcome DM

### Role Assignment on Enrollment
When site sends `user.enrolled` webhook:
```javascript
// Assigned roles:
- Verified
- Member
- [Track role(s)] based on user selection
- Cohort XX (if assigned)
- Student XX (study group)
- [Plan role] - Standard/Mastery/Mastermind
```

## Backup & Restore

### Creating Backups

```bash
/provision backup

# Creates:
1. JSON file (downloadable)
2. Redis entry (30-day retention)
3. Post in #backups channel
```

### Backup Contents

```json
{
  "version": "1.0.0",
  "guildId": "123...",
  "guildName": "Azerra AI School",
  "timestamp": "2025-09-30T...",
  "roles": [
    {
      "name": "Overseer",
      "color": 16766720,
      "permissions": ["Administrator"],
      "position": 60,
      "hoist": true,
      "mentionable": false
    }
  ],
  "categories": [
    {
      "name": "INFO",
      "position": 0,
      "channels": [...]
    }
  ]
}
```

### Restoring from Backup

**⚠️ WARNING: Destructive operation!**

```bash
# Not recommended in production
# Manual restore process:
1. Download backup JSON
2. Review changes
3. Contact platform admin
4. Create current backup first
5. Run restore in maintenance window
```

## Troubleshooting

### Common Issues

**"Role not found" errors:**
- Ensure roles are created before channels
- Check role name spelling exactly matches
- Verify bot has Manage Roles permission

**"Missing Access" errors:**
- Bot needs Administrator permission
- Bot role must be above roles it manages
- Check bot is in the guild

**Permissions not applying:**
- Wait 2-3 seconds between role and channel creation
- Discord API rate limits (50 requests/second)
- Try running again after 1 minute

**Duplicate channels:**
- Should not happen due to idempotency
- If occurs, check for name case sensitivity
- Use `/provision backup` first, then delete duplicates manually

### Rate Limiting

Discord API limits:
- **50 requests/second** (per bot)
- **5 requests/second** (per resource)

The provisioner includes automatic rate limiting:
- Waits between bulk operations
- Retries on rate limit errors
- Spreads requests over time

### Debugging

**Enable debug mode:**
```bash
# Set environment variable
DEBUG=true pnpm --filter discord-bot dev

# Shows detailed logs:
# - Each API call
# - Permission calculations
# - Drift detection results
# - Cache updates
```

**Check provision audit log:**
```
# In Discord:
Go to #provision-audit channel
Review recent provision runs
Check for errors or warnings
```

## Best Practices

### 1. Always Dry Run First
```bash
/provision run dry_run:true
```
Review the simulation before applying changes.

### 2. Backup Before Major Changes
```bash
/provision backup
```
Always have a recovery point.

### 3. Lock Important Channels
```bash
# Manually edit channel topic to include:
Important info here. {locked:true, v:1}
```
Prevents accidental renames.

### 4. Test in Staging
- Create a test Discord server
- Run provisioning there first
- Verify everything works
- Then provision production

### 5. Monitor After Provisioning
- Check #provision-audit for errors
- Verify permissions with test account
- Test role menus
- Confirm automod active

## Advanced Usage

### Custom Cohort Creation

```bash
# Add 5 new cohorts (11-15):
/provision cohorts add count:5

# Result:
- Creates Cohort 11...15 roles
- Creates COHORT-11...15 categories
- Creates 5 channels per cohort (25 total)
- Configures permissions
```

### Permission Overrides

If you need custom permissions:

1. Run provision to create structure
2. Manually adjust permissions in Discord
3. Add `{locked:true}` to channel topic
4. Future provisions won't overwrite

### Scaling to 100+ Cohorts

The system supports unlimited cohorts:

```bash
# Add 20 cohorts at a time (API limits):
/provision cohorts add count:20

# Wait 1 minute, then:
/provision cohorts add count:20

# Repeat as needed
```

## Maintenance

### Weekly Tasks
- Review #moderation-logs for automod triggers
- Check for permission drift
- Verify role menus still work
- Test verification flow

### Monthly Tasks
- Create full backup
- Review and update scam domain list
- Audit role assignments
- Clean up abandoned cohorts

### Quarterly Tasks
- Full permission audit
- Review and update automod rules
- Optimize channel structure
- Plan for new features

## Rollback

If provisioning causes issues:

### Immediate Rollback
```bash
# 1. Find last backup
/provision backup  # Create current state backup first!

# 2. Contact admin to restore manually
# Automatic restore is not enabled for safety

# 3. Manual fix:
- Delete problematic channels/roles
- Re-run provision with dry_run:true
- Fix configuration in code
- Deploy updated bot
- Run provision again
```

### Partial Rollback

If only one category is wrong:

1. Delete that category and channels manually
2. Run `/provision run` - it will recreate them
3. Verify permissions

## Security Considerations

### Provisioning Access

Only users with **Administrator** permission can run:
- `/provision run`
- `/provision backup`
- `/provision restore`
- `/provision cohorts add`

### Audit Trail

All provisioning operations logged to:
- #provision-audit (in-server)
- Bot console logs
- Sentry (errors only)

Each log includes:
- Who triggered it
- What changed (create/update/delete)
- Timestamp
- Duration
- Error count

### Permission Safety

The provisioner includes safety checks:

1. **Deny-by-default** - All channels start locked
2. **No @everyone admin** - Aborts if @everyone would get admin
3. **Locked metadata** - Respects manual overrides
4. **Staff-only channels** - Double-checks STAFF/ADMIN are hidden

## Examples

### Example 1: New Server Setup

```bash
# 1. Invite bot with Administrator permission
# 2. Run provisioning
/provision run dry_run:true  # Preview
/provision run                # Apply

# 3. Verify structure
# - Check 60+ roles created
# - Check 60+ channels created
# - Test role menu in #start-here
# - Verify permissions with test account

# 4. Create backup
/provision backup

# 5. Manual adjustments
# - Upload server icon
# - Set server banner
# - Customize welcome message
# - Add custom emojis
```

### Example 2: Adding Cohorts

```bash
# Current: 10 cohorts (01-10)
# Need: 15 cohorts total

/provision cohorts add count:5

# Creates:
# - Cohort 11, 12, 13, 14, 15 roles
# - COHORT-11...15 categories
# - 5 channels each (25 total)
```

### Example 3: Drift Correction

```bash
# Someone manually renamed #general to #general-chat
# Run provision to fix:

/provision run

# Output:
# Updated channel: general (was: general-chat)

# If you WANT the new name:
# 1. Edit #general-chat topic to: Welcome! {locked:true}
# 2. Run /provision run again
# 3. It will skip that channel
```

## FAQ

**Q: How long does provisioning take?**  
A: 10-60 seconds depending on what needs to be created/updated.

**Q: Can I customize the role colors?**  
A: Yes, edit `src/provision/roles.ts` and redeploy the bot.

**Q: What if I delete a channel manually?**  
A: Run `/provision run` and it will recreate it.

**Q: Can I add custom categories?**  
A: Yes, edit `src/provision/channels.ts`, add to `CATEGORY_CATALOG`, and redeploy.

**Q: Does it delete channels?**  
A: No, it only creates and updates. Manual deletion is required.

**Q: How do I disable a cohort?**  
A: Use `/provision cohorts archive` (archives but preserves).

**Q: Can I run this on multiple servers?**  
A: Yes, each guild is provisioned independently.

---

## Technical Details

### Implementation

- **Language**: TypeScript
- **Framework**: Discord.js v14
- **Validation**: Zod schemas
- **Storage**: Redis (backups)
- **Logging**: Sentry + console

### File Structure

```
src/provision/
├── roles.ts          # 60+ role catalog + provisioner
├── channels.ts       # 60+ channel catalog + provisioner
├── automod.ts        # 4 automod rules
├── menus.ts          # Role selection menus
├── onboarding.ts     # Welcome flow
├── backups.ts        # Backup/restore system
└── provision.ts      # Main orchestrator

src/config/
└── provision.schema.ts  # Zod schemas

src/utils/
└── idempotency.ts       # Drift detection utilities

src/commands/
└── provision.ts         # Slash commands
```

### Extensibility

To add new features:

1. **New role**: Add to `ROLE_CATALOG` in `roles.ts`
2. **New channel**: Add to `CATEGORY_CATALOG` in `channels.ts`
3. **New automod rule**: Add to `provisionAutomod()` in `automod.ts`
4. **New menu**: Add to `setupMenus()` in `menus.ts`

Then redeploy bot and run `/provision run`.

---

**Last Updated:** September 30, 2025  
**Version:** 1.0.0  
**Status:** Production Ready 🚀

## Overview

The Azerra AI School Discord bot includes a comprehensive **Server Provisioner** that automatically creates and manages all roles, channels, categories, automod rules, and onboarding flows.

## Features

- ✅ **Idempotent** - Safe to run multiple times
- ✅ **Drift Detection** - Updates only what changed
- ✅ **Dry Run Mode** - Preview changes before applying
- ✅ **Backup & Restore** - Full server configuration snapshots
- ✅ **Locked Items** - Prevent overwrites with `{locked:true}` metadata
- ✅ **Audit Logging** - All changes logged to #provision-audit
- ✅ **Safe Defaults** - Deny-by-default permissions

## Quick Start

### 1. Initial Provisioning

```bash
# In Discord, run:
/provision run dry_run:true

# Review the simulation results, then run for real:
/provision run dry_run:false
```

This creates:
- **60+ roles** in correct hierarchy
- **60+ channels** across 10+ categories
- **10 cohort sets** (each with 5 channels)
- **Automod rules** (spam, mentions, scams, profanity)
- **Role menus** in #start-here
- **Onboarding flow** in #welcome

### 2. Expected Structure

After provisioning, your server will have:

```
INFO (read-only)
├── #welcome
├── #rules
├── #start-here (role menus here)
├── #announcements
├── #changelog
├── #faq
├── #roadmap
└── #status

CAMPUS (verified members)
├── #general
├── #introductions
├── #wins
├── #qna
├── #random
├── 🔊 Lounge
└── 🔊 Study Hall

SUPPORT
├── #help-desk (ticket button)
├── #billing-support
├── #tech-support
└── #report-issue

TRACKS (track-specific)
├── #business (Business Track role)
├── #coding (Coding Track role)
├── #security-osint
├── #design-media
├── #prompt-mastery
└── 🔊 track-office-hours

LEARNING
├── #lesson-drops (bot announcements)
├── #quiz-discussion
├── #assignment-help
├── #resources
└── #showcase

CAREERS
├── #jobs-opportunities
├── #hire-a-mentor
├── #alumni-hall
└── #portfolio-reviews

AFFILIATES (Affiliate role)
├── #affiliate-hub
├── #campaign-ideas
└── #payout-announcements (read-only)

EVENTS
├── #events
├── #hackathons
├── #challenge-submissions
└── 🎤 events-stage

COHORT-01 (Cohort 01 role only)
├── #c01-chat
├── #c01-announcements (read-only)
├── #c01-assignments
├── #c01-standups
└── 🔊 c01-voice

... (COHORT-02 through COHORT-10 with same structure)

STAFF (Staff+ only)
├── #staff-ops
├── #mentor-lounge
├── #grading-queue
├── #plagiarism-alerts
├── #moderation-logs
├── #webhook-logs
├── #bot-status
└── 🔊 staff-sync

ADMIN (Admin/Overseer only)
├── #admin-ops
├── #provision-audit
├── #backups
└── #experiments
```

## Role Hierarchy

**Total: 60+ roles** (in descending order)

### Leadership (Top 10)
1. Overseer - ADMINISTRATOR
2. Council - Message/member management
3. Admin - Full guild management
4. Moderator - Moderation tools
5. Mentor - Teaching permissions
6. Instructor - Teaching permissions
7. Staff - Staff access
8. Ambassador - Community leaders
9. Partner - Partnership roles
10. Sponsor - Sponsor recognition

### Prestige & Alumni (11-20)
11. Alumni
12. Legend
13. Hall of Fame
14. Founders
15. Eternal Scholar
16. Researcher
17. Innovator
18. Collaborator
19. Top Contributor
20. Beta Tester

### Achievements (21-30)
21. Verified Testimonial
22. Challenge Winner
23. Hackathon Winner
24. Scholarship Recipient
25. Business Track
26. Coding Track
27. Security/OSINT Track
28. Design/Media Track
29. Prompt Mastery Track
30. Cohort Lead

### Cohorts (31-41)
31. Cohort Mentor
32-41. Cohort 01...10

### Study Groups (42-51)
42-51. Student 01...10

### Utility (52-60)
52. Affiliate
53. Verified
54. Member (default)
55. Muted
56. Bots
57. Announcements Ping
58. Events Ping
59. Jobs Ping
60. LFG/Study Ping

## Commands

### `/provision run [dry_run]`

Provision the entire server.

**Options:**
- `dry_run` (boolean) - Preview changes without applying (default: false)

**Example:**
```
/provision run dry_run:true
```

**Output:**
```
🏗️ Server Provision Simulation

👥 Roles
Created: 45
Updated: 5
Skipped: 10

📺 Channels
Created: 52
Updated: 3
Skipped: 8

🛡️ Automod
Rules: 4
Active: Yes

🎭 Menus
Posted: 3
Updated: 0

👋 Onboarding
Messages: 1

⏱️ Duration: 12.45s
```

### `/provision backup`

Create a backup of the current server configuration.

**Output:**
- JSON file attachment
- Backup stored in Redis (30-day retention)
- Posted to #backups channel

**Backup includes:**
- All roles (names, colors, permissions, positions)
- All categories and channels
- Permission overwrites
- Channel topics and settings
- Metadata and version info

### `/provision restore [backup_key]`

Restore server from a backup. **DANGEROUS - Use with caution!**

**Options:**
- `backup_key` (string) - Specific backup to restore (optional, defaults to latest)

**Safety:**
- Requires admin confirmation
- Creates backup of current state first
- Destructive operation
- Not recommended during active usage

### `/provision cohorts add <count>`

Add new cohort sets (roles + channels).

**Example:**
```
/provision cohorts add count:2
```

**Result:**
- Creates Cohort 11 and Cohort 12 roles
- Creates COHORT-11 and COHORT-12 categories
- Creates 5 channels in each cohort
- Updates permissions

### `/provision cohorts archive <cohort>`

Archive a cohort (lock channels, move to ARCHIVE category).

**Example:**
```
/provision cohorts archive cohort:05
```

**Result:**
- Locks all channels (read-only)
- Moves to ARCHIVE category
- Preserves history
- Removes from active cohort list

## Idempotency

The provisioner is **fully idempotent** - you can run it multiple times safely.

### How It Works

1. **Compare by name** - Finds existing roles/channels by name
2. **Check for drift** - Compares current vs. desired state
3. **Update if changed** - Only modifies what's different
4. **Skip if locked** - Respects `{locked:true}` in channel topics

### Metadata Format

Channels can include metadata in topics:
```
This is the channel topic. {locked:true, v:1, hash:abc123}
```

**Metadata fields:**
- `locked` - If true, name/topic won't be updated (permissions still sync)
- `v` - Version number
- `hash` - Configuration hash for drift detection

### Drift Detection

The system detects:
- Name changes
- Topic changes
- Permission changes
- Color changes (roles)
- Position changes

**Not detected** (by design):
- Message history
- Pinned messages
- Slowmode changes (unless specified)
- Archived threads

## Permission Model

### Default Strategy: Deny All

All channels start with `@everyone: Deny ViewChannel` and explicitly grant access.

### Permission Overwrites

Channels inherit from category, then apply specific overwrites:

```typescript
// Example: Track channel
{
  name: 'business',
  permissions: [
    { role: 'Business Track', allow: ['ViewChannel', 'SendMessages'], deny: [] },
    { role: 'Staff', allow: ['ViewChannel', 'SendMessages'], deny: [] },
  ]
}
```

### Role Permissions

| Role Level | Permissions |
|------------|-------------|
| **Overseer** | ADMINISTRATOR (all permissions) |
| **Admin** | Manage guild, channels, roles, messages, kick, ban |
| **Council** | Manage messages, members, view audit log |
| **Moderator** | Manage messages, timeout members |
| **Mentor/Instructor** | Manage threads, attach files, send messages |
| **Staff** | Standard + access to staff channels |
| **Students** | Standard permissions in allowed channels |
| **Muted** | View only in limited areas |

## Automod Rules

### 1. Spam Prevention
- **Trigger**: Discord's built-in spam detection
- **Action**: Block message + 1 minute timeout
- **Exemptions**: None

### 2. Mention Raid Protection
- **Trigger**: >5 mentions in one message
- **Action**: Block message + 5 minute timeout
- **Exemptions**: None

### 3. Scam Domain Blocker
- **Trigger**: Known scam domains
- **Action**: Block message + alert in #moderation-logs
- **Domains**: discord-nitro.gift, steamcommunnity.com, etc.

### 4. Profanity Filter
- **Trigger**: Mild profanity keywords
- **Action**: Block message
- **Exemptions**: Staff, Moderator, Admin

## Role Menus

### Track Selection (#start-here)
- Multi-select (0-5 options)
- Roles: Business Track, Coding Track, Security/OSINT Track, Design/Media Track, Prompt Mastery Track
- Auto-updates on selection change

### Ping Preferences (#start-here)
- Multi-select (0-4 options)
- Roles: Announcements Ping, Events Ping, Jobs Ping, LFG/Study Ping
- Opt-in only

### Study Groups (#start-here)
- Single-select (0-1 option)
- Roles: Student 01 through Student 10
- Automatically removes previous selection

## Onboarding Flow

### #welcome Message
- Welcome embed with course overview
- Three buttons:
  1. **Read Rules** → Links to #rules
  2. **Verify Account** → Instructions for /verify
  3. **Enroll Now** → Links to pricing page

### Verification Process
1. User clicks "Verify Account"
2. Bot sends ephemeral message with `/verify` instructions
3. User runs `/verify`
4. Bot generates short-lived code (10 min)
5. User visits verification URL on site
6. Site validates and links accounts
7. Site sends webhook to bot: `user.enrolled`
8. Bot assigns: Verified + Member + Track + Cohort roles
9. Bot sends welcome DM

### Role Assignment on Enrollment
When site sends `user.enrolled` webhook:
```javascript
// Assigned roles:
- Verified
- Member
- [Track role(s)] based on user selection
- Cohort XX (if assigned)
- Student XX (study group)
- [Plan role] - Standard/Mastery/Mastermind
```

## Backup & Restore

### Creating Backups

```bash
/provision backup

# Creates:
1. JSON file (downloadable)
2. Redis entry (30-day retention)
3. Post in #backups channel
```

### Backup Contents

```json
{
  "version": "1.0.0",
  "guildId": "123...",
  "guildName": "Azerra AI School",
  "timestamp": "2025-09-30T...",
  "roles": [
    {
      "name": "Overseer",
      "color": 16766720,
      "permissions": ["Administrator"],
      "position": 60,
      "hoist": true,
      "mentionable": false
    }
  ],
  "categories": [
    {
      "name": "INFO",
      "position": 0,
      "channels": [...]
    }
  ]
}
```

### Restoring from Backup

**⚠️ WARNING: Destructive operation!**

```bash
# Not recommended in production
# Manual restore process:
1. Download backup JSON
2. Review changes
3. Contact platform admin
4. Create current backup first
5. Run restore in maintenance window
```

## Troubleshooting

### Common Issues

**"Role not found" errors:**
- Ensure roles are created before channels
- Check role name spelling exactly matches
- Verify bot has Manage Roles permission

**"Missing Access" errors:**
- Bot needs Administrator permission
- Bot role must be above roles it manages
- Check bot is in the guild

**Permissions not applying:**
- Wait 2-3 seconds between role and channel creation
- Discord API rate limits (50 requests/second)
- Try running again after 1 minute

**Duplicate channels:**
- Should not happen due to idempotency
- If occurs, check for name case sensitivity
- Use `/provision backup` first, then delete duplicates manually

### Rate Limiting

Discord API limits:
- **50 requests/second** (per bot)
- **5 requests/second** (per resource)

The provisioner includes automatic rate limiting:
- Waits between bulk operations
- Retries on rate limit errors
- Spreads requests over time

### Debugging

**Enable debug mode:**
```bash
# Set environment variable
DEBUG=true pnpm --filter discord-bot dev

# Shows detailed logs:
# - Each API call
# - Permission calculations
# - Drift detection results
# - Cache updates
```

**Check provision audit log:**
```
# In Discord:
Go to #provision-audit channel
Review recent provision runs
Check for errors or warnings
```

## Best Practices

### 1. Always Dry Run First
```bash
/provision run dry_run:true
```
Review the simulation before applying changes.

### 2. Backup Before Major Changes
```bash
/provision backup
```
Always have a recovery point.

### 3. Lock Important Channels
```bash
# Manually edit channel topic to include:
Important info here. {locked:true, v:1}
```
Prevents accidental renames.

### 4. Test in Staging
- Create a test Discord server
- Run provisioning there first
- Verify everything works
- Then provision production

### 5. Monitor After Provisioning
- Check #provision-audit for errors
- Verify permissions with test account
- Test role menus
- Confirm automod active

## Advanced Usage

### Custom Cohort Creation

```bash
# Add 5 new cohorts (11-15):
/provision cohorts add count:5

# Result:
- Creates Cohort 11...15 roles
- Creates COHORT-11...15 categories
- Creates 5 channels per cohort (25 total)
- Configures permissions
```

### Permission Overrides

If you need custom permissions:

1. Run provision to create structure
2. Manually adjust permissions in Discord
3. Add `{locked:true}` to channel topic
4. Future provisions won't overwrite

### Scaling to 100+ Cohorts

The system supports unlimited cohorts:

```bash
# Add 20 cohorts at a time (API limits):
/provision cohorts add count:20

# Wait 1 minute, then:
/provision cohorts add count:20

# Repeat as needed
```

## Maintenance

### Weekly Tasks
- Review #moderation-logs for automod triggers
- Check for permission drift
- Verify role menus still work
- Test verification flow

### Monthly Tasks
- Create full backup
- Review and update scam domain list
- Audit role assignments
- Clean up abandoned cohorts

### Quarterly Tasks
- Full permission audit
- Review and update automod rules
- Optimize channel structure
- Plan for new features

## Rollback

If provisioning causes issues:

### Immediate Rollback
```bash
# 1. Find last backup
/provision backup  # Create current state backup first!

# 2. Contact admin to restore manually
# Automatic restore is not enabled for safety

# 3. Manual fix:
- Delete problematic channels/roles
- Re-run provision with dry_run:true
- Fix configuration in code
- Deploy updated bot
- Run provision again
```

### Partial Rollback

If only one category is wrong:

1. Delete that category and channels manually
2. Run `/provision run` - it will recreate them
3. Verify permissions

## Security Considerations

### Provisioning Access

Only users with **Administrator** permission can run:
- `/provision run`
- `/provision backup`
- `/provision restore`
- `/provision cohorts add`

### Audit Trail

All provisioning operations logged to:
- #provision-audit (in-server)
- Bot console logs
- Sentry (errors only)

Each log includes:
- Who triggered it
- What changed (create/update/delete)
- Timestamp
- Duration
- Error count

### Permission Safety

The provisioner includes safety checks:

1. **Deny-by-default** - All channels start locked
2. **No @everyone admin** - Aborts if @everyone would get admin
3. **Locked metadata** - Respects manual overrides
4. **Staff-only channels** - Double-checks STAFF/ADMIN are hidden

## Examples

### Example 1: New Server Setup

```bash
# 1. Invite bot with Administrator permission
# 2. Run provisioning
/provision run dry_run:true  # Preview
/provision run                # Apply

# 3. Verify structure
# - Check 60+ roles created
# - Check 60+ channels created
# - Test role menu in #start-here
# - Verify permissions with test account

# 4. Create backup
/provision backup

# 5. Manual adjustments
# - Upload server icon
# - Set server banner
# - Customize welcome message
# - Add custom emojis
```

### Example 2: Adding Cohorts

```bash
# Current: 10 cohorts (01-10)
# Need: 15 cohorts total

/provision cohorts add count:5

# Creates:
# - Cohort 11, 12, 13, 14, 15 roles
# - COHORT-11...15 categories
# - 5 channels each (25 total)
```

### Example 3: Drift Correction

```bash
# Someone manually renamed #general to #general-chat
# Run provision to fix:

/provision run

# Output:
# Updated channel: general (was: general-chat)

# If you WANT the new name:
# 1. Edit #general-chat topic to: Welcome! {locked:true}
# 2. Run /provision run again
# 3. It will skip that channel
```

## FAQ

**Q: How long does provisioning take?**  
A: 10-60 seconds depending on what needs to be created/updated.

**Q: Can I customize the role colors?**  
A: Yes, edit `src/provision/roles.ts` and redeploy the bot.

**Q: What if I delete a channel manually?**  
A: Run `/provision run` and it will recreate it.

**Q: Can I add custom categories?**  
A: Yes, edit `src/provision/channels.ts`, add to `CATEGORY_CATALOG`, and redeploy.

**Q: Does it delete channels?**  
A: No, it only creates and updates. Manual deletion is required.

**Q: How do I disable a cohort?**  
A: Use `/provision cohorts archive` (archives but preserves).

**Q: Can I run this on multiple servers?**  
A: Yes, each guild is provisioned independently.

---

## Technical Details

### Implementation

- **Language**: TypeScript
- **Framework**: Discord.js v14
- **Validation**: Zod schemas
- **Storage**: Redis (backups)
- **Logging**: Sentry + console

### File Structure

```
src/provision/
├── roles.ts          # 60+ role catalog + provisioner
├── channels.ts       # 60+ channel catalog + provisioner
├── automod.ts        # 4 automod rules
├── menus.ts          # Role selection menus
├── onboarding.ts     # Welcome flow
├── backups.ts        # Backup/restore system
└── provision.ts      # Main orchestrator

src/config/
└── provision.schema.ts  # Zod schemas

src/utils/
└── idempotency.ts       # Drift detection utilities

src/commands/
└── provision.ts         # Slash commands
```

### Extensibility

To add new features:

1. **New role**: Add to `ROLE_CATALOG` in `roles.ts`
2. **New channel**: Add to `CATEGORY_CATALOG` in `channels.ts`
3. **New automod rule**: Add to `provisionAutomod()` in `automod.ts`
4. **New menu**: Add to `setupMenus()` in `menus.ts`

Then redeploy bot and run `/provision run`.

---

**Last Updated:** September 30, 2025  
**Version:** 1.0.0  
**Status:** Production Ready 🚀


