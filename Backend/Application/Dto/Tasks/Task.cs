using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Tasks
{
    public class Task
    {
        [Required(ErrorMessage = "Title is required.")]
        [StringLength(100, ErrorMessage = "Title cannot be longer than 100 characters.")]
        public string? Title { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot be longer than 500 characters.")]
        public string? Description { get; set; }

        public bool IsCompleted { get; set; }

    }
}