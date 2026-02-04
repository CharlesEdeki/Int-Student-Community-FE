namespace ISC.Domain.Enums;

/// <summary>
/// User roles in the platform
/// </summary>
public enum UserRole
{
    Student = 0,
    Ambassador = 1,
    Staff = 2,
    Admin = 3
}

/// <summary>
/// Roles within a group
/// </summary>
public enum GroupRole
{
    Member = 0,
    Moderator = 1,
    Admin = 2,
    Owner = 3
}

/// <summary>
/// Event status
/// </summary>
public enum EventStatus
{
    Draft = 0,
    Upcoming = 1,
    Ongoing = 2,
    Completed = 3,
    Cancelled = 4
}

/// <summary>
/// Event attendee status
/// </summary>
public enum AttendeeStatus
{
    Going = 0,
    Interested = 1,
    NotGoing = 2
}

/// <summary>
/// Notification types
/// </summary>
public enum NotificationType
{
    General = 0,
    Message = 1,
    GroupInvite = 2,
    EventReminder = 3,
    Announcement = 4,
    PollCreated = 5,
    NewMember = 6,
    EventUpdate = 7
}
