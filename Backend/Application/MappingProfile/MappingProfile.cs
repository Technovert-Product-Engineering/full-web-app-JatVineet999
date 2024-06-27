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
            CreateMap<CreateUser, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<User, CreateUser>()
                 .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.PasswordHash));
            CreateMap<User, GetUser>()
                 .ForMember(dest => dest.Password, opt => opt.MapFrom(src => src.PasswordHash))
                 .ForMember(dest => dest.UserID, opt => opt.MapFrom(src => src.UserID));

            CreateMap<Tasks, GetTask>();
            CreateMap<CreateTask, Tasks>();
            CreateMap<Dto.Tasks.Task, Tasks>().ReverseMap();
        }
    }
}
