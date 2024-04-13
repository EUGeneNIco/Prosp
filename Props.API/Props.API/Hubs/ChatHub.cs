using Microsoft.AspNetCore.SignalR;
using Props.API.Models;

namespace Props.API.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinChat(UserConnection conn)
        {
            await Clients.All.SendAsync(method: "ReceiveMessage", "admin", $"{conn.Name} is online.");
        }

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);
            await Clients.Group(conn.ChatRoom).SendAsync("ReceiveMessage", "admin", $"{conn.Name} has joined {conn.ChatRoom}.");
        }
    }
}
