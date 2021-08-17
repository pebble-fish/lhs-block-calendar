using System.ComponentModel.DataAnnotations;

namespace iScheduleLHS.Entities
{
    public class User
    {
        [Key]
        [Required]
        public int Id { get; set; }

        public string FirstName { get; set; }
        
        public string LastName { get; set; }
        
        public string Username { get; set; }
        
        public byte[] PasswordHash { get; set; }
        
        public byte[] PasswordSalt { get; set; }
    }
}