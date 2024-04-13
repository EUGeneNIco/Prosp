using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Props.API.Auth
{
    public class JwtAuthenticationManager
    {
        public string GenerateToken(UserClaimsDto userClaims)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenKey = Encoding.ASCII.GetBytes("Jesus Is Lord over the Philippines");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] {
                    new Claim("UserGuid", userClaims.UserGuid.ToString()),
                    new Claim(ClaimTypes.Name, userClaims.Name),
                    new Claim(ClaimTypes.Email, userClaims.EmailAddress)
                }),
                Expires = DateTime.Now.AddMinutes(480), // 8 Hours
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(tokenKey), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
