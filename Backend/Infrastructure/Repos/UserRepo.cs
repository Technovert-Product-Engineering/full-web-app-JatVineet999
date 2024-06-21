using Infrastructure.Db_Context;
using Infrastructure.Interfaces;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repos
{
    public class UserRepo(ToDoAppDbContext context) : IUserRepo
    {
        private readonly ToDoAppDbContext _context = context;

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            try
            {
                return await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving user by username", ex);
            }
        }

        public async Task AddUserAsync(User user)
        {
            try
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding user", ex);
            }
        }
    }
}
