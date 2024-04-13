
using Microsoft.AspNetCore.Mvc;
using Props.API.Auth;
using Props.API.Models;
using Props.API.Persistence;

namespace Props.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext dbContext;

        public AuthController(AppDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string>> Login([FromBody]UserCreds creds)
        {
            try
            {
                var user = this.dbContext.Users.FirstOrDefault(u => u.UserName == creds.Username && u.Password == creds.Password);

                if (user == null) return Unauthorized();

                var userClaims = new UserClaimsDto
                {
                    UserGuid = user.Id,
                    Name = user.Name,
                    EmailAddress = user.Email
                };

                var token = new JwtAuthenticationManager().GenerateToken(userClaims);

                return Ok(new { token });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, ex);
            }
        }
    }

    public class UserCreds
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}