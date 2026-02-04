using System.ComponentModel.DataAnnotations;

namespace ISC.Domain.Entities;

/// <summary>
/// Represents a user in the International Student Community platform
/// </summary>
public class User : BaseEntity
{
    [Required]
    [EmailAddress]
    [MaxLength(255)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    [MaxLength(100)]
    public string? Country { get; set; }

    [MaxLength(100)]
    public string? Campus { get; set; }

    [MaxLength(100)]
    public string? Major { get; set; }

    [MaxLength(20)]
    public string? Year { get; set; }

    [MaxLength(500)]
    public string? Bio { get; set; }

    public List<string> Interests { get; set; } = new();

    public List<string> Languages { get; set; } = new();

    public bool IsOnline { get; set; }

    public DateTime? LastSeenAt { get; set; }

    // Navigation properties
    public virtual ICollection<GroupMember> GroupMemberships { get; set; } = new List<GroupMember>();
    public virtual ICollection<EventAttendee> EventAttendances { get; set; } = new List<EventAttendee>();
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<PollVote> PollVotes { get; set; } = new List<PollVote>();
    public virtual ICollection<ChecklistItem> ChecklistItems { get; set; } = new List<ChecklistItem>();
}

/// <summary>
/// Base entity with common properties
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
