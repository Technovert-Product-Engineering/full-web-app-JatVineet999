using Microsoft.Extensions.DependencyInjection;
using Application.Services;
using Application.MappingProfiles;
using Application.Interfaces;

namespace Application
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
