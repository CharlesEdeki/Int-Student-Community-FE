using System.ComponentModel.DataAnnotations;

namespace ISC.Application.DTOs.Users;

/// <summary>
/// User data transfer object
/// </summary>
public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Country { get; set; }
    public string? Campus { get; set; }
    public string? Major { get; set; }
    public string? Year { get; set; }
    public string? Bio { get; set; }
    public List<string> Interests { get; set; } = new();
    public List<string> Languages { get; set; } = new();
    public bool IsOnline { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// Update user request
/// </summary>
public class UpdateUserRequest
{
    [MaxLength(100)]
    public string? Name { get; set; }

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

    public List<string>? Interests { get; set; }

    public List<string>? Languages { get; set; }
}

/// <summary>
/// User profile completion request (onboarding)
/// </summary>
public class CompleteProfileRequest
{
    [Required]
    [MaxLength(100)]
    public string Country { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Campus { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Major { get; set; } = string.Empty;

    [Required]
    [MaxLength(20)]
    public string Year { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Bio { get; set; }

    public List<string> Interests { get; set; } = new();

    public List<string> Languages { get; set; } = new();
}

/// <summary>
/// User summary for lists
/// </summary>
public class UserSummaryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string? Country { get; set; }
    public bool IsOnline { get; set; }
}
