# MotorHearts WordPress integration

WordPress source: https://motorhearts.testingweblink.com/
React administration page: /editor

## Install the plugin

1. Open /editor on the React website and click Download WordPress plugin.
2. Sign into https://motorhearts.testingweblink.com/wp-admin/.
3. Open Plugins → Add New Plugin → Upload Plugin.
4. Select motorhearts-content.zip, click Install Now, then Activate.
5. Activation adds the six MotorHearts categories only if their slugs do not already exist. It does not overwrite posts, existing categories, images, styling or the WordPress theme.

Requires WordPress 6.0+ and PHP 7.4+. No application password, API secret, React backend or extra database is needed. The React website reads only public posts, categories and public author information. All editing occurs inside authenticated WordPress admin with standard permissions and nonce-protected plugin forms.

## Publish an article

Go to Posts → Add New. Set the title, body, excerpt, category, author, featured image and publication date with the normal WordPress controls. Use the slug field to determine /article/your-slug on the React site. Existing WordPress post slugs become the React article URLs; old sample URLs exist only in the explicitly labelled offline fallback.

Write in the block editor. Paragraphs, headings, images, captions, links, lists, quotes, tables, code and self-hosted video/audio are supported. Scripts, inline styles, forms, SVG and third-party iframe embeds are intentionally not executed. Use an ordinary link or a self-hosted media block instead of an iframe. WordPress theme/block layout classes do not replace the React design.

Open the MotorHearts Editorial panel beneath the post editor (enable it in editor Preferences → Panels if hidden):

- Homepage cover story: selects the cover. Selecting a published story clears this flag on other published posts.
- Editorial spotlight: selects the spotlight, also exclusive among published posts.
- Featured story: adds it to the featured section. Featured order is ascending; ties use newest first. At most three appear. Any remaining slots are filled from the latest posts.
- Popular guide: includes it on the Guides page and homepage guide section.
- Dek / summary: overrides the excerpt when filled.
- Pull quote: an optional editorial quotation inserted after the second body block.
- Reading time: minutes; zero calculates automatically at 220 words/minute.
- Primary category: choose one of the categories also assigned in the normal Categories panel. This determines the article label and back link.
- Specifications: one line per pair, for example Power | 612 hp. Optional; the specification panel is hidden when empty.

Publish or Update. Drafts, private posts, password-protected bodies and future-dated posts are not shown as ordinary public stories. Avoid password protection for stories intended for this public website. Authors and categories are derived from the REST API, not the old browser-local editor.

## Categories and images

Go to Posts → Categories. Edit each of the six categories. Set its name, slug and Description. Set MotorHearts category image with Choose image or an HTTPS image URL. Save. These values drive navigation, homepage category tiles and category archive introductions. Additional WordPress categories also appear, including Uncategorized if present; delete unused categories or rename them in WordPress if desired. A story can belong to several category archives; its primary category sets its card label.

## Contributors

Go to Users → Profile or Users → All Users → Edit. Set Display name publicly as, Biographical Info, MotorHearts Editorial role and Portrait. Save. Public bylines, author cards and archives use these values. Only authors with published posts are listed; no private account details are requested.

## Loading, fallback and refresh behavior

The React app reads /wp-json/wp/v2/posts?_embed=1 and /wp-json/wp/v2/categories, paging in batches of 100. It checks updates when the tab regains focus, every five minutes while active, or when Refresh WordPress content is clicked on /editor. A successfully loaded response is fresh for one minute. If a background refresh fails, the last successfully loaded content remains in memory with a retry notice. If the initial connection fails, bundled sample content appears with a prominent explicit fallback notice. This is not silently treated as live WordPress content.

A successful zero-post response shows an empty journal rather than sample stories. One or two posts also work without requiring a hero, spotlight or three featured selections. Missing featured images use category artwork or a sample automotive fallback; broken image URLs use the existing MotorHearts logo. Missing excerpts, roles, reading times and optional editorial fields have safe defaults.

Before the plugin is activated, standard published posts, featured images, categories, excerpts and authors still load. Custom selections become available after activation. The /editor page shows whether the plugin fields were detected on published posts; detection is not possible with no posts.

## Connection troubleshooting and deployment

Visit https://motorhearts.testingweblink.com/wp-json/wp/v2/posts?per_page=1&_embed=1 in a browser. It must return JSON, not a login screen, hosting challenge or HTML error. Under Settings → Permalinks, save the permalink settings if /wp-json/ returns 404. Ensure REST API access for public posts and categories is not disabled by a security plugin. The WordPress server/CDN must allow browser CORS access from the deployed React origin and expose X-WP-TotalPages (WordPress normally does both). Requests omit credentials and do not send admin cookies. Keep WordPress and image URLs on HTTPS.

Deploy the React app with an SPA fallback to index.html so direct /article/... and /category/... links work. If hosting serves WordPress and React on the same domain, route /wp-json/, /wp-admin/ and /wp-content/ to WordPress, not the SPA. Clear any WordPress/CDN REST cache if updated posts appear stale. The WordPress URL is centralized in src/lib/wordpress.ts.

Newsletter addresses remain the existing browser-local demo; this integration does not turn that form into an email subscription service. Existing local demo addresses are retained and can be removed on /editor. The old motorhearts-content-v1 browser content is no longer read as editorial data and is not imported into WordPress automatically.

## Verification after activation

Publish one article with an image, assign a category, check all editorial flags and fill the optional fields. Visit the homepage, its category page, /guides and /article/your-slug. Confirm author, specifications, quote and images. Transfer hero and spotlight to another published post. Try more than 100 posts if your archive is that large. Test a category with no posts and an unknown article slug. Temporarily unpublish all posts on a staging site to check the empty journal. Restore them afterward. WordPress activation and remote browser/CORS behavior must be verified on your server; creating the integration files does not activate the plugin remotely.
