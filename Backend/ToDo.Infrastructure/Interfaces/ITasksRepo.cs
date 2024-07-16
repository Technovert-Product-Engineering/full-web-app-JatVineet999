using ToDo.Infrastructure.Models;

namespace ToDo.Infrastructure.Interfaces
{
    public interface ITasksRepo
    {
        Task<IEnumerable<Tasks>> GetTasksByUserIdAsync(int userId);
        Task<Tasks?> GetTaskByIdAsync(int id);
        Task AddTaskAsync(Tasks task);
        Task UpdateTaskAsync(Tasks task);
        Task DeleteTaskAsync(int id);
    }
}