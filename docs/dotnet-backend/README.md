# International Student Community Platform - .NET Backend

A complete ASP.NET Core 8 Web API backend with PostgreSQL database, SignalR for real-time features, and JWT authentication.

## 🏗️ Project Structure

```
InternationalStudentCommunity/
├── src/
│   ├── ISC.API/                          # Web API project
│   │   ├── Controllers/
│   │   │   ├── AuthController.cs
│   │   │   ├── UsersController.cs
│   │   │   ├── GroupsController.cs
│   │   │   ├── EventsController.cs
│   │   │   ├── MessagesController.cs
│   │   │   ├── PollsController.cs
│   │   │   ├── NotificationsController.cs
│   │   │   └── AnnouncementsController.cs
│   │   ├── Hubs/
│   │   │   ├── ChatHub.cs
│   │   │   └── NotificationHub.cs
│   │   ├── Middleware/
│   │   │   ├── ExceptionHandlingMiddleware.cs
│   │   │   └── RequestLoggingMiddleware.cs
│   │   ├── Program.cs
│   │   └── appsettings.json
│   │
│   ├── ISC.Application/                   # Business logic layer
│   │   ├── Services/
│   │   │   ├── IAuthService.cs
│   │   │   ├── AuthService.cs
│   │   │   ├── IUserService.cs
│   │   │   ├── UserService.cs
│   │   │   ├── IGroupService.cs
│   │   │   ├── GroupService.cs
│   │   │   ├── IEventService.cs
│   │   │   ├── EventService.cs
│   │   │   ├── IMessageService.cs
│   │   │   ├── MessageService.cs
│   │   │   └── INotificationService.cs
│   │   ├── DTOs/
│   │   │   ├── Auth/
│   │   │   ├── Users/
│   │   │   ├── Groups/
│   │   │   ├── Events/
│   │   │   └── Messages/
│   │   ├── Mappings/
│   │   │   └── MappingProfile.cs
│   │   └── Validators/
│   │       ├── LoginRequestValidator.cs
│   │       └── RegisterRequestValidator.cs
│   │
│   ├── ISC.Domain/                        # Domain entities
│   │   ├── Entities/
│   │   │   ├── User.cs
│   │   │   ├── Group.cs
│   │   │   ├── GroupMember.cs
│   │   │   ├── Event.cs
│   │   │   ├── EventAttendee.cs
│   │   │   ├── Message.cs
│   │   │   ├── Poll.cs
│   │   │   ├── PollOption.cs
│   │   │   ├── PollVote.cs
│   │   │   ├── Notification.cs
│   │   │   ├── Announcement.cs
│   │   │   └── ChecklistItem.cs
│   │   ├── Enums/
│   │   │   ├── UserRole.cs
│   │   │   ├── GroupRole.cs
│   │   │   ├── EventStatus.cs
│   │   │   └── NotificationType.cs
│   │   └── Common/
│   │       └── BaseEntity.cs
│   │
│   └── ISC.Infrastructure/                # Data access layer
│       ├── Data/
│       │   ├── ApplicationDbContext.cs
│       │   └── Configurations/
│       │       ├── UserConfiguration.cs
│       │       ├── GroupConfiguration.cs
│       │       └── ...
│       ├── Repositories/
│       │   ├── IRepository.cs
│       │   ├── Repository.cs
│       │   ├── IUserRepository.cs
│       │   └── UserRepository.cs
│       └── Migrations/
│
├── tests/
│   ├── ISC.API.Tests/
│   ├── ISC.Application.Tests/
│   └── ISC.Infrastructure.Tests/
│
├── docker-compose.yml
├── Dockerfile
└── InternationalStudentCommunity.sln
```

## 🚀 Quick Start

### Prerequisites

- .NET 8 SDK
- PostgreSQL 15+
- Docker (optional)

### Local Development

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Update connection string** in `src/ISC.API/appsettings.Development.json`:
   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Database=isc_db;Username=postgres;Password=yourpassword"
     }
   }
   ```

3. **Run migrations:**
   ```bash
   dotnet ef database update --project src/ISC.Infrastructure --startup-project src/ISC.API
   ```

4. **Run the API:**
   ```bash
   dotnet run --project src/ISC.API
   ```

5. **Access Swagger:** https://localhost:7001/swagger

### Docker

```bash
docker-compose up -d
```

## 🔐 Authentication

JWT-based authentication with refresh tokens:

- Access tokens expire in 1 hour
- Refresh tokens expire in 7 days
- Passwords hashed with BCrypt

## 📡 SignalR Hubs

### ChatHub (`/hubs/chat`)
- Real-time messaging
- Typing indicators
- Online presence

### NotificationHub (`/hubs/notifications`)
- Push notifications
- Event reminders
- Announcement broadcasts

## 📚 API Documentation

See [postman-collection.json](./postman-collection.json) for complete API documentation.

## 🗄️ Database

See [database-schema.md](../database-schema.md) for complete schema documentation.
