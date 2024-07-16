using Microsoft.Extensions.DependencyInjection;
using ToDo.Infrastructure.Interfaces;
using ToDo.Infrastructure.Repos;

namespace ToDo.Infrastructure
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            // Configure Entity Framework and DbContext
            // services.AddDbContext<ApplicationDbContext>(options =>
            //     options.UseSqlServer(connectionString));

            // Register repositories
            services.AddScoped<IUserRepo, UserRepo>();
            services.AddScoped<ITasksRepo, TasksRepo>();
        }
    }
}
