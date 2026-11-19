# MotorHearts WordPress integration

Current default WordPress source: https://motorhearts.testingweblink.com/
Configurable CMS base: VITE_WORDPRESS_URL (see .env.example)
React administration page: /editor on whichever domain serves React

## React at the public URL, WordPress as the CMS on Hestia

Seeing the default WordPress theme means the domain is serving the WordPress installation. Installing the MotorHearts plugin or connecting the REST API does not deploy the React website, replace a WordPress theme or change DNS. The existing React frontend remains a separate application. No frontend redesign is needed.

### Recommended URL layout

| Purpose | Suggested URL | What Hestia serves |
| --- | --- | --- |
| Public MotorHearts website | https://motorhearts.testingweblink.com/ | React production index.html and static assets |
| WordPress CMS | https://cms.motorhearts.testingweblink.com/ | The WordPress PHP installation |
| Content management | https://cms.motorhearts.testingweblink.com/wp-admin/ | WordPress admin |
| Published content API | https://cms.motorhearts.testingweblink.com/wp-json/wp/v2/posts?_embed=1 | WordPress JSON, not the React index.html |
| React management links | https://motorhearts.testingweblink.com/editor | Existing React editor page with CMS links |

These CMS URLs are a proposed deployment, not a provisioned subdomain. The app deliberately continues to read the current WordPress installation until you configure a verified replacement. If you want the final public site on motorhearts.com instead, you may keep WordPress at motorhearts.testingweblink.com and deploy React to motorhearts.com; no CMS migration or change to the current default API address is necessary.

### Safe Hestia setup order

1. Back up the current WordPress database and files through Hestia or your backup tool. Keep the backup outside publicly served web directories. Do not delete the working installation or overwrite its directory with React yet.
2. In the authoritative DNS provider, add an A record for cms.motorhearts.testingweblink.com pointing to the Hestia server. Add an AAAA record only if the server actually serves IPv6. If testingweblink.com DNS is managed elsewhere, creating a Hestia web domain alone will not create the public DNS record there.
3. In Hestia → Web, add cms.motorhearts.testingweblink.com as a separate web domain, not as an alias of the React domain. Enable SSL and obtain a certificate once DNS resolves. This separates its document root from the public React website.
4. Migrate the current WordPress site to that CMS web domain using a WordPress migration/backup tool or your hosting administrator. Preserve posts, users, uploads and the MotorHearts plugin. A normal Hestia document root is /home/<hestia-user>/web/cms.motorhearts.testingweblink.com/public_html/; confirm the actual path in your panel.
5. On the migrated site, set both WordPress Address (URL) and Site Address (URL) under Settings → General to https://cms.motorhearts.testingweblink.com. Do NOT set either to the React website URL for this separate-domain layout. If WP_HOME or WP_SITEURL is defined in wp-config.php, your administrator must update those overrides too. Use migration tooling that safely updates serialized URLs in the database; do not do a blind text replacement of SQL. Update old upload URLs and any absolute post/category portrait URLs before removing the original installation.
6. Verify the new CMS login, media URLs, categories and REST API. Save Settings → Permalinks on the migrated CMS if its REST routes return 404. Install/activate the MotorHearts plugin there if it was not included in the migration.
7. Set the React build environment variable as shown below. Generate a NEW production build of this React project through your build/deployment platform. The current source configuration is not applied to an already-built bundle automatically.
8. Only after the CMS works and the backup is secure, deploy the CONTENTS of that new React dist directory into the public domain's public_html directory, or point that domain to your React deployment provider. The React index.html must be directly in the public document root with its assets directory beside it, not nested inside public_html/dist. Do not upload React source files, node_modules, or the WordPress plugin as the website. Do not leave an old WordPress installation/index.php in the public React document root; securely relocate it after migration rather than deleting its only copy.
9. Configure SPA routing for the public React domain as described below, then clear any CDN cache. Confirm that / loads MotorHearts and directly opening /article/a-published-slug and /category/cars also loads React. The CMS domain must continue serving PHP and WordPress REST routes normally.

### React build configuration

Set this public variable in your frontend build platform, or copy .env.example to .env.local and set it before creating a production build:

```env
VITE_WORDPRESS_URL=https://cms.motorhearts.testingweblink.com
```

Use the installation base URL only: no /wp-admin, /wp-json, credentials, query string or fragment. A WordPress installation in a subdirectory is also supported, for example https://example.com/cms. Admin links, API requests and relative media URLs derive from this value. React page links automatically use the domain serving the frontend; a separate frontend URL variable is not needed.

Vite embeds this value at BUILD TIME. Changing Hestia's PHP environment or uploading an .env file beside an existing index.html will not change an already-generated frontend. Rebuild and redeploy after changing it. Never put admin passwords or private API keys in VITE_ variables.

### SPA routing on the frontend domain only

A request for an existing asset must serve that asset. A React page route such as /article/... must serve React index.html rather than a WordPress page or server 404. Do not apply a React fallback to the CMS domain, /wp-admin or /wp-json.

- For Nginx-only Hestia hosting, have your administrator select/create a persistent custom Hestia SPA web template. Its frontend page location should implement `try_files $uri $uri/ /index.html;`, with missing static assets returning 404. Hestia can regenerate virtual-host files, so do not overwrite panel-generated files or paste a duplicate location block into an unknown template. The exact template depends on your Hestia web stack and current configuration.
- For an Apache-backed domain where AllowOverride permits mod_rewrite, place this .htaccess beside React index.html. If Hestia also uses an Nginx proxy, its routing must forward React page routes to Apache instead of returning its own 404:

```apache
DirectoryIndex index.html
RewriteEngine On
RewriteRule ^assets/ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [L]
```

- If deploying React on Vercel instead, the project's existing vercel.json provides the SPA rewrite. Attach the public domain to that deployment and follow that provider's DNS instructions; leave the CMS domain pointing to Hestia. Do not point the same hostname simultaneously at competing React and WordPress hosts.

### Connection and launch checks

Open the new CMS /wp-json/wp/v2/posts?per_page=1&_embed=1 and /wp-json/wp/v2/categories in a browser. Both must return JSON without redirecting to the old domain or returning a hosting/login challenge. Then open /editor on the PUBLIC React site and click Refresh WordPress content to confirm browser-based access. Directly opening JSON alone does not prove cross-origin access works.

The CMS must permit public REST requests from the frontend origin and expose X-WP-TotalPages. WordPress normally handles this; check security plugins, reverse proxies and CDN policies if browser requests fail. Keep requests anonymous (the integration uses credentials: omit); no WordPress admin password or application password is required. Do not disable security globally to fix CORS, and do not cache public API requests as HTML pages.

A default WordPress theme may still appear if someone visits the CMS root. That is harmless: visitors should use the public React URL. Do not redirect the whole CMS hostname to React; that would break admin, API and media requests. Optional CMS-root-only redirects require a separate, carefully scoped hosting change and are not needed for this integration.

The app changes alone cannot migrate WordPress, set DNS, issue SSL certificates, deploy production assets or reconfigure Hestia. Those are hosting actions to complete and verify in your panel. The original frontend components, styling, logo and animations do not need replacing.

## Install the plugin

1. Open /editor on the React website and click Download WordPress plugin.
2. Sign into the configured CMS /wp-admin/ (currently https://motorhearts.testingweblink.com/wp-admin/; use the CMS subdomain after migration).
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

Visit the configured CMS base URL followed by /wp-json/wp/v2/posts?per_page=1&_embed=1 in a browser. With the current default, that is https://motorhearts.testingweblink.com/wp-json/wp/v2/posts?per_page=1&_embed=1; after migration use the CMS subdomain instead. It must return JSON, not a login screen, hosting challenge or HTML error. Under Settings → Permalinks, save the permalink settings if /wp-json/ returns 404. Ensure REST API access for public posts and categories is not disabled by a security plugin. The WordPress server/CDN must allow browser CORS access from the deployed React origin and expose X-WP-TotalPages (WordPress normally does both). Requests omit credentials and do not send admin cookies. Keep WordPress and image URLs on HTTPS.

Deploy the React app with an SPA fallback to index.html so direct /article/... and /category/... links work. Prefer the separate CMS hostname layout above. Hosting both on the same hostname requires intentionally routing the WordPress installation paths, admin, REST API and uploads to PHP while serving frontend pages from React; this is not achieved by simply copying React over WordPress. Clear any WordPress/CDN REST cache if updated posts appear stale. Set VITE_WORDPRESS_URL before the frontend build; URL handling is centralized in src/lib/wordpress.ts.

Newsletter addresses remain the existing browser-local demo; this integration does not turn that form into an email subscription service. Existing local demo addresses are retained and can be removed on /editor. The old motorhearts-content-v1 browser content is no longer read as editorial data and is not imported into WordPress automatically.

## Verification after activation

Publish one article with an image, assign a category, check all editorial flags and fill the optional fields. Visit the homepage, its category page, /guides and /article/your-slug. Confirm author, specifications, quote and images. Transfer hero and spotlight to another published post. Try more than 100 posts if your archive is that large. Test a category with no posts and an unknown article slug. Temporarily unpublish all posts on a staging site to check the empty journal. Restore them afterward. WordPress activation and remote browser/CORS behavior must be verified on your server; creating the integration files does not activate the plugin remotely.
