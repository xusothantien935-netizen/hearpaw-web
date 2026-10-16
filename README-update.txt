# HearPaw — Fresh Mint Premium update

## Files in this package
- `index.html`: updated visual sections, product photos, metadata, and the demo-login gate.
- `styles.css`: complete stylesheet replacement; existing selectors and visibility rules are preserved.
- `assets/hearpaw-product.webp`: product hero/teaser image.
- `assets/hearpaw-colors.webp`: product color gallery image.

`script.js` and `login.html` are intentionally not included, so your current versions will not be overwritten.

## Apply safely
1. Download a backup of your current project first.
2. Replace `index.html` and `styles.css` with the files in this package.
3. Copy the `assets` folder alongside them. Keep your current `script.js` and `login.html`.
4. Confirm that the login page sets `sessionStorage.setItem("hearpawDemoLogin", "yes")` after a successful demo login.
5. Deploy, then hard refresh with `Ctrl + Shift + R`.

All existing IDs, `data-*` attributes, page IDs, dashboard panel IDs, and JavaScript event hooks found in the source bundle were preserved. GPS, alerts, checkout and contact submission remain demo-only.


CAP NHAT ANH SAN PHAM HEARPAW
- Anh san pham chinh hien tai:
  collar1-main.webp = Vong co thong minh - vai
  collar2-main.webp = Vong co thong minh Gen2
  tag1-main.webp = The ten ca nhan hoa - kieu xuong
  tag2-main.webp = The ten ca nhan hoa - kieu tron
  leash2-main.webp = Day dat thu cung - da mem
  leash1-main.webp = Day dat thu cung - vai mem

- Khi chua co anh rieng theo mau, website tu dong hien anh san pham chinh.
- De them anh rieng theo mau, dat anh WebP trong thu muc assets voi ten:
  collar1-moss.webp, collar1-beige.webp, collar1-pink.webp, collar1-lavender.webp, collar1-black.webp
  collar2-moss.webp, collar2-beige.webp, collar2-orange.webp
  leash1-green.webp, leash1-butter.webp, leash1-pink.webp, leash1-sky.webp
  leash2-green.webp, leash2-butter.webp, leash2-red.webp
  tag1-silver.webp, tag1-pink.webp
  tag2-silver.webp, tag2-pink.webp
  Ten file phai viet thuong va dung ma mau nhu tren. Neu file mau chua ton tai, website se dung anh -main.webp.
- Khong doi ten file HTML/CSS/JS hoac thu muc assets.
