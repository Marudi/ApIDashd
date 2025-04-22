
# ApIDashd API Gateway Dashboard

A modern, extensible dashboard to manage API Gateways (currently supports both Tyk and Kong) with full-featured UI for security, analytics, version control, and more.

## ⭐ Features

- **Dashboard** with real-time analytics, gateway health, request & error charts
- **API Management:** create, update, delete API endpoints for multiple gateway types
- **Version Control:** versioned API deployments, path management, rollbacks, and deployment options
- **Security:** configure authentication, rate limiting, quotas, CORS, and advanced headers per API
- **Logs:** detailed request, error, and event logging with filtering
- **Policy & Key Management:** manage API keys, policies, consumers
- **Modern UI:** responsive, fast, built with React, TypeScript, Tailwind, and shadcn/ui components

## 📸 Screenshots

Get a visual overview of the ApIDash Dashboard:

### Main Dashboard & Analytics

![Main Dashboard and Analytics](https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=900&q=80)
*The main dashboard provides quick access to analytics, gateway health, and API activity trends.*

### API Builder (Visual Flow)

![API Builder Visual Editor](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80)
*The visual API builder lets you design, edit, and connect endpoints or logic with ease.*

### API Key Management/Policy Editor

![API Key Management Interface](https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=900&q=80)
*API Key management: Easily generate, revoke, or search for keys and assign policies.*

> **Tip:** Want to contribute? [Submit your own screenshots via a pull request!](#contributing)

## 📦 Requirements

- **Node.js** (>= 18.x)
- **npm** (>= 9.x)
- (Recommended) **Git** for version control
- **Vite** (comes preconfigured; no manual install required)
- **Modern browser** for development/preview

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <YOUR_REPO_URL>
cd <YOUR_PROJECT_DIRECTORY>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

Visit [http://localhost:8080](http://localhost:8080) in your browser.

### 4. Build for production

```bash
npm run build
```

The static files will be output in the `dist/` directory.

## 🌐 Deployment

You can deploy the application in a few ways:

### 1. Deploy with ApIDash Hosting

- Open [ApIDash project page](https://ApIDash.dev/projects/e910d3f0-17b5-40c2-b001-ea3bbbbac8cf)
- Click "Share" > "Publish" to deploy/update your hosted app
- [Optionally] Connect a [custom domain](https://docs.ApIDash.dev/tips-tricks/custom-domain#step-by-step-guide)

### 2. Deploy on Vercel, Netlify, or any static host

- Build the app: `npm run build`
- Deploy the `dist/` directory as a static site

### 3. Self-hosting

- Use any web server (e.g., nginx, Apache, Caddy) to serve the contents of the `dist/` folder.

> **Note:** For backend/API functionality (e.g., storing data, authentication), connect to Supabase or your own backend server. See [Supabase integration guide](https://docs.ApIDash.dev/integrations/supabase/).

## 🛠️ Local Development

- Modify components, pages, or logic under the `src/` folder
- UI components use [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com/)
- TypeScript for type safety

## 📝 To-Do and Planned Features

- [ ] Live synchronisation with real Tyk/Kong gateways (add config in settings)
- [ ] User authentication and permissions (multi-user, admin, read-only)
- [ ] Persistent API & key data via Supabase/postgres integration
- [ ] Improved policy editor with UI-driven rules management
- [ ] Export/Import API definitions (JSON/YAML)
- [ ] Webhook and notification integration (e.g., Slack alerts on errors)
- [ ] Better mobile/tablet UI (responsive optimizations)
- [ ] Accessibility improvements

## 🌱 Enhancements & Community Ideas

- Suggest integrations with other API gateways (e.g., AWS API Gateway, Apigee)
- Add advanced search/filtering on analytics and logs
- Dashboard widgets/plugins system (allow custom panels)
- GitOps integration for deployment & API versioning
- i18n and localization support

## 🤝 Contributing

1. Fork this repo and create a new branch for your feature or fix
2. Follow the project structure and style conventions
3. Run `npm run dev` to test locally
4. Open a PR describing your changes
5. Contributions, feature requests, and bug reports are welcome!

## 🙏 Acknowledgements

ApIDash is built with:
- [Vite](https://vitejs.dev/)
- [React](https://react.dev/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide](https://lucide.dev/) icons
- [Supabase](https://supabase.com/) optional

## 📄 License

MIT License (see [`LICENSE`](LICENSE) file if present).

## 📚 Further Documentation

- [ApIDash Documentation](https://docs.ApIDash.dev/)
- [Supabase Integration](https://docs.ApIDash.dev/integrations/supabase/)
- [shadcn/ui](https://ui.shadcn.com/docs)
- [Vite](https://vitejs.dev/guide/)

---

_This is an open source community dashboard project. See the issues tab or To-Do section above for ways to get involved!_

