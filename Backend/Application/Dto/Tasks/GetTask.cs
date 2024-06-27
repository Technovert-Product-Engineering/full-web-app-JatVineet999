namespace Application.Dto.Tasks
{
    public class GetTask : Task
    {
        public int TaskID { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModifiedAt { get; set; }
    }
}