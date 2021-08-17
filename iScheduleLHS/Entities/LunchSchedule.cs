using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace iScheduleLHS.Entities
{
    public partial class LunchSchedule
    {
        [Key]
        [Required]
        public int Id { get; set; }

        [StringLength(100)]
        public string Schedules { get; set; }
        
        public int? UserId { get; set; }
    }
}
