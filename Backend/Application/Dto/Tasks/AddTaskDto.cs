using System.ComponentModel.DataAnnotations;
namespace Application.Dto.Tasks
{
    public class AddTaskDto:TasksDto
    {
        [Required(ErrorMessage = "UserID is required.")]
        public int UserID { get; set; }
    }
}