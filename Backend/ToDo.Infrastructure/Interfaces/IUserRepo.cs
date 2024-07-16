using ToDo.Infrastructure.Models;
namespace ToDo.Infrastructure.Interfaces
{
    public interface IUserRepo
    {

        Task<User?> GetUserByUsernameAsync(string username);
        Task AddUserAsync(User user);
    }
}

