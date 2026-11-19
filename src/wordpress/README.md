# MotorHearts: Vercel frontend + Hestia WordPress CMS

## Final architecture

| Purpose | URL |
| --- | --- |
| Main public React website | https://motorhearts-website.vercel.app/ |
| React content-management links and plugin download | https://motorhearts-website.vercel.app/editor |
| WordPress backend on Hestia | https://motorhearts.testingweblink.com/ |
| WordPress admin | https://motorhearts.testingweblink.com/wp-admin/ |
| Published posts and embedded featured images/authors | https://motorhearts.testingweblink.com/wp-json/wp/v2/posts?_embed=1 |
| Categories and category artwork | https://motorhearts.testingweblink.com/wp-json/wp/v2/categories |

React stays on Vercel. WordPress stays on Hestia. Do not copy React to Hestia, move WordPress to another hostname, change the WordPress theme to replace React, or redirect the entire backend to Vercel. The WordPress theme is not used by the public React website. Both WordPress Address and Site Address under Settings → General remain https://motorhearts.testingweblink.com; WP_HOME and WP_SITEURL overrides, if present, must agree with that backend address.

## Vercel configuration

In the existing MotorHearts Vercel project, set this public build variable in Project Settings → Environment Variables:

```env
VITE_WORDPRESS_URL=https://motorhearts.testingweblink.com
```

Use the Vite framework preset and dist output directory. Keep deploying this React repository to the existing Vercel project. The existing vercel.json provides the SPA rewrite for direct /article/..., /category/... and /editor visits. Redeploy after changing source or environment variables. Vite embeds environment variables at build time; an .env file uploaded to WordPress does not update React.

The app also defaults to this exact backend when the variable is absent. Remove any older Vercel override pointing to a proposed cms subdomain or the frontend itself. Use only the WordPress base URL, not /wp-admin or /wp-json. No frontend origin variable, application password or API key is required. Never put WordPress credentials or secrets in VITE_ variables: they are public bundle values.

## Install or update MotorHearts Content 1.1.0

1. Deploy the updated React repository on Vercel so its plugin download includes version 1.1.0.
2. Visit https://motorhearts-website.vercel.app/editor and click Download WordPress plugin.
3. Sign into https://motorhearts.testingweblink.com/wp-admin/.
4. Open Plugins → Add New Plugin → Upload Plugin.
5. Upload motorhearts-content.zip, install and activate. If version 1.0.0 is already installed, choose Replace current with uploaded when WordPress prompts. Back up WordPress first. Updating preserves existing post, category and author metadata.
6. Check that Plugins shows MotorHearts Content version 1.1.0 as active. This version includes the production Vercel CORS policy.
7. Clear any WordPress/CDN REST-response cache, then return to the Vercel /editor page and click Refresh WordPress content.

Requires WordPress 6.0+ and PHP 7.4+. Activation creates the six original MotorHearts category slugs only if missing; it does not overwrite existing categories, posts, artwork or the React design. A fresh install of WordPress alone is not an installation of this plugin.

## Secure CORS policy

The plugin replaces WordPress's default REST origin-reflection handler. It grants cross-origin browser access only to the exact production origin https://motorhearts-website.vercel.app, only for GET, HEAD and OPTIONS, and only for the public wp/v2/posts and wp/v2/categories collection/detail routes. Featured media and authors are included in the posts response with _embed=1, so the frontend does not need authenticated or direct user-list endpoints.

Responses expose X-WP-Total, X-WP-TotalPages and Link for pagination and include Vary: Origin so caches do not reuse one origin's CORS decision for another. Cross-origin credentials are not allowed. The React fetches use credentials: omit and send no Authorization or X-WP-Nonce header. Same-origin WordPress REST administration retains WordPress's own CORS behavior and its normal login, capability and nonce protections.

There is no wildcard origin, no *.vercel.app allowance, no arbitrary origin reflection and no cross-origin write permission. CORS controls browser reads; it is not authentication and does not make published posts private. Requests without Origin, server-to-server readers, and normal navigation still obey WordPress's ordinary public/private access rules. WordPress continues to protect drafts, private posts and edit-context data through its existing permissions.

Vercel preview URLs, localhost and the embedded development preview are NOT allowlisted. They may show the explicit sample fallback even while the production website works. Validate this setup on the production Vercel URL. If another frontend origin is needed later, deliberately update the plugin's exact-origin policy; do not loosen it to a wildcard.

The plugin can set headers only on responses that reach WordPress. On Hestia or any CDN/reverse proxy, remove conflicting wildcard or duplicate Access-Control-Allow-Origin rules and make sure JSON REST requests and OPTIONS reach PHP. Do not configure CORS on Vercel expecting it to change WordPress responses. Cache REST responses with Origin in the cache key, or bypass caching for these public REST paths, and preserve Vary: Origin. A hosting challenge, WAF block, PHP error or proxy-generated response cannot be fixed by the React app. Do not disable site security globally to resolve a CORS issue.

## Publish articles

Go to Posts → Add New in WordPress. Enter the title and body, set a WordPress excerpt, assign categories and author, choose a Featured image, and Publish. The post slug becomes https://motorhearts-website.vercel.app/article/your-slug. Existing sample articles are not imported into WordPress automatically, and old browser-local editorial changes are not treated as live content.

The React pages, cards, category navigation, authors, search and guide archives read dynamic WordPress data through ContentContext.tsx. Published posts and categories are paginated in batches of 100; featured images and author details are embedded. Draft, private, future and password-protected posts are not displayed as ordinary public articles. Unpublish or trash a story in WordPress to remove it on the next successful refresh.

Paragraphs, headings, links, lists, images, captions, quotes, tables, code and self-hosted audio/video blocks are rendered safely within the existing React typography and reveal animations. Scripts, inline styles, forms, SVG and third-party iframe embeds are not executed. Use an ordinary link or self-hosted media instead of an iframe. WordPress theme CSS does not replace the React design.

## Manage homepage content

Open the MotorHearts Editorial panel beneath the WordPress post editor. If hidden, enable it in editor Preferences → Panels. Publish or Update to save its fields:

- Homepage cover story: selects the main hero. Checking this on a published story clears it on other published stories.
- Editorial spotlight: selects the editorial spotlight, also exclusive among published posts.
- Featured story: includes the story in the homepage edit. Featured order is ascending (lower first); ties use newest first. The homepage shows up to three and fills remaining slots with latest stories.
- Popular guide: includes the post on the homepage guides section and /guides.
- Dek / summary: optional override of the WordPress excerpt.
- Pull quote: optional quotation inserted after the second body block.
- Reading time: minutes; zero calculates automatically at 220 words/minute.
- Primary category: sets the article/card label and back link; also assign it in the standard Categories panel. Stories appear in all their assigned category archives.
- Specifications: optional lines such as Power | 612 hp. With no valid pairs, the specification panel is hidden.

No minimum number of posts or selections is required. If hero or spotlight is not chosen, the newest post is used. The design and animations are unchanged; these fields select content, not a new theme.

## Category images

Go to Posts → Categories. Edit the category name, slug and Description. Under MotorHearts category image, click Choose image to select a Media Library image or enter an HTTPS image URL, then save. These values drive category tiles, introductions and navigation. The six original categories retain their original order; additional WordPress categories also appear. Rename/delete unused categories in WordPress as appropriate.

## Contributors

Go to Users → Profile or Users → All Users → Edit. Set Display name publicly as, Biographical Info, MotorHearts Editorial role and Portrait. Save, then assign that user as a post author. The website lists contributors with published posts only and requests no private account details.

## Loading, errors and empty content

The existing loading skeletons remain in place. A successful response with zero posts shows the empty journal, not invented published content. One or two posts also work. Missing featured images use category artwork or the automotive fallback; broken card/cover images use the MotorHearts logo. Optional excerpts, reading times and contributor fields have defaults.

A response is fresh for one minute; the app checks updates when the tab regains focus and every five minutes while active. /editor also has a manual Refresh WordPress content control. The integration has a 25-second timeout per load and one retry. When a background refresh fails, the last successfully loaded content remains in memory with an error/retry notice. When the initial connection fails, bundled samples are explicitly labelled as fallback content, not WordPress publications.

The existing newsletter is still a browser-local demo. Its addresses are not sent to WordPress or an email provider; this integration does not turn it into a live subscription service.

## Verify after deployment and plugin activation

1. Open https://motorhearts.testingweblink.com/wp-json/wp/v2/posts?per_page=1&_embed=1 and the categories endpoint. Confirm JSON rather than HTML, login redirects or server errors. If /wp-json returns 404, save WordPress Settings → Permalinks.
2. Publish a post with a category and Featured image. Fill its MotorHearts fields and confirm the JSON includes a motorhearts object.
3. On https://motorhearts-website.vercel.app/editor, refresh content. Confirm published stories and plugin-field detection. Opening JSON directly is not enough to verify CORS; the browser request must originate from Vercel.
4. In browser developer tools, confirm a posts request from Vercel has Access-Control-Allow-Origin: https://motorhearts-website.vercel.app, no Access-Control-Allow-Credentials, and exposed pagination headers. A request with an unrelated Origin must not receive an allow-origin header. OPTIONS for the allowed routes should advertise only GET, HEAD and OPTIONS.
5. Visit the homepage, category archive, /guides and /article/your-slug. Confirm titles, bodies, images, bylines, quote and specifications. Transfer hero and spotlight to another published story and refresh.
6. Check an empty category, an unknown article slug, and (on a safe staging copy) a successful zero-post response. Check pagination when more than 100 posts exist.

Creating these files does not update an already-deployed Vercel bundle or install the plugin on the remote WordPress server. Deploy/redeploy Vercel and upload/activate the plugin to apply the integration and CORS changes. Live server/browser verification remains necessary after those external steps.
