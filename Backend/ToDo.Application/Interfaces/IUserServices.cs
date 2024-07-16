using ToDo.Application.Dto.User;

namespace ToDo.Application.Interfaces
{
    public interface IUserServices
    {
        Task<bool> SignUp(CreateUser userData);
        Task<GetUser?> LogIn(CreateUser userData);
    }
}