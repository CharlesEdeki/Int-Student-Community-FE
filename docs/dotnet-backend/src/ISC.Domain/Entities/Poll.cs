using System.ComponentModel.DataAnnotations;

namespace ISC.Domain.Entities;

/// <summary>
/// Represents a poll within a group
/// </summary>
public class Poll : BaseEntity
{
    [Required]
    [MaxLength(500)]
    public string Question { get; set; } = string.Empty;

    public Guid GroupId { get; set; }

    public Guid CreatorId { get; set; }

    public bool IsActive { get; set; } = true;

    public DateTime? ExpiresAt { get; set; }

    public bool AllowMultipleVotes { get; set; }

    // Navigation properties
    public virtual Group Group { get; set; } = null!;
    public virtual User Creator { get; set; } = null!;
    public virtual ICollection<PollOption> Options { get; set; } = new List<PollOption>();
}

/// <summary>
/// Represents an option in a poll
/// </summary>
public class PollOption : BaseEntity
{
    public Guid PollId { get; set; }

    [Required]
    [MaxLength(200)]
    public string Text { get; set; } = string.Empty;

    public int VoteCount { get; set; }

    // Navigation properties
    public virtual Poll Poll { get; set; } = null!;
    public virtual ICollection<PollVote> Votes { get; set; } = new List<PollVote>();
}

/// <summary>
/// Represents a user's vote on a poll option
/// </summary>
public class PollVote : BaseEntity
{
    public Guid PollOptionId { get; set; }
    public Guid UserId { get; set; }

    // Navigation properties
    public virtual PollOption PollOption { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
