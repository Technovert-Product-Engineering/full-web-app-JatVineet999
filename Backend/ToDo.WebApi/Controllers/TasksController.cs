using System.Security.Claims;
using ToDo.Application.Dto.Tasks;
using ToDo.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Task = ToDo.Application.Dto.Tasks.Task;

namespace ToDo.WebApi.Controllers
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

        [HttpGet("tasks")]
        public async Task<IActionResult> GetTasksByUserId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim == null)
            {
                return Unauthorized("UserID not found in token.");
            }

            if (!int.TryParse(userIdClaim.Value, out int userID))
            {
                return Unauthorized("Invalid UserID in token.");
            }

            IEnumerable<GetTask> tasks = await _tasksService.ViewTasks(userID);
            return Ok(tasks);
        }

        [HttpPost]
        public async Task<IActionResult> AddTask([FromBody] CreateTask newTaskData)
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserID");
            if (userIdClaim == null)
            {
                return Unauthorized("UserID not found in token.");
            }

            if (!int.TryParse(userIdClaim.Value, out int userID))
            {
                return Unauthorized("Invalid UserID in token.");
            }
            newTaskData.UserID = userID;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool result = await _tasksService.AddTask(newTaskData);
            if (result)
                return StatusCode(201, new { message = "Task added successfully" });

            return BadRequest(new { message = "Failed to add task" });
        }


        [HttpPut("{taskId}")]
        public async Task<IActionResult> EditTask(int taskId, [FromBody] Task updateTaskData)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            bool result = await _tasksService.EditTask(taskId, updateTaskData);
            if (result)
                return Ok(new { message = "Task updated successfully" });
            return NotFound(new { message = "Task not found" });
        }

        [HttpDelete("{taskId}")]
        public async Task<IActionResult> DeleteTask(int taskId)
        {
            bool result = await _tasksService.DeleteTask(taskId);
            if (result)
                return Ok(new { message = "Task deleted successfully" });
            return NotFound(new { message = "Task not found" });
        }

    }
}
