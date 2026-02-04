using System.ComponentModel.DataAnnotations;
using ISC.Domain.Enums;

namespace ISC.Domain.Entities;

/// <summary>
/// Represents a community event
/// </summary>
public class Event : BaseEntity
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    public bool IsVirtual { get; set; }

    [MaxLength(500)]
    public string? VirtualLink { get; set; }

    public int? MaxAttendees { get; set; }

    public EventStatus Status { get; set; } = EventStatus.Upcoming;

    // Foreign keys
    public Guid? GroupId { get; set; }
    public Guid OrganizerId { get; set; }

    // Navigation properties
    public virtual Group? Group { get; set; }
    public virtual User Organizer { get; set; } = null!;
    public virtual ICollection<EventAttendee> Attendees { get; set; } = new List<EventAttendee>();
}

/// <summary>
/// Represents a user's attendance at an event
/// </summary>
public class EventAttendee : BaseEntity
{
    public Guid EventId { get; set; }
    public Guid UserId { get; set; }

    public AttendeeStatus Status { get; set; } = AttendeeStatus.Going;

    public DateTime RegisteredAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Event Event { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
