# SSI360V2 Backend

A modern .NET 9.0 backend application with GraphQL, JWT authentication, and multi-tenancy support.

## Features

- **GraphQL API** using Hot Chocolate
- **JWT Authentication** with role-based authorization
- **Multi-tenancy** support
- **Entity Framework Core** with PostgreSQL
- **Clean Architecture** with modular project structure
- **Unit Testing** with xUnit and Moq
- **Swagger/OpenAPI** documentation

## Project Structure

```
SSI360V2.Backend/
├── SSI360V2.API/                 # Web API layer with GraphQL
├── SSI360V2.Application/         # Application services and business logic
├── SSI360V2.Core/               # Domain entities, DTOs, and interfaces
├── SSI360V2.Infrastructure/     # Data access and external services
└── SSI360V2.Tests/              # Unit tests
```

## Prerequisites

- .NET 9.0 SDK
- PostgreSQL 12 or higher
- Visual Studio 2022 or VS Code

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ssi360v2/backend
   ```

2. **Configure Database**
   - Install PostgreSQL
   - Create a database named `SSI360V2`
   - Update connection string in `SSI360V2.API/appsettings.json`

3. **Update Configuration**
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=SSI360V2;Username=your-username;Password=your-password"
     },
     "Jwt": {
       "Key": "your-super-secret-key-with-at-least-32-characters",
       "Issuer": "SSI360V2",
       "Audience": "SSI360V2-Client"
     }
   }
   ```

4. **Restore Dependencies**
   ```bash
   dotnet restore
   ```

5. **Run Migrations**
   ```bash
   cd SSI360V2.API
   dotnet ef database update
   ```

6. **Run the Application**
   ```bash
   dotnet run
   ```

## API Endpoints

### GraphQL
- **GraphQL Playground**: `https://localhost:7001/graphql`
- **GraphQL Endpoint**: `https://localhost:7001/graphql`

### REST API
- **Swagger UI**: `https://localhost:7001/swagger`
- **API Base URL**: `https://localhost:7001/api`

## Authentication

The application uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Default Admin User
- **Email**: admin@default.com
- **Password**: Admin123!

## GraphQL Schema

### Queries
- `users(page: Int, pageSize: Int, search: String)`: Get paginated users
- `user(id: ID!)`: Get user by ID
- `currentUser`: Get current authenticated user
- `roles(page: Int, pageSize: Int, search: String)`: Get paginated roles
- `role(id: ID!)`: Get role by ID
- `tenants`: Get all tenants
- `tenant(id: ID!)`: Get tenant by ID
- `currentTenant`: Get current tenant

### Mutations
- `login(email: String!, password: String!)`: Authenticate user
- `register(email: String!, firstName: String!, lastName: String!, password: String!, roleIds: [ID!])`: Register new user
- `createUser(email: String!, firstName: String!, lastName: String!, password: String!, roleIds: [ID!])`: Create user
- `updateUser(id: ID!, firstName: String!, lastName: String!, isActive: Boolean!, roleIds: [ID!])`: Update user
- `deleteUser(id: ID!)`: Delete user
- `changePassword(userId: ID!, currentPassword: String!, newPassword: String!)`: Change password
- `createRole(name: String!, description: String!, permissionIds: [ID!])`: Create role
- `updateRole(id: ID!, name: String!, description: String!, isActive: Boolean!, permissionIds: [ID!])`: Update role
- `deleteRole(id: ID!)`: Delete role

## Testing

Run the unit tests:

```bash
dotnet test
```

## Development

### Adding New Entities

1. Create entity in `SSI360V2.Core/Entities/`
2. Add DbSet in `ApplicationDbContext`
3. Create repository interface and implementation
4. Create DTOs in `SSI360V2.Core/DTOs/`
5. Create service interface and implementation
6. Add GraphQL queries/mutations
7. Write unit tests

### Database Migrations

```bash
# Add migration
dotnet ef migrations add MigrationName --project SSI360V2.Infrastructure --startup-project SSI360V2.API

# Update database
dotnet ef database update --project SSI360V2.Infrastructure --startup-project SSI360V2.API
```

## Architecture

### Clean Architecture Layers

1. **Core Layer**: Domain entities, interfaces, and DTOs
2. **Application Layer**: Business logic and application services
3. **Infrastructure Layer**: Data access and external service implementations
4. **API Layer**: Web API controllers and GraphQL resolvers

### Key Design Patterns

- **Repository Pattern**: Data access abstraction
- **Service Pattern**: Business logic encapsulation
- **DTO Pattern**: Data transfer objects for API contracts
- **Dependency Injection**: Loose coupling between layers

## Security

- JWT token-based authentication
- Role-based authorization
- Password hashing with BCrypt
- CORS configuration
- Input validation

## Multi-tenancy

The application supports multi-tenancy through:
- Tenant isolation at the database level
- Tenant resolution from JWT claims
- Tenant-specific data access

## Contributing

1. Follow the existing code style
2. Write unit tests for new features
3. Update documentation
4. Ensure all tests pass

## License

[Add your license here]
