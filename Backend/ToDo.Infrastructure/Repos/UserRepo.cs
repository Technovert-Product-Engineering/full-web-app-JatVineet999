using ToDo.Infrastructure.Db_Context;
using ToDo.Infrastructure.Interfaces;
using ToDo.Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace ToDo.Infrastructure.Repos
{
    public class UserRepo : IUserRepo
    {
        private readonly ToDoAppDbContext _context;

        public UserRepo(ToDoAppDbContext context)
        {
            _context = context;
        }

        public async Task<User?> GetUserByUsernameAsync(string username)
        {
            return await _context.Users.SingleOrDefaultAsync(u => u.Username == username);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }
    }
}
