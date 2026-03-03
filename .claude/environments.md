# Environments

## Overview

| Environment | Git Branch | Frontend | Backend API |
|-------------|------------|----------|-------------|
| **DEV** | `main` | dev.nexus.com | dev-api.nexus.com |
| **STAGING** | `staging` | staging.nexus.com | staging-api.nexus.com |
| **PRODUCTION** | `PRODUCTION` | nexus.com | api.nexus.com |

## Databases (Supabase)

| Environment | Project |
|-------------|---------|
| DEV | heprlhlltebrxydgtsjs |
| STAGING | ujzsbwvurfyeuerxxeaz |
| PRODUCTION | jbriwassebxdwoieikga |

## Promotion Flow

```
main (DEV) → staging (STAGING) → PRODUCTION
```

Use GitHub Actions "Promote Branch" workflow to promote between environments.
