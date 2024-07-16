using ToDo.Application.Interfaces;
using ToDo.Application.Services;

namespace ToDo.WebApi
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IUserServices, UserService>();
            services.AddScoped<ITasksServices, TasksService>();
        }
    }
}