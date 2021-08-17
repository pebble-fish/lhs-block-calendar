using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.IO;
using System.Text.Json;
using iScheduleLHS.Entities;

namespace iScheduleLHS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CourseInfosController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DataContext _context;
        private readonly ILogger<CourseInfosController> _logger;

        private List<string> _totalBlockOptionSet = null;

        public CourseInfosController(IConfiguration configuration, DataContext context, ILogger<CourseInfosController> logger)
        {
            _configuration = configuration;
            _context = context;
            _logger = logger;

            PopulateTotalBlockOptions();
        }

        private void PopulateTotalBlockOptions()
        {
            if (_totalBlockOptionSet != null)
                return;

            string strUniqueBlocksInFile = string.Empty;
            string strUniqueBlocksFile = _configuration["iScheduleAssets:UniqueBlockList"];
            using (StreamReader srUniqueBlocksFile = new StreamReader(strUniqueBlocksFile))
            {
                //Read all contents from a file
                strUniqueBlocksInFile = srUniqueBlocksFile.ReadToEnd();
            }

            _totalBlockOptionSet = JsonSerializer.Deserialize<List<string>>(strUniqueBlocksInFile);
        }

        // GET: api/<CourseInfos>
        // GET: api/<CourseInfos>/?pageIndex=0&pageSize=10
        // GET: api/<CourseInfos>/?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc
        // GET: api/<CourseInfos>/?pageIndex=0&pageSize=10&sortColumn=name&sortOrder=asc&filterColumn=name&filterQuery=science
        [HttpGet]
        public async Task<ActionResult<ApiResult<CourseInfo>>> GetCourseInfos(
                int pageIndex = 0,
                int pageSize = 10,
                string sortColumn = null,
                string sortOrder = null,
                string filterColumn = null,
                string filterQuery = null)
        {
            return await ApiResult<CourseInfo>.CreateAsync(
                    int.Parse(this.User.Identity.Name),
                    _context.CourseInfos,
                    pageIndex,
                    pageSize,
                    sortColumn,
                    sortOrder,
                    filterColumn,
                    filterQuery);

        }


        // GET api/<CourseInfos>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CourseInfo>> GetCourseInfo(int id)
        {
            var courseInfo = await _context.CourseInfos.FindAsync(id);

            //not found or not owned by the user
            if (courseInfo == null || courseInfo.UserId != int.Parse(this.User.Identity.Name))
            {
                return NotFound();
            }
            return courseInfo;
        }

        // PUT api/<CourseInfos>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCourseInfo(int id, CourseInfo courseInfo)
        {
            //not consistent request or not owned by the user
            if (id != courseInfo.Id || courseInfo.UserId != int.Parse(this.User.Identity.Name))
            {
                return BadRequest();
            }
            _context.Entry(courseInfo).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CourseInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // POST api/<CourseInfos>
        [HttpPost]
        public async Task<ActionResult<CourseInfo>> PostCourseInfo(CourseInfo courseInfo)
        {
            //set UserId
            courseInfo.UserId = int.Parse(this.User.Identity.Name);

            _context.CourseInfos.Add(courseInfo);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetCourseInfo", new { id = courseInfo.Id },
             courseInfo);
        }

        // DELETE api/<CourseInfos>/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<CourseInfo>> DeleteCourseInfo(int id)
        {
            var courseInfo = await _context.CourseInfos.FindAsync(id);

            //not found or not owned by the user
            if (courseInfo == null || courseInfo.UserId != int.Parse(this.User.Identity.Name))
            {
                return NotFound();
            }
            _context.CourseInfos.Remove(courseInfo);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool CourseInfoExists(int id)
        {
            //owned by the user
            return _context.CourseInfos.Any(e => e.Id == id && e.UserId == int.Parse(this.User.Identity.Name));
        }

        [HttpPost]
        [Route("isDupeCourse")]
        public bool isDupeCourse(CourseInfo courseInfo)
        {
            bool bDupeBlock = false;
            //get all courses owned by this user
            foreach (var existingCourseInfo in _context.CourseInfos.Where(c => c.UserId == int.Parse(this.User.Identity.Name))) 
            {
                //for each course - get blocks
                if (existingCourseInfo.Title == courseInfo.Title && existingCourseInfo.Room == courseInfo.Room && existingCourseInfo.Id != courseInfo.Id)
                {
                    bDupeBlock = true;
                    break;
                }
            }

            return bDupeBlock;
        }

        // GET api/<CourseInfos>/validoptions/5
        [HttpGet("validoptions/{id}")]
        //public List<string> GetValidBlockOption(int courseId)
        public List<string> GetValidBlockOption(string id)
        {
            int courseId = 0;
            int.TryParse(id, out courseId);

            //all blocks mapped for this user
            List<string> courseBlocksUsed = new List<string>();

            //get all courses owned by this user
            foreach (var existingCourseInfo in _context.CourseInfos.Where(c => c.UserId == int.Parse(this.User.Identity.Name) && c.Id != courseId))
            {
                if (!string.IsNullOrEmpty(existingCourseInfo.Blocks))
                {
                    courseBlocksUsed.Add(existingCourseInfo.Blocks);
                }
            }

            //_totalBlockOptionSet
            List<string> blocksNotInUse = new List<string>();

            foreach (string block in _totalBlockOptionSet)
            {
                bool bFound = false;
                foreach (string usedBlocks in courseBlocksUsed)
                {
                    if (usedBlocks.Contains(block))
                    {
                        bFound = true;
                        break;
                    }
                }
                if (!bFound)
                {
                    blocksNotInUse.Add(block);
                }
            }

            return blocksNotInUse;
        }
    }
}
