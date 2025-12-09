# CORS Configuration Guide

## Supabase CORS Setup

The CORS errors you're seeing are because your Supabase project needs to allow requests from your Vercel domain.

### Steps to Fix:

1. **Go to your Supabase Dashboard**
   - Navigate to: https://supabase.com/dashboard
   - Select your project: `gpyptrceoyluftukrket`

2. **Configure CORS Settings**
   - Go to **Settings** → **API**
   - Scroll down to **CORS Origins** section
   - Add your Vercel domain:
     - `https://brand-influencer-hcww.vercel.app`
     - `https://*.vercel.app` (for preview deployments)
   - For local development, add:
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`

3. **Save Changes**
   - Click **Save** to apply the changes
   - Changes take effect immediately

### Alternative: Allow All Origins (Development Only)

⚠️ **Warning: Only use this for development!**

In Supabase Dashboard → Settings → API → CORS Origins, you can add:
- `*` (allows all origins)

**Do NOT use this in production** - it's a security risk.

### Verify CORS is Working

After configuring CORS, the errors should disappear. If you still see CORS errors:

1. Clear your browser cache
2. Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
3. Check the browser console for any remaining errors

### Current Configuration

- **Supabase Project ID**: `gpyptrceoyluftukrket`
- **Supabase URL**: `https://gpyptrceoyluftukrket.supabase.co`
- **Vercel Domain**: `https://brand-influencer-hcww.vercel.app`

