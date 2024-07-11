using Application.Dto.User;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserServices _userService;
        private readonly IConfiguration _config;

        public UserController(IConfiguration configuration, IUserServices userService)
        {
            _config = configuration;
            _userService = userService;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> SignUp([FromBody] CreateUser userData)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool result = await _userService.SignUp(userData);
            if (result) // Assuming result contains the created user data or null if the user already exists
            {
                return StatusCode(201, new { message = "User created successfully", user = result });
            }
            return Conflict(new { message = "User already exists" });
        }


        [HttpPost("login")]
        public async Task<IActionResult> LogIn([FromBody] CreateUser userData)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            GetUser? userFound = await _userService.LogIn(userData);
            if (userFound != null)
            {
                string token = GenerateToken(userFound);
                return Ok(token);
            } // Return token or success message
            return Unauthorized("Invalid username or password");
        }
        private string GenerateToken(GetUser userData)
        {

            var securityKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["Jwt:key"]!));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, _config["Jwt:sub"]!),
            new Claim("Username", userData.Username!),
            new Claim("UserID", userData.UserID.ToString()!),
        };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:iss"],
                audience: _config["Jwt:aud"],

                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

    }
}
