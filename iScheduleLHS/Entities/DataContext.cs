using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using iScheduleLHS.Entities;

namespace iScheduleLHS.Entities
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            // connect to sql server database
            options.UseSqlServer(Configuration.GetConnectionString("iScheduleLHSDB"));
        }

        public DbSet<User> Users { get; set; }

        //course vs blocks - per student
        public DbSet<CourseInfo> CourseInfos { get; set; }

        //lunch schedule - per student
        public DbSet<LunchSchedule> LunchSchedules { get; set; }
    }
}