using System.ComponentModel.DataAnnotations;
using ISC.Domain.Enums;

namespace ISC.Domain.Entities;

/// <summary>
/// Represents a notification for a user
/// </summary>
public class Notification : BaseEntity
{
    public Guid UserId { get; set; }

    public NotificationType Type { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Message { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadAt { get; set; }

    /// <summary>
    /// JSON data containing additional context (e.g., related entity IDs)
    /// </summary>
    public string? Data { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
}

/// <summary>
/// Represents an announcement to a group
/// </summary>
public class Announcement : BaseEntity
{
    public Guid GroupId { get; set; }

    public Guid AuthorId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(2000)]
    public string Content { get; set; } = string.Empty;

    public bool IsPinned { get; set; }

    // Navigation properties
    public virtual Group Group { get; set; } = null!;
    public virtual User Author { get; set; } = null!;
}

/// <summary>
/// Represents a checklist item for onboarding
/// </summary>
public class ChecklistItem : BaseEntity
{
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    public bool IsCompleted { get; set; }

    public DateTime? CompletedAt { get; set; }

    public int SortOrder { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
}
