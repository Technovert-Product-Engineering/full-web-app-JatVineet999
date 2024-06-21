using Infrastructure.Db_Context;
using Infrastructure.Interfaces;
using Infrastructure.Models;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repos
{
    public class TasksRepo(ToDoAppDbContext context) : ITasksRepo
    {
        private readonly ToDoAppDbContext _context = context;

        public async Task<IEnumerable<Tasks>> GetTasksByUserIdAsync(int userId)
        {
            try
            {
                return await _context.Tasks.Where(t => t.UserID == userId).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving tasks by user ID", ex);
            }
        }

        public async Task<Tasks?> GetTaskByIdAsync(int id)
        {
            try
            {
                return await _context.Tasks.FindAsync(id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving task by ID", ex);
            }
        }

        public async Task AddTaskAsync(Tasks task)
        {
            try
            {
                task.CreatedAt = DateTime.UtcNow;
                task.ModifiedAt = DateTime.UtcNow;
                await _context.Tasks.AddAsync(task);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding task", ex);
            }
        }

        public async Task UpdateTaskAsync(Tasks task)
        {
            try
            {
                task.ModifiedAt = DateTime.UtcNow;
                _context.Tasks.Update(task);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating task", ex);
            }
        }

        public async Task DeleteTaskAsync(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task != null)
                {
                    _context.Tasks.Remove(task);
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting task", ex);
            }
        }
    }
}
