using Application.Dto.Tasks;

namespace Application.Interfaces
{
    public interface ITasksServices
    {
        Task<IEnumerable<ViewTasksDto>> ViewTasks(int userId);
        Task<bool> AddTask(AddTaskDto taskDto);
        Task<bool> EditTask(int taskId, TasksDto taskDto);
        Task<bool> DeleteTask(int taskId);
    }
}