# Getting Started with Test Mode

Your application is now configured with **test mode** enabled, so you can immediately explore the dashboard, blog posting, and authentication features without setting up real Supabase credentials.

## Quick Start

### 1. Start the dev server
```bash
npm run dev
```

The app runs on `http://localhost:3000`

### 2. View the public site
- Visit `/` — homepage with hero, services, featured posts
- Visit `/blog` — view the demo blog posts (2 demo posts included)
- Visit `/pricing` — view pricing page
- Visit `/portfolio` — view your portfolio examples

### 3. Test login & dashboard
- Click **Login** in the header (or visit `/login`)
- Click **Continue with Google** — in test mode, this will instantly create a demo session
- You'll be redirected to `/dashboard` with a test user session

### 4. Manage blog posts
From the dashboard, click **Manage Blog** to open the blog admin:
- View existing demo posts
- **Create new posts** with title, excerpt, category, content (Markdown supported)
- **Delete posts** with the trash icon
- Posts are saved to browser localStorage and visible immediately on `/blog`

### Demo Blog Posts
Two demo posts are pre-loaded:
1. **Getting Started with Revenue Recovery** — Introduction to revenue recovery strategies
2. **Understanding Stripe Webhooks** — Practical webhook guide

Create additional posts to test the workflow.

## Test Mode Configuration

Test mode is enabled in `.env.local`:
```env
NEXT_PUBLIC_TEST_MODE=true
NEXT_PUBLIC_TEST_USER_ID=test-user-123
NEXT_PUBLIC_TEST_USER_EMAIL=demo@reveng.local
```

When `NEXT_PUBLIC_TEST_MODE=true`:
- Google OAuth is bypassed
- Auth checks use local Zustand store
- Blog posts are fetched from localStorage first, then demo posts
- No Supabase or Sanity credentials required

## When You're Ready for Production

1. **Disable test mode**: Set `NEXT_PUBLIC_TEST_MODE=false` in `.env.local`
2. **Set up Supabase**: Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **Set up Sanity**: Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `SANITY_API_TOKEN`
4. **Set up Stripe**: Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`

The fallback logic ensures the app gracefully degrades:
- Sanity → localStorage demo posts → static demo posts
- Real auth → test auth in test mode
- Real database → in-memory state

## File Structure

```
app/
  login/               # Google OAuth + test mode login
  dashboard/           # Protected dashboard with test mode support
  blog-admin/          # Blog admin interface (test mode only)
  blog/
    [slug]/            # Dynamic blog post pages

lib/
  sanity.ts            # Fetch posts with fallbacks
  test-auth.ts         # Test mode utilities
  auth-store.ts        # Zustand auth store
  demo-posts.ts        # Pre-loaded demo blog posts
  supabase-client.ts   # Supabase client factory

.env.local             # Local overrides (test mode enabled)
.env.example           # Production template
```

## Next Steps

After testing in test mode:

1. **Blog Admin**: Create a few posts to see the workflow
2. **Blog Pages**: View `/blog` and `/blog/[slug]` to see how posts render
3. **Dashboard**: Review the dashboard layout and auth flow
4. **Real Data**: When ready, connect to real Supabase + Sanity to persist data

## Troubleshooting

**Dashboard shows "Not authenticated"?**
- Check `.env.local` has `NEXT_PUBLIC_TEST_MODE=true`
- Clear browser localStorage and refresh

**Blog posts not showing?**
- Demo posts are pre-loaded; create new posts in `/blog-admin`
- Posts are saved to localStorage and should appear immediately
- Refresh the page if posts don't show

**Build failing?**
- Run `npm install` to ensure all dependencies are installed
- Clear `.next/` folder and rebuild: `rm -rf .next && npm run build`

---

**Questions?** Review the architecture in `README.md` or check the env file for configuration hints.
