using ToDo.Application.Dto.User;
using ToDo.Application.Interfaces;
using AutoMapper;
using ToDo.Infrastructure.Interfaces;
using ToDo.Infrastructure.Models;
using BCrypt.Net;

namespace ToDo.Application.Services
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

        public async Task<bool> SignUp(CreateUser userData)
        {

            if (await _userRepo.GetUserByUsernameAsync(userData.Username!) != null)
                return false;

            var user = _mapper.Map<User>(userData);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userData.Password);

            await _userRepo.AddUserAsync(user);
            return true;
        }

        public async Task<GetUser?> LogIn(CreateUser userData)
        {
            var user = await _userRepo.GetUserByUsernameAsync(userData.Username!);
            if (user == null || !BCrypt.Net.BCrypt.Verify(userData.Password, user.PasswordHash))
            {
                return null; 
            }
            var userDto = _mapper.Map<GetUser>(user);
            return userDto;
        }

    }
}
