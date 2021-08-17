using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using iScheduleLHS.Models;
using iScheduleLHS.Entities;

namespace iScheduleLHS.Helpers
{
    public class BlockExcludeFilter
    {
        //LHS 6 days program
        const int schoolProgramDays = 6;

        //my lunch choice each day [0 based]
        string [] lunchSelectedEachDay = null;

        //conatin calendar date as key to look up school day [1 based]
        private Dictionary<string, int> dictCalendarDateToSchoolDay = null;

        public BlockExcludeFilter(IQueryable<LunchSchedule> dbSetMyLunches, Dictionary<string, int> dictDateToSchoolDay)
        {
            //expect only one
            if (dbSetMyLunches.Count() == 1)
            {
                LunchSchedule lunchSchedule = dbSetMyLunches.FirstOrDefault();

                if (!string.IsNullOrEmpty(lunchSchedule.Schedules))
                {
                    lunchSelectedEachDay = lunchSchedule.Schedules.Split(",");

                    //LHS 6 days program
                    if(lunchSelectedEachDay.Length == schoolProgramDays)
                    {
                        //if no schedule - no need the disctionary
                        dictCalendarDateToSchoolDay = dictDateToSchoolDay;
                    }
                }
            }
        }

        public bool ShouldBeExcluded(UpdatedBlockItem updatedBlockItem)
        {
            bool bToBeFiltered = false;

            if (dictCalendarDateToSchoolDay == null || !updatedBlockItem.id.StartsWith("Lunch"))
                return bToBeFiltered;

            //must be Lunch** now
            //is this my lunch for that day - if no, filter
            int iWhichDay = -1;
            if (dictCalendarDateToSchoolDay.TryGetValue(updatedBlockItem.start.Substring(0, 10), out iWhichDay) && iWhichDay > 0)
            {
                //1 based to 0 based
                if (lunchSelectedEachDay[iWhichDay - 1] != updatedBlockItem.id)
                {
                    bToBeFiltered = true;
                }
            }

            return bToBeFiltered;
        }
    }
}
