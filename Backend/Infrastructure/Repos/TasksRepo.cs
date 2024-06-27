using Infrastructure.Db_Context;
using Infrastructure.Interfaces;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repos
{
    public class TasksRepo : ITasksRepo
    {
        private readonly ToDoAppDbContext _context;

        public TasksRepo(ToDoAppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tasks>> GetTasksByUserIdAsync(int userId)
        {
            return await _context.Tasks.Where(t => t.UserID == userId).ToListAsync();
        }

        public async Task<Tasks?> GetTaskByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task AddTaskAsync(Tasks task)
        {
            task.CreatedAt = DateTime.UtcNow;
            task.ModifiedAt = DateTime.UtcNow;
            await _context.Tasks.AddAsync(task);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTaskAsync(Tasks task)
        {
            task.ModifiedAt = DateTime.UtcNow;
            _context.Tasks.Update(task);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTaskAsync(int id)
        {
            var task = await _context.Tasks.FindAsync(id);
            if (task != null)
            {
                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();
            }
        }
    }
}
