using Microsoft.Extensions.DependencyInjection;
using Infrastructure.Interfaces;
using Infrastructure.Repos;

namespace Infrastructure
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
