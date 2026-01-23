# Kyward - Complete Integration Documentation

## Project Overview

Kyward is a Bitcoin security assessment platform with subscription-based plans. The platform integrates with BTC Guardian, a Telegram bot for wallet monitoring.

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│  Node.js API    │────▶│    Supabase     │
│   (Frontend)    │     │   (Backend)     │     │   (Database)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                               ▼
                        ┌─────────────────┐
                        │  BTC Guardian   │
                        │  (Telegram Bot) │
                        └─────────────────┘
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://kyward.onrender.com/api
```

### Backend (.env)
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_key
JWT_SECRET=your_jwt_secret
OPENNODE_API_KEY=your_opennode_key
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/validate` | Validate session token |
| POST | `/api/auth/logout` | User logout |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/user` | Get current user data |
| POST | `/api/user/upgrade` | Upgrade subscription |
| POST | `/api/user/email-preferences` | Update email preferences |

### Assessments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/assessments` | Save new assessment |
| GET | `/api/assessments` | Get user's assessments |
| GET | `/api/assessments/can-take` | Check if user can take new assessment |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payments/create` | Create payment request |
| GET | `/api/payments/:id/status` | Check payment status |

### Telegram Integration (NEW)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/telegram/link/start` | Generate verification code |
| POST | `/api/telegram/link/verify` | Verify Telegram link (called by bot) |
| GET | `/api/telegram/subscription/:telegram_user_id` | Check subscription status |
| GET | `/api/telegram/status` | Get Telegram link status for dashboard |
| POST | `/api/telegram/unlink` | Unlink Telegram account |

## Database Schema

### Core Tables
- `users` - User accounts and subscriptions
- `assessments` - Security assessment results
- `payments` - Payment history
- `consultations` - Consultation bookings
- `session_tokens` - Active sessions
- `community_stats` - Aggregated community statistics

### Telegram Integration Tables
- `telegram_links` - Links Telegram users to Kyward accounts
- `monitored_wallets` - User's monitored Bitcoin wallets
- `transactions_seen` - Transaction deduplication
- `historical_balances` - Daily balance snapshots
- `bot_preferences` - Per-user bot settings
- `xpub_cache` - XPUB address derivation cache
- `bot_config` - Global bot configuration

## Subscription Plans

| Plan | Price | Features |
|------|-------|----------|
| Free | $0 | 1 assessment/month |
| Essential | $7.99 (one-time) | 1 assessment + PDF report |
| Sentinel | $14.99/month | Unlimited assessments + BTC Guardian bot |
| Consultation | $99/hour | Expert consultation session |

## Telegram Linking Flow

1. **User subscribes to Sentinel** at kyward.com
2. **User clicks "Link Telegram"** in Dashboard
3. **Backend generates 6-character code** (valid 10 minutes)
4. **User sends `/link CODE`** to @GuardianBTCBot
5. **Bot verifies code** via `/api/telegram/link/verify`
6. **Accounts are linked** - user can now use bot features

## Frontend Components

### Key Files
- `src/components/Dashboard.jsx` - Main user dashboard with Telegram linking UI
- `src/components/PaymentModal.jsx` - Bitcoin payment flow
- `src/components/Report.jsx` - Assessment report viewer
- `src/services/PdfGenerator.js` - PDF report generation
- `src/services/Recommendations.js` - Security recommendations engine
- `src/i18n/translations.js` - Internationalization (EN/ES)

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render)
```bash
# Set environment variables in Render dashboard
# Deploy from GitHub repository
```

## Security Considerations

- All API endpoints use JWT authentication
- Supabase Row Level Security (RLS) enabled
- Password hashing with bcrypt
- Session tokens expire after 7 days
- Telegram verification codes expire after 10 minutes

## Support

For issues: https://github.com/anthropics/claude-code/issues
