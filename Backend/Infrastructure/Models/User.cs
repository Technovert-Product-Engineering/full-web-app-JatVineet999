namespace Infrastructure.Models
{
    public class User
    {
        public int UserID { get; set; }
        public string? Username { get; set; }
        public string? PasswordHash { get; set; }
        public ICollection<Tasks> Tasks { get; set; } = new List<Tasks>();
    }

}
