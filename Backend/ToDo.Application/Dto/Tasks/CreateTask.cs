using System.ComponentModel.DataAnnotations;
namespace ToDo.Application.Dto.Tasks
{
    public class CreateTask : Task
    {
        [Required(ErrorMessage = "UserID is required.")]
        public int UserID { get; set; }
    }
}