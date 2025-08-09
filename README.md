# SSI360V2 - Full Stack Application

A complete full-stack application built with modern technologies including React, .NET, GraphQL, and PostgreSQL.

## 🚀 Features

### Frontend (React + TypeScript)
- **Modern UI**: Beautiful, responsive interface built with TailwindCSS
- **Two-level Navigation**: Collapsible sidebar with hierarchical menu structure
- **User Management**: Complete CRUD operations for users with role-based access
- **Multi-tenancy**: Tenant switching and isolation support
- **Advanced Data Tables**: Pagination, sorting, filtering, and search capabilities
- **Form Management**: Reusable forms with React Hook Form and validation
- **Authentication**: JWT-based authentication with protected routes
- **Search Panel**: Configurable search interface with multiple control types

### Backend (.NET + GraphQL)
- **GraphQL API**: Hot Chocolate GraphQL server with queries and mutations
- **Authentication & Authorization**: JWT-based auth with role-based permissions
- **Multi-tenancy**: Tenant isolation with header-based tenant resolution
- **Entity Framework Core**: PostgreSQL integration with code-first approach
- **Clean Architecture**: Modular structure with Core, Application, Infrastructure, and API layers
- **Repository Pattern**: Data access abstraction with generic repositories
- **Service Layer**: Business logic encapsulation with dependency injection
- **Database Seeding**: Initial data setup with admin user, roles, and permissions

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Apollo Client** for GraphQL integration
- **TailwindCSS** for styling
- **React Hook Form** for form management
- **React Router** for navigation
- **Heroicons** for icons

### Backend
- **.NET 9.0** with C#
- **Hot Chocolate** GraphQL server
- **Entity Framework Core** with PostgreSQL
- **JWT Authentication** with Bearer tokens
- **BCrypt** for password hashing
- **xUnit** for unit testing

### Database
- **PostgreSQL** for data persistence
- **EF Core Migrations** for schema management

## 📁 Project Structure

```
ssi360v2/
├── backend/                    # .NET Backend
│   ├── SSI360V2.API/          # GraphQL API layer
│   ├── SSI360V2.Core/         # Domain entities and interfaces
│   ├── SSI360V2.Application/  # Business logic and services
│   ├── SSI360V2.Infrastructure/ # Data access and external services
│   └── SSI360V2.Tests/        # Unit tests
└── frontend/                   # React Frontend
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/            # Application pages
    │   ├── contexts/         # React contexts
    │   └── apollo/           # GraphQL client configuration
    └── public/               # Static assets
```

## 🚀 Quick Start

### Prerequisites
- **.NET 9.0 SDK**
- **Node.js 16+** and npm
- **PostgreSQL** database
- **Git**

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Update database connection:**
   Edit `SSI360V2.API/appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=SSI360V2;Username=your_username;Password=your_password"
     }
   }
   ```

3. **Restore packages and run:**
   ```bash
   dotnet restore
   dotnet run --project SSI360V2.API
   ```

4. **Access GraphQL Playground:**
   - Open: http://localhost:5000/graphql
   - Default admin credentials: `admin@default.com` / `Admin123!`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open: http://localhost:3000
   - Login with: `admin@default.com` / `Admin123!`

## 🔧 Configuration

### Backend Configuration

The backend uses the following configuration in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=SSI360V2;Username=postgres;Password=password"
  },
  "Jwt": {
    "Key": "your-super-secret-key-with-at-least-32-characters",
    "Issuer": "SSI360V2",
    "Audience": "SSI360V2-Client"
  }
}
```

### Frontend Configuration

The frontend connects to the backend GraphQL endpoint at `http://localhost:5000/graphql` and includes:
- JWT token management
- Tenant ID headers for multi-tenancy
- Error handling and logging

## 📊 Database Schema

The application includes the following core entities:

- **Users**: User accounts with authentication
- **Roles**: Role definitions for authorization
- **Permissions**: Granular permissions system
- **Tenants**: Multi-tenant organization support
- **UserRoles**: Many-to-many relationship between users and roles
- **RolePermissions**: Many-to-many relationship between roles and permissions

## 🔐 Authentication & Authorization

### Default Admin User
- **Email**: `admin@default.com`
- **Password**: `Admin123!`
- **Role**: Admin (with all permissions)
- **Tenant**: Default Tenant

### JWT Authentication
- Bearer token authentication
- Automatic token inclusion in GraphQL requests
- Token refresh and validation
- Role-based authorization

## 🏗 Architecture

### Backend Architecture (Clean Architecture)
- **Core Layer**: Domain entities, interfaces, and DTOs
- **Application Layer**: Business logic and application services
- **Infrastructure Layer**: Data access, external services, and implementations
- **API Layer**: GraphQL resolvers, controllers, and configuration

### Frontend Architecture
- **Component-Based**: Reusable UI components
- **Context API**: Global state management
- **Custom Hooks**: Logic encapsulation
- **TypeScript**: Type-safe development

## 🧪 Testing

### Backend Testing
```bash
cd backend
dotnet test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📝 API Documentation

### GraphQL Endpoints
- **GraphQL Playground**: http://localhost:5000/graphql
- **Swagger Documentation**: http://localhost:5000/swagger

### Key Queries
- `users`: Get paginated users with filtering and sorting
- `roles`: Get roles with permissions
- `tenants`: Get tenant information
- `currentUser`: Get authenticated user details

### Key Mutations
- `login`: Authenticate user and get JWT token
- `createUser`: Create new user account
- `updateUser`: Update user information
- `deleteUser`: Remove user account

## 🚀 Deployment

### Backend Deployment
1. Build the application:
   ```bash
   dotnet publish -c Release
   ```

2. Deploy to your hosting provider (Azure, AWS, etc.)

### Frontend Deployment
1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
1. Check the documentation in the `backend/README.md` and `frontend/README.md`
2. Review the GraphQL schema in the playground
3. Check the console for error messages
4. Verify database connectivity and configuration

## 🔄 Development Workflow

1. **Start Backend**: `dotnet run --project backend/SSI360V2.API`
2. **Start Frontend**: `npm start` (in frontend directory)
3. **Access Application**: http://localhost:3000
4. **GraphQL Playground**: http://localhost:5000/graphql
5. **Database Management**: Use your preferred PostgreSQL client

## 🎯 Key Features Implemented

✅ **UI Requirements**
- Sidebar with two-level navigation
- Topbar with logged-in user info and tenant switcher
- List views with pagination, filtering, and sorting
- Add/edit forms using reusable components and React Hook Form
- SearchPanel component that accepts control configuration for filtering

✅ **Backend Requirements**
- EF Core with PostgreSQL setup
- Hot Chocolate GraphQL schema, queries, and mutations
- JWT authentication
- Role-based authorization (Users ↔ Roles ↔ Permissions)
- Multi-tenancy support (tenant resolved from header)
- Seed initial tenant, admin user, roles, permissions
- Modular project structure with Resolvers, Services, Repositories, Entities, DTOs

✅ **Wiring + Testing**
- Unit tests for key backend services and GraphQL resolvers (xUnit)
- Test scaffolding for React components (Jest + React Testing Library)
- App builds and runs without errors
- Integration between components, backend, and schema
- Modular, maintainable, and production-ready code
