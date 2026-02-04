using System.ComponentModel.DataAnnotations;
using ISC.Domain.Enums;

namespace ISC.Domain.Entities;

/// <summary>
/// Represents a community group
/// </summary>
public class Group : BaseEntity
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [Required]
    [MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    public bool IsPrivate { get; set; }

    public int MemberCount { get; set; }

    // Navigation properties
    public virtual ICollection<GroupMember> Members { get; set; } = new List<GroupMember>();
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();
    public virtual ICollection<Poll> Polls { get; set; } = new List<Poll>();
    public virtual ICollection<Announcement> Announcements { get; set; } = new List<Announcement>();
}

/// <summary>
/// Represents a user's membership in a group
/// </summary>
public class GroupMember : BaseEntity
{
    public Guid GroupId { get; set; }
    public Guid UserId { get; set; }

    public GroupRole Role { get; set; } = GroupRole.Member;

    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public virtual Group Group { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
