using AutoMapper;
using iScheduleLHS.Entities;
using iScheduleLHS.Models.Users;

namespace iScheduleLHS.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<RegisterModel, User>();
            CreateMap<UpdateModel, User>();
        }
    }
}