# AI Infra Monitor — Dev Log

## 2026-03-23 — Task 1: Docker Compose Infrastructure

**Done:**
- Created `docker-compose.yml` with postgres, redis, n8n, dify services
- Configured volumes, environment variables, health checks
- Mounted Obsidian vault in n8n container for file access

**State:** All services defined and startable with `docker compose up`.

---

## 2026-03-23 — Task 2: Database Schema

**Done:**
- Replaced placeholder in `db/init.sql` with full production schema: `raw_signals`, `triage_results`, `investigations`, `tracked_entities`, `delivery_log` tables
- Added uuid-ossp extension and appropriate indexes (unique on url/hash, btree on source, collected_at, signal_id, significance_score)
- Created `scripts/seed-entities.sql` with 20 tracked AI infra companies across sectors: foundation_models, compute, inference, infra_platform, tooling, mlops, data, ai_coding
- Committed as `feat: add full database schema and seed entities`

**Decisions:**
- Kept n8n database creation line at top of init.sql per spec requirement
- Used JSONB for `entities`, `metadata`, and `aliases` fields for flexible querying
- Partial indexes on url/hash uniqueness (WHERE NOT NULL) to allow multiple null values

**State:** Schema ready; PostgreSQL container will auto-apply on first start. Next: Task 3 (Hacker News n8n collector workflow).

**Blockers:** None
