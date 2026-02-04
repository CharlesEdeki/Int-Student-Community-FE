using System.ComponentModel.DataAnnotations;

namespace ISC.Domain.Entities;

/// <summary>
/// Represents a chat message between users
/// </summary>
public class Message : BaseEntity
{
    [Required]
    [MaxLength(5000)]
    public string Content { get; set; } = string.Empty;

    public Guid SenderId { get; set; }

    public Guid? RecipientId { get; set; }

    public Guid? GroupId { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadAt { get; set; }

    public bool IsEdited { get; set; }

    public DateTime? EditedAt { get; set; }

    public bool IsDeleted { get; set; }

    // Navigation properties
    public virtual User Sender { get; set; } = null!;
    public virtual User? Recipient { get; set; }
    public virtual Group? Group { get; set; }
}
