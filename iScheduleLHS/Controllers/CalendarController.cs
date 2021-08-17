using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using System.IO;
using System.Text.Json;
using iScheduleLHS.Models;
using iScheduleLHS.Helpers;
using iScheduleLHS.Services;
using iScheduleLHS.Entities;
using Microsoft.EntityFrameworkCore;

namespace iScheduleLHS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<CalendarController> _logger;

        //all school blocks
        private List<UpdatedBlockItem> lstYearlyUpdatedBlocks = null;
        //conatin calendar date as key to look up school day 
        private Dictionary<string, int> dictCalendarDateToSchoolDay = null;

        public CalendarController(DataContext context, IConfiguration configuration, ILogger<CalendarController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;

            //for all students
            PopulateYearlyUpdatedBlocks();
            PopulateDate2SchoolDayDictionary();
        }

        //for everyone - so don't filter here
        private void PopulateYearlyUpdatedBlocks()
        {
            if (lstYearlyUpdatedBlocks != null)
                return;

            string strYearlyBlocksInFile = string.Empty;
            string strYearlyEnrichedBlockList = _configuration["iScheduleAssets:YearlyEnrichedBlockList"];
            using (StreamReader srYearlyBlocksFile = new StreamReader(strYearlyEnrichedBlockList))
            {
                //Read all contents from a file
                strYearlyBlocksInFile = srYearlyBlocksFile.ReadToEnd();
            }

            lstYearlyUpdatedBlocks = JsonSerializer.Deserialize<List<UpdatedBlockItem>>(strYearlyBlocksInFile);
        }

        private void PopulateDate2SchoolDayDictionary()
        {
            if (dictCalendarDateToSchoolDay != null)
                return;

            string strDate2SchoolDaysInFile = string.Empty;
            string strDate2SchoolDayFile = _configuration["iScheduleAssets:Date2SchoolDayDictionary"];
            using (StreamReader srDate2SchoolDaysFile = new StreamReader(strDate2SchoolDayFile))
            {
                //Read all contents from a file
                strDate2SchoolDaysInFile = srDate2SchoolDaysFile.ReadToEnd();
            }

            dictCalendarDateToSchoolDay = JsonSerializer.Deserialize<Dictionary<string, int>>(strDate2SchoolDaysInFile);
        }

        //for each student - if any filter per student - should happen here
        private List<CalendarEvent> EnrichSchoolBlocksByUserId(int userId)
        {
            //error handling - in case hacking or unregistered user
            if (userId < 1)
                return new List<CalendarEvent>();

            //course list - filter by the student ID
            IQueryable<CourseInfo> dbSetMyCourses = _context.CourseInfos.Where(c => c.UserId == userId);
            //Block2CourseLookup Utility
            CourseBlockConvter courseBlockConvter = new CourseBlockConvter(dbSetMyCourses);

            //lunch schedule - filter by stuident ID
            IQueryable<LunchSchedule> dbSetMyLunches = _context.LunchSchedules.Where(c => c.UserId == userId);
            //set up filter by user lunch schedule
            BlockExcludeFilter blockExcludeFilter = new BlockExcludeFilter(dbSetMyLunches, dictCalendarDateToSchoolDay);

            //storage for calendar event
            List<CalendarEvent> updatedCourseBlocks = new List<CalendarEvent>(lstYearlyUpdatedBlocks.Capacity);

            foreach (UpdatedBlockItem aItem in lstYearlyUpdatedBlocks)
            {
                //keep 1 lunch per school day or no lunch (Oct 29 as half day); Nov 29 - PT conference
                if (blockExcludeFilter.ShouldBeExcluded(aItem))
                    continue;

                CalendarEvent calendarEvent = new CalendarEvent();

                if (calendarEvent != null)
                {
                    bool bFoundIt = false;

                    //query the dictionary with BlockID
                    CourseInfo courseInfo;
                    if (aItem.id.Length == 2 && courseBlockConvter.IsCourseInfoDictionaryReady())
                    {
                        bFoundIt = courseBlockConvter.LookupOneBlock(aItem.id, out courseInfo);
                        if (bFoundIt)
                        {
                            calendarEvent.title = courseInfo.Title + "(" + aItem.id + ")"; //for debugging purpose
                            calendarEvent.id = courseInfo.Room;
                        }
                    }

                    //lunch, fullday, halfday, PT Conference, etc.
                    if (!bFoundIt)
                    {
                        calendarEvent.title = aItem.id;
                        calendarEvent.id = string.Empty;
                    }

                    //start datetime or date
                    calendarEvent.start = aItem.start;
                    //end datetime or date
                    calendarEvent.end = aItem.end;
                    //all day or not
                    calendarEvent.allDay = aItem.allDay;

                    updatedCourseBlocks.Add(calendarEvent);
                }
            }

            return updatedCourseBlocks;
        }

        // GET api/<CalendarController>
        // GET api/<CalendarController>/5
        [HttpGet]
        public IEnumerable<CalendarEvent> Get()
        {
            int iUserId = 0;
            int.TryParse(this.User.Identity.Name, out iUserId);
            //this should be personalized
            return EnrichSchoolBlocksByUserId(iUserId);
        }
    }
}
