# Nex3 AI Assistant

The site now has a floating, responsive AI assistant on every React route, including `/audit`. Before a successful website inquiry it answers FAQs. After the existing “Send it over” request receives a successful FormSubmit response, it switches to post-submission mode and shows a personalized confirmation.

Chat messages and the minimum submission context (first name, email, and company/project) use `sessionStorage`; they are removed when the browser session ends. Responses render as text, never HTML or Markdown.

## Architecture

- `src/components/site/Chatbot.jsx`: launcher, accessible dialog, session state, API client, contact link, and post-submission experience.
- `src/components/site/ContactCTA.jsx`: dispatches `nex3:inquiry-submitted` only after the existing FormSubmit request succeeds. Existing fields and delivery are unchanged.
- `server/services/ChatService.js`: trusted Nex3 instructions and Google Gemini API call.
- `server/app.js`: validated, rate-limited `POST /api/chat` with bounded history and safe errors.
- `api/chat.js`: serverless adapter matching the existing API pattern.
- `src/index.css`: native Nex3 styling, focus states, responsive behavior, and reduced motion.

Career submissions and the `/audit` free-tool form do not activate post-submission chat.

## Local setup

Copy `.env.example` to `.env.local` and configure real values locally. Never commit them. Create a free-tier key at [Google AI Studio](https://aistudio.google.com/api-keys). Required chat variables are `GEMINI_API_KEY`, optional `GEMINI_MODEL` (default `gemini-3.1-flash-lite`) and `CHAT_TIMEOUT_MS`, `REACT_APP_BACKEND_URL` for the frontend build, and `CLIENT_ORIGIN` for backend CORS. The existing SMTP variables remain required by `npm run start:server`.

Run in two terminals:

```bash
npm ci
npm run start:server
```

```bash
npm run dev
```

## Testing

FAQ mode: open “Chat with AI,” ask a service question, refresh, and confirm history remains in the session. Empty sends are disabled and input is limited to 1,200 characters.

Post-submission mode: submit the main inquiry form and wait for success. Chat opens only after FormSubmit succeeds. Invalid or failed submissions remain in FAQ mode. Test missing company/project fallback, Tab/Shift+Tab, Escape, narrow mobile view, and reduced motion.

Automated checks:

```bash
npm run test:server
npm run lint
npm run build
```

## Deployment, security, and privacy

Deploy the Express/serverless API with `GEMINI_API_KEY` and production `CLIENT_ORIGIN`; build the frontend with its API origin. Ensure both `/api/chat` and `/api/free-tools` route to Express. Google controls free-tier quotas and availability; if the quota is exhausted, the UI returns a temporary-unavailable message without breaking the site.

Controls include server-only credentials/instructions, body limits, 30 requests per 10 minutes per client, 1,200-character messages, ten-message history, 500-token responses, temperature 0.3, 15-second timeout, one provider retry, context sanitization, generic errors, text-only output, duplicate-send prevention, abort handling, and session-only storage. No chat analytics or permanent chat storage were added.

Because the existing inquiry uses browser-to-FormSubmit delivery, post-submission state is session UI personalization based on FormSubmit’s successful response—not a server-verifiable status system. No form message is stored in chat context or exposed in URLs or logs.
