using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ISC.Application.Services;

namespace ISC.API.Hubs;

/// <summary>
/// SignalR hub for real-time chat functionality
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    private readonly IMessageService _messageService;
    private readonly ILogger<ChatHub> _logger;
    private static readonly Dictionary<string, string> _userConnections = new();

    public ChatHub(IMessageService messageService, ILogger<ChatHub> logger)
    {
        _messageService = messageService;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst("sub")?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            _userConnections[userId] = Context.ConnectionId;
            
            // Notify others that user is online
            await Clients.Others.SendAsync("UserOnline", userId);
            
            _logger.LogInformation("User {UserId} connected to ChatHub", userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst("sub")?.Value;
        
        if (!string.IsNullOrEmpty(userId))
        {
            _userConnections.Remove(userId);
            
            // Notify others that user is offline
            await Clients.Others.SendAsync("UserOffline", userId);
            
            _logger.LogInformation("User {UserId} disconnected from ChatHub", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Send a direct message to another user
    /// </summary>
    public async Task SendMessage(string recipientId, string content)
    {
        var senderId = Context.User?.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(senderId))
        {
            return;
        }

        // Save message to database
        var message = await _messageService.SendDirectMessageAsync(
            Guid.Parse(senderId), 
            Guid.Parse(recipientId), 
            content
        );

        // Send to recipient if online
        if (_userConnections.TryGetValue(recipientId, out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("ReceiveMessage", message);
        }

        // Confirm to sender
        await Clients.Caller.SendAsync("MessageSent", message);
    }

    /// <summary>
    /// Send a message to a group
    /// </summary>
    public async Task SendGroupMessage(string groupId, string content)
    {
        var senderId = Context.User?.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(senderId))
        {
            return;
        }

        var message = await _messageService.SendGroupMessageAsync(
            Guid.Parse(senderId), 
            Guid.Parse(groupId), 
            content
        );

        await Clients.Group(groupId).SendAsync("ReceiveGroupMessage", message);
    }

    /// <summary>
    /// Join a group chat room
    /// </summary>
    public async Task JoinGroup(string groupId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupId);
        
        var userId = Context.User?.FindFirst("sub")?.Value;
        await Clients.Group(groupId).SendAsync("UserJoinedGroup", userId, groupId);
    }

    /// <summary>
    /// Leave a group chat room
    /// </summary>
    public async Task LeaveGroup(string groupId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupId);
        
        var userId = Context.User?.FindFirst("sub")?.Value;
        await Clients.Group(groupId).SendAsync("UserLeftGroup", userId, groupId);
    }

    /// <summary>
    /// Broadcast typing indicator
    /// </summary>
    public async Task Typing(string recipientId)
    {
        var senderId = Context.User?.FindFirst("sub")?.Value;
        
        if (_userConnections.TryGetValue(recipientId, out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("UserTyping", senderId);
        }
    }

    /// <summary>
    /// Mark messages as read
    /// </summary>
    public async Task MarkAsRead(string senderId)
    {
        var userId = Context.User?.FindFirst("sub")?.Value;
        
        if (string.IsNullOrEmpty(userId))
        {
            return;
        }

        await _messageService.MarkAsReadAsync(Guid.Parse(senderId), Guid.Parse(userId));
        
        if (_userConnections.TryGetValue(senderId, out var connectionId))
        {
            await Clients.Client(connectionId).SendAsync("MessagesRead", userId);
        }
    }

    /// <summary>
    /// Get list of online users
    /// </summary>
    public async Task GetOnlineUsers()
    {
        var onlineUserIds = _userConnections.Keys.ToList();
        await Clients.Caller.SendAsync("OnlineUsers", onlineUserIds);
    }
}
