using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ISC.Application.DTOs.Users;
using ISC.Application.Services;

namespace ISC.API.Controllers;

/// <summary>
/// User management endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Get all users with optional filtering
    /// </summary>
    /// <param name="country">Filter by country</param>
    /// <param name="campus">Filter by campus</param>
    /// <param name="major">Filter by major</param>
    /// <returns>List of users</returns>
    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<UserDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? country = null,
        [FromQuery] string? campus = null,
        [FromQuery] string? major = null)
    {
        var result = await _userService.GetAllAsync(country, campus, major);
        return Ok(result);
    }

    /// <summary>
    /// Get user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User details</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _userService.GetByIdAsync(id);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Get current authenticated user's profile
    /// </summary>
    /// <returns>Current user details</returns>
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMe()
    {
        var userId = User.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var result = await _userService.GetByIdAsync(Guid.Parse(userId));
        return Ok(result);
    }

    /// <summary>
    /// Update user profile
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="request">Update data</param>
    /// <returns>Updated user</returns>
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<UserDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateUserRequest request)
    {
        var userId = User.FindFirst("sub")?.Value;
        
        // Users can only update their own profile (unless admin)
        if (userId != id.ToString() && !User.IsInRole("Admin"))
        {
            return Forbid();
        }

        var result = await _userService.UpdateAsync(id, request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Delete user account
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>Success confirmation</returns>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        var userId = User.FindFirst("sub")?.Value;
        
        if (userId != id.ToString() && !User.IsInRole("Admin"))
        {
            return Forbid();
        }

        var result = await _userService.DeleteAsync(id);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Search users by name or email
    /// </summary>
    /// <param name="query">Search query</param>
    /// <returns>Matching users</returns>
    [HttpGet("search")]
    [ProducesResponseType(typeof(ApiResponse<List<UserDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Search([FromQuery] string query)
    {
        var result = await _userService.SearchAsync(query);
        return Ok(result);
    }

    /// <summary>
    /// Get users with similar interests for connection suggestions
    /// </summary>
    /// <returns>Suggested connections</returns>
    [HttpGet("suggestions")]
    [ProducesResponseType(typeof(ApiResponse<List<UserDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetSuggestions()
    {
        var userId = User.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var result = await _userService.GetSuggestionsAsync(Guid.Parse(userId));
        return Ok(result);
    }
}
