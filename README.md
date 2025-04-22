# A Tyk Mirror Dashboard

A modern, feature-rich dashboard for managing and monitoring Tyk API Gateway instances. Built with React, TypeScript, and a robust backend architecture.

## 🚀 Features

- **Authentication & Authorization**
  - Secure login system with role-based access control
  - User management and permissions
  - Session management

- **API Management**
  - API definition management
  - API key generation and management
  - Policy configuration
  - API analytics and monitoring

- **Gateway Integration**
  - Tyk Gateway synchronization
  - Kong Gateway integration
  - Real-time status monitoring
  - Health checks and alerts

- **Database Integration**
  - PostgreSQL database support
  - Configurable database settings
  - Data persistence and caching

- **User Interface**
  - Modern, responsive design
  - Dark/Light mode support
  - Real-time updates
  - Interactive charts and graphs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn package manager
- Git

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tyk-mirror-dashboard.git
cd tyk-mirror-dashboard
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
Create a `.env` file in the root directory with the following variables:
```env
VITE_DB_HOST=localhost
VITE_DB_PORT=5432
VITE_DB_NAME=tyk_dashboard
VITE_DB_USER=postgres
VITE_DB_PASSWORD=your_password
VITE_TYK_GATEWAY_URL=http://localhost:8080
VITE_TYK_GATEWAY_SECRET=your_secret
```

4. Initialize the database:
```bash
npm run db:init
# or
yarn db:init
```

## 🚀 Development

To start the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

The build files will be generated in the `dist` directory.

## 🐳 Docker Deployment

1. Build the Docker image:
```bash
docker build -t tyk-mirror-dashboard .
```

2. Run the container:
```bash
docker run -p 3000:3000 \
  -e VITE_DB_HOST=your_db_host \
  -e VITE_DB_PORT=5432 \
  -e VITE_DB_NAME=tyk_dashboard \
  -e VITE_DB_USER=postgres \
  -e VITE_DB_PASSWORD=your_password \
  tyk-mirror-dashboard
```

## 📦 Project Structure

```
src/
├── components/         # React components
├── lib/               # Core libraries and utilities
├── pages/             # Page components
├── services/          # API and service integrations
├── styles/            # Global styles
└── types/             # TypeScript type definitions
```

## 🔧 Configuration

### Database Configuration
The application uses PostgreSQL for data storage. Configure the database settings in the settings panel or through environment variables.

### Gateway Configuration
Configure Tyk and Kong gateway connections through the settings panel. Each gateway requires:
- Gateway URL
- API Key/Secret
- Sync interval

## 📝 To-Do Features

- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] API documentation generator
- [ ] Webhook integration
- [ ] Custom plugin support
- [ ] API testing tools
- [ ] Rate limiting visualization
- [ ] Audit logging
- [ ] Backup and restore functionality
- [ ] API versioning support

## 🛡️ Security

- All passwords are hashed using bcrypt
- JWT-based authentication
- Role-based access control
- CSRF protection
- Rate limiting
- Input validation
- Secure session management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Tyk API Gateway](https://tyk.io/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Shadcn UI](https://ui.shadcn.com/)

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 📈 Roadmap

### Phase 1 (Current)
- [x] Basic authentication
- [x] API management
- [x] Gateway integration
- [x] Database setup

### Phase 2 (In Progress)
- [ ] Advanced analytics
- [ ] Multi-gateway support
- [ ] Plugin system
- [ ] API documentation

### Phase 3 (Planned)
- [ ] Multi-tenant architecture
- [ ] Advanced security features
- [ ] Performance optimization
- [ ] Mobile application

## 🧪 Testing

Run the test suite:

```bash
npm test
# or
yarn test
```

## 📊 Performance

The application is optimized for:
- Fast initial load times
- Efficient data fetching
- Real-time updates
- Responsive UI
- Scalable architecture

## 🔄 CI/CD

The project uses GitHub Actions for continuous integration and deployment. Workflows include:
- Automated testing
- Code quality checks
- Build verification
- Deployment to staging/production

## 📚 Documentation

- [API Documentation](docs/api.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)

