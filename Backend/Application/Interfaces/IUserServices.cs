using Application.Dto.User;

namespace Application.Interfaces
{
    public interface IUserServices
    {
        Task<bool> SignUp(AddUserDto userData);
        Task<UserDto?> LogIn(AddUserDto userData);
    }
}