# Student Connect - Database Schema

## PostgreSQL Database Design

This document outlines the complete database schema for the Student Connect platform.

---

## Tables Overview

| Table | Description |
|-------|-------------|
| `users` | User accounts and profile data |
| `groups` | Student groups with expiration |
| `group_members` | Many-to-many relationship between users and groups |
| `group_icebreakers` | Icebreaker questions for groups |
| `checklist_items` | Group checklist/tasks |
| `polls` | Group polls |
| `poll_options` | Options for each poll |
| `poll_votes` | User votes on poll options |
| `messages` | Group chat messages |
| `message_reactions` | Reactions on messages |
| `events` | Campus events |
| `event_attendees` | Event RSVPs |
| `notifications` | User notifications |
| `announcements` | Admin announcements |
| `refresh_tokens` | JWT refresh tokens |

---

## Table Definitions

### users

Primary user table storing authentication and profile data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `name` | VARCHAR(100) | NOT NULL | Full name |
| `avatar_url` | VARCHAR(500) | | Profile picture URL |
| `country` | VARCHAR(100) | | Home country |
| `bio` | TEXT | | User biography |
| `campus` | VARCHAR(50) | CHECK (campus IN ('Merchiston', 'Craiglockhart', 'Sighthill')) | Campus location |
| `major` | VARCHAR(100) | | Field of study |
| `year` | VARCHAR(20) | CHECK (year IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate')) | Academic year |
| `interests` | TEXT[] | DEFAULT '{}' | Array of interests |
| `languages` | TEXT[] | DEFAULT '{}' | Array of spoken languages |
| `group_size_preference` | VARCHAR(20) | CHECK (group_size_preference IN ('small', 'medium', 'large')) | Preferred group size |
| `matching_preference` | VARCHAR(20) | CHECK (matching_preference IN ('similar', 'diverse', 'any')) | Matching algorithm preference |
| `is_online` | BOOLEAN | DEFAULT false | Online status |
| `is_onboarded` | BOOLEAN | DEFAULT false | Onboarding completion status |
| `role` | VARCHAR(20) | DEFAULT 'user', CHECK (role IN ('user', 'admin')) | User role |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Account creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_users_email` ON `email`
- `idx_users_campus` ON `campus`
- `idx_users_is_online` ON `is_online`

---

### groups

Student groups with time-based expiration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `name` | VARCHAR(100) | NOT NULL | Group name |
| `description` | TEXT | | Group description |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `expires_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | Expiration timestamp |
| `is_active` | BOOLEAN | DEFAULT true | Active status |

**Indexes:**
- `idx_groups_expires_at` ON `expires_at`
- `idx_groups_is_active` ON `is_active`

---

### group_members

Junction table for users and groups.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `group_id` | UUID | NOT NULL, REFERENCES groups(id) ON DELETE CASCADE | Group reference |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | User reference |
| `joined_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Join timestamp |

**Constraints:**
- `UNIQUE (group_id, user_id)`

**Indexes:**
- `idx_group_members_group_id` ON `group_id`
- `idx_group_members_user_id` ON `user_id`

---

### group_icebreakers

Icebreaker questions for groups.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `group_id` | UUID | NOT NULL, REFERENCES groups(id) ON DELETE CASCADE | Group reference |
| `question` | TEXT | NOT NULL | Icebreaker question |
| `order_index` | INTEGER | DEFAULT 0 | Display order |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |

---

### checklist_items

Group task checklist items.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `group_id` | UUID | NOT NULL, REFERENCES groups(id) ON DELETE CASCADE | Group reference |
| `title` | VARCHAR(255) | NOT NULL | Task title |
| `is_completed` | BOOLEAN | DEFAULT false | Completion status |
| `completed_by` | UUID | REFERENCES users(id) ON DELETE SET NULL | User who completed |
| `completed_at` | TIMESTAMP WITH TIME ZONE | | Completion timestamp |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_checklist_items_group_id` ON `group_id`

---

### polls

Group polls for decision making.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `group_id` | UUID | NOT NULL, REFERENCES groups(id) ON DELETE CASCADE | Group reference |
| `question` | TEXT | NOT NULL | Poll question |
| `created_by` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Creator user |
| `is_active` | BOOLEAN | DEFAULT true | Active status |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `closes_at` | TIMESTAMP WITH TIME ZONE | | Optional close timestamp |

**Indexes:**
- `idx_polls_group_id` ON `group_id`

---

### poll_options

Options for polls.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `poll_id` | UUID | NOT NULL, REFERENCES polls(id) ON DELETE CASCADE | Poll reference |
| `text` | VARCHAR(255) | NOT NULL | Option text |
| `order_index` | INTEGER | DEFAULT 0 | Display order |

---

### poll_votes

User votes on poll options.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `poll_id` | UUID | NOT NULL, REFERENCES polls(id) ON DELETE CASCADE | Poll reference |
| `option_id` | UUID | NOT NULL, REFERENCES poll_options(id) ON DELETE CASCADE | Option reference |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Voter user |
| `voted_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Vote timestamp |

**Constraints:**
- `UNIQUE (poll_id, user_id)` - One vote per user per poll

---

### messages

Group chat messages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `group_id` | UUID | NOT NULL, REFERENCES groups(id) ON DELETE CASCADE | Group reference |
| `sender_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Sender user |
| `content` | TEXT | NOT NULL | Message content |
| `is_edited` | BOOLEAN | DEFAULT false | Edit status |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Send timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last edit timestamp |

**Indexes:**
- `idx_messages_group_id` ON `group_id`
- `idx_messages_sender_id` ON `sender_id`
- `idx_messages_created_at` ON `created_at`

---

### message_reactions

Reactions on messages.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `message_id` | UUID | NOT NULL, REFERENCES messages(id) ON DELETE CASCADE | Message reference |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Reactor user |
| `emoji` | VARCHAR(10) | NOT NULL | Emoji reaction |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Reaction timestamp |

**Constraints:**
- `UNIQUE (message_id, user_id, emoji)` - One reaction type per user per message

---

### events

Campus events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `title` | VARCHAR(200) | NOT NULL | Event title |
| `description` | TEXT | | Event description |
| `date` | DATE | NOT NULL | Event date |
| `time` | TIME | NOT NULL | Event time |
| `location` | VARCHAR(255) | NOT NULL | Event location |
| `category` | VARCHAR(50) | CHECK (category IN ('Cultural', 'Academic', 'Sports', 'Networking', 'Social', 'Other')) | Event category |
| `organizer_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Organizer user |
| `max_attendees` | INTEGER | | Maximum attendees |
| `image_url` | VARCHAR(500) | | Event image URL |
| `is_cancelled` | BOOLEAN | DEFAULT false | Cancellation status |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_events_date` ON `date`
- `idx_events_category` ON `category`
- `idx_events_organizer_id` ON `organizer_id`

---

### event_attendees

Event RSVPs.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `event_id` | UUID | NOT NULL, REFERENCES events(id) ON DELETE CASCADE | Event reference |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Attendee user |
| `rsvp_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | RSVP timestamp |

**Constraints:**
- `UNIQUE (event_id, user_id)`

---

### notifications

User notifications.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Recipient user |
| `type` | VARCHAR(50) | CHECK (type IN ('group', 'event', 'message', 'announcement', 'system')) | Notification type |
| `title` | VARCHAR(200) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message |
| `reference_id` | UUID | | Reference to related entity |
| `is_read` | BOOLEAN | DEFAULT false | Read status |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |

**Indexes:**
- `idx_notifications_user_id` ON `user_id`
- `idx_notifications_is_read` ON `is_read`
- `idx_notifications_created_at` ON `created_at`

---

### announcements

Admin announcements.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `title` | VARCHAR(200) | NOT NULL | Announcement title |
| `content` | TEXT | NOT NULL | Announcement content |
| `author_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Author user (admin) |
| `priority` | VARCHAR(20) | DEFAULT 'normal', CHECK (priority IN ('low', 'normal', 'high')) | Priority level |
| `is_active` | BOOLEAN | DEFAULT true | Active status |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_announcements_priority` ON `priority`
- `idx_announcements_created_at` ON `created_at`

---

### refresh_tokens

JWT refresh token storage.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique identifier |
| `user_id` | UUID | NOT NULL, REFERENCES users(id) ON DELETE CASCADE | Token owner |
| `token` | VARCHAR(500) | UNIQUE, NOT NULL | Refresh token |
| `expires_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | Expiration timestamp |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NOW() | Creation timestamp |
| `revoked_at` | TIMESTAMP WITH TIME ZONE | | Revocation timestamp |

**Indexes:**
- `idx_refresh_tokens_user_id` ON `user_id`
- `idx_refresh_tokens_token` ON `token`

---

## Entity Relationship Diagram

```
┌─────────────┐       ┌───────────────┐       ┌─────────────┐
│   users     │──────<│ group_members │>──────│   groups    │
└─────────────┘       └───────────────┘       └─────────────┘
      │                                              │
      │  ┌────────────────────────────────────────────┤
      │  │                    │                       │
      ▼  ▼                    ▼                       ▼
┌─────────────┐       ┌─────────────┐       ┌─────────────────┐
│  messages   │       │   polls     │       │ group_icebreakers│
└─────────────┘       └─────────────┘       └─────────────────┘
      │                     │                        
      ▼                     ▼               ┌─────────────────┐
┌─────────────────┐   ┌─────────────┐       │ checklist_items │
│message_reactions│   │poll_options │       └─────────────────┘
└─────────────────┘   └─────────────┘
                            │
                            ▼
                      ┌───────────┐
                      │poll_votes │
                      └───────────┘

┌─────────────┐       ┌─────────────────┐
│   events    │──────<│ event_attendees │>──────┐
└─────────────┘       └─────────────────┘       │
      │                                         │
      └─────────────────────────────────────────┤
                                                ▼
                                          ┌─────────────┐
                                          │   users     │
                                          └─────────────┘

┌───────────────┐     ┌───────────────┐     ┌────────────────┐
│ notifications │     │ announcements │     │ refresh_tokens │
└───────────────┘     └───────────────┘     └────────────────┘
        │                    │                      │
        └────────────────────┴──────────────────────┘
                             │
                             ▼
                       ┌─────────────┐
                       │   users     │
                       └─────────────┘
```

---

## SQL Creation Script

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    country VARCHAR(100),
    bio TEXT,
    campus VARCHAR(50) CHECK (campus IN ('Merchiston', 'Craiglockhart', 'Sighthill')),
    major VARCHAR(100),
    year VARCHAR(20) CHECK (year IN ('Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate')),
    interests TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    group_size_preference VARCHAR(20) CHECK (group_size_preference IN ('small', 'medium', 'large')),
    matching_preference VARCHAR(20) CHECK (matching_preference IN ('similar', 'diverse', 'any')),
    is_online BOOLEAN DEFAULT false,
    is_onboarded BOOLEAN DEFAULT false,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Groups table
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true
);

-- Group members junction table
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (group_id, user_id)
);

-- Group icebreakers
CREATE TABLE group_icebreakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist items
CREATE TABLE checklist_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Polls
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    closes_at TIMESTAMP WITH TIME ZONE
);

-- Poll options
CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text VARCHAR(255) NOT NULL,
    order_index INTEGER DEFAULT 0
);

-- Poll votes
CREATE TABLE poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    voted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (poll_id, user_id)
);

-- Messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message reactions
CREATE TABLE message_reactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (message_id, user_id, emoji)
);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    category VARCHAR(50) CHECK (category IN ('Cultural', 'Academic', 'Sports', 'Networking', 'Social', 'Other')),
    organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    max_attendees INTEGER,
    image_url VARCHAR(500),
    is_cancelled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees
CREATE TABLE event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rsvp_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (event_id, user_id)
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) CHECK (type IN ('group', 'event', 'message', 'announcement', 'system')),
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    reference_id UUID,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_campus ON users(campus);
CREATE INDEX idx_users_is_online ON users(is_online);
CREATE INDEX idx_groups_expires_at ON groups(expires_at);
CREATE INDEX idx_groups_is_active ON groups(is_active);
CREATE INDEX idx_group_members_group_id ON group_members(group_id);
CREATE INDEX idx_group_members_user_id ON group_members(user_id);
CREATE INDEX idx_checklist_items_group_id ON checklist_items(group_id);
CREATE INDEX idx_polls_group_id ON polls(group_id);
CREATE INDEX idx_messages_group_id ON messages(group_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_created_at ON announcements(created_at);
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
