using Microsoft.AspNetCore.SignalR;
using Props.API.Models;

namespace Props.API.Hubs
{
    public class ChatHub : Hub
    {
        public async Task UserIsOnline(UserConnection conn)
        {
            await Clients.Others.SendAsync("UserIsOnline", "admin", $"{conn.Name} is online.");
        }

        public async Task UserIdIsOnline(UserConnection conn)
        {
            await Clients.Others.SendAsync("UserIdIsOnline", "admin", $"{conn.UserId}");
        }


        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);
            await Clients.Group(conn.ChatRoom).SendAsync("JoinSpecificChatRoom", "admin", $"{conn.Name} has joined {conn.ChatRoom}.");
        }
    }
}
