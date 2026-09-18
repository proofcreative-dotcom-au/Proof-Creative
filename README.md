# Proof Creative — portfolio site

Static site, no build step.

## Deploy to GitHub Pages
1. Create a repo and push these files to the root of the `main` branch.
2. Repo Settings → Pages → Source: "Deploy from a branch" → `main` / root.
3. For the custom domain: keep the `CNAME` file, and point DNS for proofcreative.com.au (A records to GitHub Pages IPs, or ALIAS/ANAME) then enable "Enforce HTTPS".
4. If you serve from `username.github.io/<repo>` instead of the custom domain, delete `CNAME` — note canonical/og URLs in the HTML point to proofcreative.com.au.

## Files
- `index.html` + 12 pages, `assets/` + `uploads/` images
- `support.js`, `nav-scroll.js`, `reveal.js`, `image-slot.js` — runtime scripts (required)
- `sitemap.xml`, `robots.txt`

## Uploading to GitHub (read before dragging files)
- This folder contains **67** files. If GitHub's uploader says 66, `.nojekyll` was skipped - macOS Finder hides dotfiles and leaves them out of a drag selection.
- `.nojekyll` must exist at the repo root or Pages runs the files through Jekyll. `CNAME` must exist or the apex domain drops.
- Both already live in the repo, and an upload only adds/overwrites, never deletes - so a 66-file push is safe. Only a repo wipe would lose them.
- To include hidden files in a drag, press Cmd+Shift+. in Finder first.
