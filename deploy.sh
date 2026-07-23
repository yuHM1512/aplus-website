#!/bin/bash
# APLUS — Commit & Push to GitHub
# Chạy: bash deploy.sh

cd "$(dirname "$0")"

# Remove stale lock if exists
rm -f .git/index.lock

# Stage all changes
git add -A

# Commit 1: Admin panel + Auth (Phase 2)
git commit -m "feat: admin panel with auth, CRUD products/posts/contacts

- NextAuth credentials login (admin@aplustechnologies.vn)
- Admin layout: sidebar, topbar, dashboard with stats
- Products CRUD: form with key-value specs, brand, badge, pricing
- Posts CRUD: create/edit with category, AI generated flag
- Contacts: status management (new → read → replied)
- Settings page scaffold
- Toast notifications + confirmation dialogs
- Vietnamese localization throughout
- Middleware route protection for /admin/*"

echo ""
echo "✅ Committed. Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Pushed! Vercel sẽ tự deploy."
echo ""
echo "⚠️  QUAN TRỌNG — Chạy thêm 2 lệnh sau để seed database:"
echo "  npx prisma db push"
echo "  npx prisma db seed"
