using Application.Dto.Tasks;
using Task = Application.Dto.Tasks.Task;

namespace Application.Interfaces
{
    public interface ITasksServices
    {
        Task<IEnumerable<GetTask>> ViewTasks(int userId);
        Task<bool> AddTask(CreateTask taskDto);
        Task<bool> EditTask(int taskId, Task taskDto);
        Task<bool> DeleteTask(int taskId);
    }
}