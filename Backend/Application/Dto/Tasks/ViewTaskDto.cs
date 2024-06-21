namespace Application.Dto.Tasks
{
    public class ViewTasksDto : TasksDto
    {
        public int TaskID { get; set; }
        public bool IsCompleted { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}