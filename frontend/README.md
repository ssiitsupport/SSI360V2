# SSI360V2 Frontend

A modern React application built with TypeScript, Apollo Client, and TailwindCSS for the SSI360V2 full-stack application.

## Features

- **Modern React Architecture**: Built with React 18, TypeScript, and functional components with hooks
- **GraphQL Integration**: Apollo Client for efficient data fetching and caching
- **Beautiful UI**: TailwindCSS for responsive and modern design
- **Authentication**: JWT-based authentication with context management
- **Multi-tenancy**: Support for tenant switching and isolation
- **Responsive Design**: Mobile-first approach with responsive components
- **Form Management**: React Hook Form for efficient form handling
- **Reusable Components**: Modular component architecture

## UI Components

### Layout Components
- **Sidebar**: Two-level navigation with collapsible sections
- **Topbar**: User info display and tenant switcher
- **Layout**: Main layout wrapper with sidebar and topbar

### UI Components
- **Button**: Reusable button with multiple variants (primary, secondary, danger, outline)
- **Input**: Form input with validation and error handling
- **Select**: Dropdown select component
- **DataTable**: Advanced table with pagination, sorting, and filtering
- **SearchPanel**: Configurable search panel with multiple control types

### Pages
- **Dashboard**: Overview with stats and quick actions
- **Users**: User management with CRUD operations
- **Roles**: Role management with permissions
- **Tenants**: Multi-tenant organization management
- **Login**: Authentication page

## Technology Stack

- **React 18**: Latest React with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Apollo Client**: GraphQL client with caching
- **TailwindCSS**: Utility-first CSS framework
- **React Hook Form**: Performant form library
- **React Router**: Client-side routing
- **Heroicons**: Beautiful SVG icons

## Project Structure

```
src/
├── apollo/
│   └── client.ts              # Apollo Client configuration
├── components/
│   ├── Forms/
│   │   └── UserForm.tsx       # User form component
│   ├── Layout/
│   │   ├── Layout.tsx         # Main layout wrapper
│   │   ├── Sidebar.tsx        # Navigation sidebar
│   │   └── Topbar.tsx         # Top navigation bar
│   └── UI/
│       ├── Button.tsx         # Reusable button component
│       ├── DataTable.tsx      # Advanced data table
│       ├── Input.tsx          # Form input component
│       ├── SearchPanel.tsx    # Configurable search panel
│       └── Select.tsx         # Select dropdown component
├── contexts/
│   └── AuthContext.tsx        # Authentication context
├── pages/
│   ├── Dashboard.tsx          # Dashboard page
│   ├── Login.tsx              # Login page
│   ├── Roles.tsx              # Roles management
│   ├── Tenants.tsx            # Tenants management
│   └── Users.tsx              # Users management
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
└── index.css                  # Global styles with TailwindCSS
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Backend API running on `http://localhost:5000`

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `npm start`: Start development server
- `npm build`: Build for production
- `npm test`: Run tests
- `npm eject`: Eject from Create React App
- `npm run codegen`: Generate GraphQL types

## Configuration

### Apollo Client

The Apollo Client is configured in `src/apollo/client.ts` with:
- GraphQL endpoint: `http://localhost:5000/graphql`
- JWT authentication headers
- Tenant ID headers for multi-tenancy
- Error handling and logging

### TailwindCSS

Custom configuration in `tailwind.config.js` with:
- Custom color palette
- Responsive breakpoints
- Component-specific styles

## Authentication

The application uses JWT-based authentication with:
- Login/logout functionality
- Token storage in localStorage
- Automatic token inclusion in GraphQL requests
- Protected routes with redirect to login

## Multi-tenancy

Multi-tenant support includes:
- Tenant context in authentication
- Tenant ID in GraphQL headers
- Tenant switcher in topbar
- Tenant-specific data isolation

## Component Usage Examples

### Button Component
```tsx
import Button from './components/UI/Button';

<Button variant="primary" size="md" loading={false}>
  Click me
</Button>
```

### DataTable Component
```tsx
import DataTable from './components/UI/DataTable';

<DataTable
  columns={columns}
  data={data}
  loading={loading}
  pagination={paginationConfig}
  sorting={sortingConfig}
/>
```

### SearchPanel Component
```tsx
import SearchPanel from './components/UI/SearchPanel';

const controls = [
  {
    name: 'searchTerm',
    type: 'text',
    label: 'Search',
    placeholder: 'Enter search term'
  }
];

<SearchPanel
  controls={controls}
  onSearch={handleSearch}
  onReset={handleReset}
/>
```

## Form Handling

Forms use React Hook Form for:
- Performance optimization
- Built-in validation
- Error handling
- Field-level validation

Example:
```tsx
import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit } = useForm();

<Controller
  name="email"
  control={control}
  rules={{ required: 'Email is required' }}
  render={({ field, fieldState }) => (
    <Input
      {...field}
      error={fieldState.error?.message}
    />
  )}
/>
```

## Styling

The application uses TailwindCSS for styling with:
- Utility-first approach
- Responsive design
- Custom color scheme
- Component-specific styles

## Testing

The project includes testing setup with:
- Jest for unit testing
- React Testing Library for component testing
- Test utilities and helpers

## Development Guidelines

1. **Component Structure**: Use functional components with hooks
2. **TypeScript**: Maintain strict typing throughout
3. **State Management**: Use React Context for global state
4. **Form Handling**: Use React Hook Form for all forms
5. **Styling**: Use TailwindCSS utilities
6. **GraphQL**: Use Apollo Client hooks for data fetching

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your hosting provider

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for all new components
3. Include proper error handling
4. Test your changes thoroughly
5. Update documentation as needed

## Troubleshooting

### Common Issues

1. **GraphQL Connection**: Ensure backend is running on port 5000
2. **Authentication**: Check JWT token in localStorage
3. **Styling**: Verify TailwindCSS is properly configured
4. **TypeScript Errors**: Run `npm run build` to check for type issues

### Development Tips

- Use React DevTools for debugging
- Check Apollo Client DevTools for GraphQL queries
- Use TailwindCSS IntelliSense for styling
- Enable TypeScript strict mode for better type safety
