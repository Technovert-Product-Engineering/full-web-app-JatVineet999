namespace ToDo.Infrastructure.Models
{
    public class Tasks
    {
        public int TaskID { get; set; }
        public int UserID { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }

        public User? User { get; set; }
    }
}