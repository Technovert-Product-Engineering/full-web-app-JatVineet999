using Application.Dto.Tasks;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Interfaces;
using Infrastructure.Models;
using Task = Application.Dto.Tasks.Task;

namespace Application.Services
{
    public class TasksService : ITasksServices
    {
        private readonly ITasksRepo _tasksRepo;
        private readonly IMapper _mapper;

        public TasksService(ITasksRepo tasksRepo, IMapper mapper)
        {
            _tasksRepo = tasksRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GetTask>> ViewTasks(int userId)
        {
            var tasks = await _tasksRepo.GetTasksByUserIdAsync(userId);
            return _mapper.Map<IEnumerable<GetTask>>(tasks);
        }

        public async Task<bool> AddTask(CreateTask newTaskData)
        {
            var task = _mapper.Map<Tasks>(newTaskData);
            await _tasksRepo.AddTaskAsync(task);
            return true;
        }

        public async Task<bool> EditTask(int taskId, Task updateTaskData)
        {
            var existingTask = await _tasksRepo.GetTaskByIdAsync(taskId);
            if (existingTask == null)
                return false;

            _mapper.Map(updateTaskData, existingTask);
            await _tasksRepo.UpdateTaskAsync(existingTask);
            return true;
        }

        public async Task<bool> DeleteTask(int taskId)
        {
            var task = await _tasksRepo.GetTaskByIdAsync(taskId);
            if (task == null)
                return false;

            await _tasksRepo.DeleteTaskAsync(taskId);
            return true;
        }
    }
}
