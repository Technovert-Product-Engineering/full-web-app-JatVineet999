using Microsoft.EntityFrameworkCore;
using ToDo.Infrastructure.Models;

namespace ToDo.Infrastructure.Db_Context
{
    public class ToDoAppDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Tasks> Tasks { get; set; }

        public ToDoAppDbContext(DbContextOptions<ToDoAppDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(u => u.UserID);
                entity.Property(u => u.Username).IsRequired();
                entity.HasIndex(u => u.Username).IsUnique();
            });

            modelBuilder.Entity<Tasks>(entity =>
            {
                entity.HasKey(t => t.TaskID);
                entity.Property(t => t.Title).IsRequired();
                entity.Property(t => t.CreatedAt).HasDefaultValueSql("GETDATE()");

                entity.HasOne(t => t.User)
                      .WithMany(u => u.Tasks)
                      .HasForeignKey(t => t.UserID)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
