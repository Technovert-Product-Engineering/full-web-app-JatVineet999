using Infrastructure.Models;
namespace Infrastructure.Interfaces
{
    public interface IUserRepo
    {

        Task<User?> GetUserByUsernameAsync(string username);
        Task AddUserAsync(User user);
    }
}

