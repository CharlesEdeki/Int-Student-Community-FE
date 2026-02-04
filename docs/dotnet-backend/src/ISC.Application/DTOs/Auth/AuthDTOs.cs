using System.ComponentModel.DataAnnotations;

namespace ISC.Application.DTOs.Auth;

/// <summary>
/// Login request
/// </summary>
public class LoginRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Registration request
/// </summary>
public class RegisterRequest
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;
}

/// <summary>
/// Refresh token request
/// </summary>
public class RefreshTokenRequest
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}

/// <summary>
/// Authentication response with user and tokens
/// </summary>
public class AuthResponse
{
    public UserResponse User { get; set; } = null!;
    public TokenResponse Tokens { get; set; } = null!;
}

/// <summary>
/// User data in auth response
/// </summary>
public class UserResponse
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
/// Token response
/// </summary>
public class TokenResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty;
    public int ExpiresIn { get; set; }
    public string TokenType { get; set; } = "Bearer";
}
