using Application.Dto.Tasks;
using Application.Dto.User;
using AutoMapper;
using Infrastructure.Models;

namespace Application.MappingProfiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AddUserDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<User, AddUserDto>()
                 .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.PasswordHash));
            CreateMap<User, UserDto>()
                 .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.PasswordHash))
                 .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.UserID));

            CreateMap<Tasks, ViewTasksDto>();
            CreateMap<AddTaskDto, Tasks>();
            CreateMap<TasksDto, Tasks>().ReverseMap();
        }
    }
}
