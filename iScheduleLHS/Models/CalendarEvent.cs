using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iScheduleLHS.Models
{
    //copy from the download solution to simplify
    public class CalendarEvent
    {
        public string title { get; set; } //title -> course name (Block ID)
        public string id { get; set; } //id? -> room
        public string start { get; set; } //start datetime
        public string end { get; set; } //end datetime
        public bool? allDay { get; set; } //true for "Day #", false for others
    }
}
