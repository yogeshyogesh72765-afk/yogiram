News Hub — Frontend-only News System

Features:
- Responsive frontend (index + blog pages)
- Hero slider, Trending sidebar, Categories
- Search + Pagination
- Admin (login: admin / 123456) to Add/Edit/Delete posts (stored in localStorage)
- Import sample posts for demo

How to use:
1. Unzip and serve on GitHub Pages or local server.
2. Go to /admin/login.html (user: admin, pass: 123456) to publish posts.
3. Posts are stored in browser localStorage. For persistence across devices, you need backend.

To run locally:
python -m http.server 8000
open http://localhost:8000
