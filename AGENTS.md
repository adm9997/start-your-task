<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Site copy/prices/brand live in `src/lib/site.ts`; migrated visual styles are plain CSS classes in `src/styles.css` (ported from the original static site) — keep using those classes for consistency.
- Story form inserts directly from the browser into `public.pedidos` via an anon insert-only RLS policy; nobody outside can read orders.
