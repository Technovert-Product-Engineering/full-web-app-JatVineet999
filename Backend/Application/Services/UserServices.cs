using Application.Dto.User;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Interfaces;
using Infrastructure.Models;
using BCrypt.Net;

namespace Application.Services
{
    public class UserService : IUserServices
    {
        private readonly IUserRepo _userRepo;
        private readonly IMapper _mapper;

        public UserService(IUserRepo userRepo, IMapper mapper)
        {
            _userRepo = userRepo;
            _mapper = mapper;
        }

        public async Task<bool> SignUp(AddUserDto userData)
        {

            if (await _userRepo.GetUserByUsernameAsync(userData.Username!) != null)
                return false;

            var user = _mapper.Map<User>(userData);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userData.Password);

            await _userRepo.AddUserAsync(user);
            return true;
        }

        public async Task<UserDto?> LogIn(AddUserDto userData)
        {
            var user = await _userRepo.GetUserByUsernameAsync(userData.Username!);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userData.Password, user.PasswordHash))
            {
                return null; // Return null if user is not found or password does not match
            }

            // Return the mapped UserDto if credentials are valid
            var userDto = _mapper.Map<UserDto>(user);
            return userDto;
        }

    }
}
