using Microsoft.AspNetCore.Mvc;
using Props.API.Models;
using Props.API.Persistence;

namespace Props.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public UsersController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpGet("otherUsers/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<UserDto>>> GetUsers(int userId)
        {
            try
            {
                var users = this.dbContext.Users
                    .Where(u => u.Id != userId)
                    .Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role,
                }).ToList();

                return Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }

        [HttpGet("{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetUserDetails(int userId)
        {
            try
            {
                var user = this.dbContext.Users.FirstOrDefault(u => u.Id == userId);

                if (user == null) return Ok(null);

                return Ok(new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role,
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }
}