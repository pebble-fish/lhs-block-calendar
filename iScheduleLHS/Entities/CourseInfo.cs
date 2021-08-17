using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace iScheduleLHS.Entities
{
    public partial class CourseInfo
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Title { get; set; }
        
        [Required]
        [StringLength(50)]
        public string Room { get; set; }
        
        [StringLength(200)]
        public string Blocks { get; set; }
        
        public int? UserId { get; set; }
    }
}
