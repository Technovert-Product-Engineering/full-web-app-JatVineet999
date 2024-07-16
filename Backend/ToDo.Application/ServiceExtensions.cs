using Microsoft.Extensions.DependencyInjection;
using ToDo.Application.Services;
using ToDo.Application.MappingProfiles;
using ToDo.Application.Interfaces;

namespace ToDo.Application
{
    public static class ServiceExtensions
    {
        public static void ConfigureServices(IServiceCollection services)
        {
            services.AddScoped<IUserServices, UserService>();
            services.AddScoped<ITasksServices, TasksService>();

            // Register AutoMapper
            services.AddAutoMapper(typeof(MappingProfile));
        }
    }
}
