using System;
using System.Collections.Generic;
using System.Text;

namespace iScheduleLHS.Models
{
    public class UpdatedBlockItem
    {
        public string id { get; set; } //id?
        public string start { get; set; } //start datetime or date
        public string end { get; set; } //end datetime or date
        public bool? allDay { get; set; } //true for "Day #", false for others
    }
}
