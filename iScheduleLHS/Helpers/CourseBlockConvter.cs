using iScheduleLHS.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using System.IO;
using iScheduleLHS.Entities;
using System.Linq;

namespace iScheduleLHS.Helpers
{
    public class CourseBlockConvter
    {
        private Dictionary<string, CourseInfo> dictBlock2CourseInfo = null;

        //TODO - per student block2course dictionary
        public CourseBlockConvter(IQueryable<CourseInfo> dbSetMyCourses)
        {
            var count = dbSetMyCourses.Count();

            if (count > 0)
            {
                //populate the dictionary
                dictBlock2CourseInfo = new Dictionary<string, CourseInfo>();

                //all my courses
                List<CourseInfo> courseInfoList = dbSetMyCourses.ToList();

                foreach (CourseInfo courseInfo in courseInfoList)
                {
                    if (!string.IsNullOrEmpty(courseInfo.Blocks))
                    {
                        string[] strBlocks = courseInfo.Blocks.Split(",");
                        foreach (string strBlock in strBlocks)
                        {
                            if (!string.IsNullOrEmpty(strBlock))
                                dictBlock2CourseInfo.TryAdd(strBlock, courseInfo);
                        }
                    }
                }
            }
        }

        //are we ready for lookup
        public bool IsCourseInfoDictionaryReady()
        {
            return dictBlock2CourseInfo != null;
        }

        //come in here for a block's course info
        public bool LookupOneBlock(string strBlock, out CourseInfo courseInfo)
        {
            return dictBlock2CourseInfo.TryGetValue(strBlock, out courseInfo);
        }

    }
}
