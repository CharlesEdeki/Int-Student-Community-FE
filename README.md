# International Student Community Platform

A vibrant web application connecting international students across campuses, facilitating networking, collaboration, and community building.

## Overview

The **International Student Community Platform** is a modern social platform designed specifically for international students to connect with peers, build meaningful relationships, and engage with their community. Students can create and join interest-based groups, participate in events, chat with connections, and discover networking opportunities.

## Key Features

- **User Profiles & Connections**: Create detailed profiles showcasing academic background, interests, languages, and campus location. Connect with other students and build your network.
- **Groups & Communities**: Create or join groups based on shared interests, majors, or origins. Participate in group discussions and activities.
- **Real-time Chat**: Direct messaging with connections for seamless communication.
- **Event Management**: Discover, create, and attend campus events and community gatherings.
- **Dashboard**: Personalized dashboard showing group rotations, upcoming events, connections, and notifications.
- **Admin Features**: Administrative tools for user management, metrics tracking, and community announcements.
- **Dark/Light Theme Support**: Enjoy the app in your preferred theme.

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui (built on Radix UI primitives)
- **Styling**: Tailwind CSS with custom animations
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query
- **Charts**: Recharts
- **Notifications**: Sonner (toast notifications)
- **Icons**: Lucide React
- **Theme Support**: next-themes

## Getting Started

### Prerequisites

- Node.js (v16 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or bun package manager

### Installation

1. **Clone the repository**:
```sh
git clone <YOUR_GIT_URL>
cd Int-Student-Community-FE
```

2. **Install dependencies**:
```sh
npm install
# or
bun install
```

3. **Start the development server**:
```sh
npm run dev
# or
bun dev
```

The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development with enhanced debugging
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components
│   ├── Layout.tsx      # Main app layout wrapper
│   └── NavLink.tsx     # Navigation components
├── context/            # React Context for global state
├── pages/              # Route page components
│   ├── Auth.tsx        # Authentication
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Group.tsx       # Group management
│   ├── Chat.tsx        # Messaging
│   ├── Events.tsx      # Event listing & management
│   ├── Profile.tsx     # User profiles
│   ├── Connections.tsx # Network management
│   └── Admin.tsx       # Admin tools
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── demo-data/          # Sample data for development
```

## Features Overview

### Authentication
Secure login and registration system for international students.

### Dashboard
Personalized hub showing:
- Active group memberships with rotation timers
- Upcoming events
- Recent messages and notifications
- Quick access to all platform features

### Groups
- Create communities based on interests, origins, or majors
- Join existing groups to expand your network
- Participate in group-specific discussions and activities

### Events
- Discover and create campus events
- RSVP to attend events
- Stay updated with event notifications

### Connections
- Build your network with other students
- Send and receive connection requests
- Manage your connections

### Chat
- Direct messaging with your connections
- Real-time communication
- Message history

### Admin Panel
- User management and analytics
- Community metrics and insights
- Broadcast announcements to the community

## Development

The project uses modern development practices:

- **Type Safety**: Full TypeScript coverage
- **Code Splitting**: Lazy-loaded route components for optimal performance
- **Component Library**: shadcn/ui for consistent, accessible UI
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Zod schemas with React Hook Form
- **Linting**: ESLint configuration for code quality

## Deployment

Build the project for production:

```sh
npm run build
```

This generates an optimized build in the `dist/` directory, ready for deployment to any static hosting service.

## Browser Support

Modern browsers with ES2020+ support:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please ensure:
- Code follows the ESLint configuration
- TypeScript types are properly defined
- Components follow shadcn/ui patterns
- Changes are tested locally

## License

This project is part of the International Student Community Platform initiative.
