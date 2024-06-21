using System.Security.Claims;
using Application.Dto.Tasks;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TasksController : ControllerBase
    {
        private readonly ITasksServices _tasksService;

        public TasksController(ITasksServices tasksService)
        {
            _tasksService = tasksService;
        }

        [HttpGet]
        public async Task<IActionResult> GetTasksByUserId()
        {
            try
            {
                int userID = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                IEnumerable<ViewTasksDto> tasks = await _tasksService.ViewTasks(userID);
                return Ok(tasks);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] AddTaskDto newTaskData)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                bool result = await _tasksService.AddTask(newTaskData);
                if (result)
                    return StatusCode(201, "Task added successfully");
                return BadRequest("Failed to add task");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("{taskId}")]
        public async Task<IActionResult> EditTask(int taskId, [FromBody] TasksDto updateTaskData)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                bool result = await _tasksService.EditTask(taskId, updateTaskData);
                if (result)
                    return Ok("Task updated successfully");
                return NotFound("Task not found");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            try
            {
                bool result = await _tasksService.DeleteTask(taskId);
                if (result)
                    return Ok("Task deleted successfully");
                return NotFound("Task not found");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
