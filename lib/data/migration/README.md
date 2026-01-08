# Portland Fresh Migration Files

This folder contains **Portland Fresh-branded versions** of shared infrastructure files (Sanity schemas and Supabase Edge functions) that are ready to deploy when you migrate to your own instances.

## When to Use These Files

When you set up your own:
- **Sanity instance** → Copy files from `migration/sanity/` to `sanity/schemas/`
- **Supabase instance** → Copy files from `migration/supabase/` to `supabase/functions/`

---

## Files Included

### Sanity Schemas

| File | Changes Made |
|------|--------------|
| `sanity/blendsPage.ts` | "Our Blends" → "Our Sauces"; Removed "cold-pressed" and "wellness journey" |
| `sanity/post.ts` | Removed "Wellness" category; Added "Flavor" and "Kitchen Tips" categories |

### Supabase Functions

| File | Changes Made |
|------|--------------|
| `supabase/send-email/index.ts.template` | "Farm-Pressed Nutrition" → "Small-Batch Sauces & Pestos"; Removed "Ambassador" and "wellness" language |

---

## Detailed Change Log

### `blendsPage.ts`

**Line 12 - Heading Initial Value:**
```diff
- initialValue: 'Our Blends',
+ initialValue: 'Our Sauces',
```

**Line 19 - Subheading Initial Value:**
```diff
- initialValue: 'Each blend is carefully crafted with cold-pressed organic ingredients to support your wellness journey.',
+ initialValue: 'Each sauce is carefully crafted from organic ingredients, blended fresh and delivered within 48 hours of production.',
```

---

### `post.ts`

**Lines 65-71 - Category Options:**
```diff
  options: {
    list: [
-     { title: 'Nutrition', value: 'nutrition' },
+     { title: 'Flavor', value: 'flavor' },
      { title: 'Recipes', value: 'recipes' },
-     { title: 'Wellness', value: 'wellness' },
+     { title: 'Kitchen Tips', value: 'kitchen-tips' },
      { title: 'Sustainability', value: 'sustainability' },
      { title: 'Behind the Scenes', value: 'behind-the-scenes' },
    ],
  },
```

---

### `send-email/index.ts`

**Line 180 - Header Tagline:**
```diff
- <div class="tagline">Farm-Pressed Nutrition</div>
+ <div class="tagline">Small-Batch Sauces & Pestos</div>
```

**Lines 187-190 - Footer Referral CTA:**
```diff
- <p style="...">Love Portland Fresh? Become an Ambassador!</p>
- <p style="...">Earn rewards when you share the wellness with friends.</p>
- <a href="https://pdxfreshfoods.com/ambassador" style="...">Join the Movement</a>
+ <p style="...">Love Portland Fresh? Share the Flavor!</p>
+ <p style="...">Refer friends and earn rewards on your next order.</p>
+ <a href="https://pdxfreshfoods.com/referral" style="...">Share Your Link</a>
```

---

## Additional Schemas That May Need Review

These schemas in `sanity/schemas/` use "blend" terminology but may be acceptable as-is since "blend" can refer to the sauce blending process:

| File | Content | Recommendation |
|------|---------|----------------|
| `homePage.ts` | `featuredBlendsHeading`, `featuredBlends` field names | **Keep** - internal field names, customer sees CMS content |
| `ingredientsSourcingPage.ts` | "What Goes Into Our Blends" | **Optional** - Could change to "What Goes Into Our Sauces" |
| `subscriptionsPage.ts` | "blend mix and size" | **Optional** - Could change to "sauce selection and size" |
| `processPage.ts` | "Cold-blended" | **Keep** - describes the actual process |
| `aboutPage.ts` | "batch-blended sauces" | **Keep** - describes the process correctly |

---

## Migration Checklist

When setting up your own Sanity/Supabase:

- [ ] Create new Sanity project
- [ ] Copy `migration/sanity/*.ts` to `sanity/schemas/`
- [ ] Update `sanity/schemas/index.ts` imports if needed
- [ ] Run `sanity deploy` to deploy studio
- [ ] Create new Supabase project
- [ ] Copy `migration/supabase/send-email/index.ts.template` to `supabase/functions/send-email/index.ts`
- [ ] Run `supabase functions deploy send-email`
- [ ] Update environment variables in Vercel to point to new instances
- [ ] Test email sending and CMS content

---

## Local Files Already Updated

These files in the main codebase have already been updated with Portland Fresh branding and don't need migration:

- `lib/email/variable-substitution.ts` - Uses "Small-Batch Sauces & Pestos", "Portland, OR"
- `lib/email/templates.tsx` - Uses jar emoji, correct tagline
- `lib/email/templates/*.tsx` - All use correct branding
- `app/(website)/about/page.tsx` - No wellness language
- `app/(website)/page.tsx` - No wellness language
- `app/(website)/welcome/page.tsx` - Uses jar emoji
- `components/Header.tsx` - Uses brand palette colors

---

## Questions?

Contact the development team for migration support.
