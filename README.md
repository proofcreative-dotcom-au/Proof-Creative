# Proof Creative / Final GitHub Pages package
## Release 10.0 - charcoal approved, studio stationery added

This is the complete static website, not the all-in-one review viewer. The archive contains the deployable files at its root: `index.html`, the other pages, `assets/`, `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`, favicons and a custom `404.html`.

There are 28 content pages and one 404 utility page. The sitemap contains the 27 indexable content pages. The privacy policy and 404 page deliberately retain `noindex,follow`.

No build command, npm install, framework server, API key, or new GitHub Actions workflow is required. Font binaries are not included; the approved Instrument Sans, Barlow and Barlow Condensed families load from Google Fonts.

## What is approved in this release

- Charcoal supporting copy and reduced red emphasis are fixed, based on Edition 09.5.
- The supplied business-card photograph is featured immediately before Why Proof. The entire front-and-back composition is retained. Click or tap the photograph to enlarge it.
- The Brick Architects previous/new identity slider is preserved, with mouse, touch and keyboard controls.
- Existing case-study crops, secondary images, testimonials, monochrome client logos, service icons, fast transitions, animated red corner and the Proof Gin magnifier are retained.
- Instrument Sans headlines, Barlow body and Barlow Condensed labels remain approved. The proposed separate headline-tracking experiment has not been silently applied.
- No em dashes are present in editable page copy. Previously approved spaced en dashes remain.
- Review toolbars, design notes, prototype labels and demonstration form handlers are removed from the published pages.
- The original supplied site URLs are all retained. No invented redirect rules have been added.

## 1. Review the files locally

Extract the ZIP first. In Chrome or Edge, use Open File to open `index.html` from the extracted folder. Keep `assets/` alongside the pages. Internet access is needed for the webfonts. The business-card photo, logos, icons and project images are local files.

The site has ordinary HTML navigation. There is no embedded review container. Opening an HTML attachment inside a chat or document viewer may display source code instead of a webpage; open the extracted file in a browser.

Local and non-production form submissions are deliberately blocked with an explicit message. Analytics also remain off outside the production hostname. No test enquiry was sent while creating this package.

## 2. Save a rollback point

Before replacing the live site, commit or tag the current repository version, or download its current ZIP. Keep that backup outside the published site. The earlier 09.4 and 09.5 packages are not overwritten by this release.

## 3. Copy into the existing repository

Use the existing Proof Creative website repository. Copy the CONTENTS of the extracted deployment folder into its current GitHub Pages publishing folder.

- `index.html` must be at the top level of the published folder, not nested in another release folder.
- Replace matching HTML, CSS, JavaScript and image files with the versions in this release.
- Merge the `assets/` folder rather than deleting unrelated existing assets. Preserve email-signature images, verification files and anything managed separately from the website.
- Include the hidden `.nojekyll` file. GitHub Desktop or Git preserves it reliably.
- Upload/commit the extracted files, not the ZIP.
- Do not publish the old `OPEN_PROOF_REVIEW.html` or any old all-in-one review file. It is not needed for the live site.

For a standard branch-based configuration, Settings > Pages uses **Deploy from a branch**, your publishing branch (usually `main`), and **/(root)**. If your existing site publishes from `/docs`, put the files there and retain that setting instead. Do not replace a working deployment configuration without checking it.

Official GitHub guidance:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site

## 4. Preserve the existing domain

The supplied original website has `proofcreative.com.au` in its CNAME. This release preserves that exact hostname. Canonicals, structured-data URLs, Open Graph URLs and the sitemap consistently use `https://proofcreative.com.au`.

Keep the existing custom-domain setting and Enforce HTTPS. Do not change the existing DNS simply to install this design. Verify both the apex and www address after publication. GitHub's repository custom-domain setting must agree with the hostname; a CNAME file by itself does not configure a new domain.

https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## 5. Enquiry delivery and booking

Both forms now have production submission handlers instead of demonstration behavior.

The original source supplied with this project contained these integrations, which are reused:

- Formspree form `mbdnaade` is the primary email-delivery endpoint.
- HubSpot portal `443370178`, form `385040a1-12c8-4aa1-987a-044a6a2f17ab` receives a secondary contact/project copy after Formspree confirms acceptance.
- The existing Google Calendar discovery-call link is unchanged.
- The original GA4 measurement and Microsoft Clarity IDs are restored, restricted to `proofcreative.com.au` and `www.proofcreative.com.au` over HTTPS.
- A `generate_lead` event fires only after successful primary submission. Clicking a button or failing validation does not count as a lead. Duplicate submission is blocked after success.
- Error handling retains entered data. The displayed error state gives a direct email/phone fallback.
- PROOF CHECK remains an enquiry, not a checkout, payment or booking commitment.

The optional PROOF CHECK image input accepts a sharing URL or invites email attachments. Direct uploads were not enabled because the Formspree account's upload entitlement could not be verified. This avoids publishing a file-upload control that might reject enquiries.

The privacy page retains the supplied policy, removes the prototype disclaimer and clarifies the existing Formspree/HubSpot enquiry flow. This is not a legal compliance review. The owner should ensure the policy and analytics consent arrangements remain suitable for the business and its visitors.

## 6. Required live acceptance checks

Before treating the deployment as launched:

1. Submit one clearly marked test through each form on the live custom domain. Confirm the email arrives and the HubSpot contact/project data is correct. Account activation, allowed-domain rules, spam settings, field restrictions and notification routing cannot be confirmed from local files.
2. Confirm the discovery-call link opens the intended calendar.
3. Confirm the approved webfonts load, and review on an actual iPhone/Safari as well as desktop Chrome/Edge.
4. Test the Brick slider, magnifier, galleries, mobile menu, photograph enlargement and reduced-motion mode.
5. Check `robots.txt`, `sitemap.xml`, the homepage and the new Brick page at the final domain. Submit or refresh the sitemap in Search Console.
6. Check the live response headers, HTTPS, redirect behavior and PageSpeed/Core Web Vitals after deployment. Local DOM testing is not a field-performance result.

## Test scope for this package

- Static validation of internal file links, fragment targets, image paths, JSON-LD, canonical URLs, page titles, robots tags and sitemap entries.
- 29 pages rendered at 1440, 768 and 390 pixels in Chromium, using in-memory local-asset rendering. No overflow, missing loaded images or JavaScript page errors were found in those checks.
- Mouse and keyboard slider tests, gallery open/close, mobile menu, stationery modal, magnifier and motion toggle checks.
- Form success, validation/error/network states and duplicate tracking tested with mocked responses. Local submit guard also tested.
- External webfonts and live third-party services could not load in the test environment. Screenshots use font fallbacks. No live form submission, production deployment or external account configuration was performed.

## Where to edit

- Business-card feature: `index.html` > `#studio-stationery`, `assets/launch.css` and `assets/studio/`.
- Approved charcoal layer: `assets/charcoal-editorial.css`.
- Before/after slider: `case-study-brick-architects.html`, `assets/identity-comparison.css`, `assets/identity-comparison.js`.
- Enquiry processing: `assets/forms.js`. The only allowed live hosts are listed at the top.
- Analytics: `assets/analytics.js`.
- Existing responsive styling and interactions remain in the other readable CSS/JS files. They do not require a compilation step.

## Restoring the previous release

Revert the deployment commit or restore the saved repository backup. Avoid deleting unrelated signature/verification files while reverting. No changes were made to your live site as part of preparing this package.
