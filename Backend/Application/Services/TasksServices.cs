using Application.Dto.Tasks;
using Application.Interfaces;
using AutoMapper;
using Infrastructure.Interfaces;
using Infrastructure.Models;

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

        public async Task<IEnumerable<ViewTasksDto>> ViewTasks(int userId)
        {
            try
            {
                var tasks = await _tasksRepo.GetTasksByUserIdAsync(userId);
                return _mapper.Map<IEnumerable<ViewTasksDto>>(tasks);
            }
            catch (Exception ex)
            {
                throw new Exception("Error viewing tasks", ex);
            }
        }

        public async Task<bool> AddTask(AddTaskDto  newTaskData)
        {
            try
            {
                var task = _mapper.Map<Tasks>(newTaskData);
                await _tasksRepo.AddTaskAsync(task);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error adding task", ex);
            }
        }

        public async Task<bool> EditTask(int taskId, TasksDto updateTaskData )
        {
            try
            {
                var existingTask = await _tasksRepo.GetTaskByIdAsync(taskId);
                if (existingTask == null)
                    return false;

                _mapper.Map(updateTaskData, existingTask);
                await _tasksRepo.UpdateTaskAsync(existingTask);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error editing task", ex);
            }
        }

        public async Task<bool> DeleteTask(int taskId)
        {
            try
            {
                var task = await _tasksRepo.GetTaskByIdAsync(taskId);
                if (task == null)
                    return false;

                await _tasksRepo.DeleteTaskAsync(taskId);
                return true;
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting task", ex);
            }
        }
    }
}
