using Application.Dto.User;

namespace Application.Interfaces
{
    public interface IUserServices
    {
        Task<bool> SignUp(CreateUser userData);
        Task<GetUser?> LogIn(CreateUser userData);
    }
}