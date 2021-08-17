using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using iScheduleLHS.Entities;
using Microsoft.Extensions.Logging;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace iScheduleLHS.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LunchScheduleController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly ILogger<LunchScheduleController> _logger;

        public LunchScheduleController(DataContext context, ILogger<LunchScheduleController> logger)
        {
            _context = context;
            _logger = logger;
        }

        //get lunch schedule by owner
        // GET: api/<LunchSchedule>
        [HttpGet]
        public async Task<ActionResult<LunchSchedule>> GetLunchSchedule()
        {
            return await _context.LunchSchedules.Where(c => c.UserId == int.Parse(this.User.Identity.Name)).FirstOrDefaultAsync();
        }

        //get lunch schedule by lunchschedule's id
        // GET api/<LunchSchedule>/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LunchSchedule>> GetLunchSchedule(int id)
        {
            var lunchSchedule = await _context.LunchSchedules.FindAsync(id);

            //not found or not the lunch for the user
            if (lunchSchedule == null || lunchSchedule.UserId != int.Parse(this.User.Identity.Name))
            {
                return NotFound();
            }

            return lunchSchedule;
        }

        // PUT api/<LunchSchedule>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLunchSchedule(int id, LunchSchedule lunchSchedule)
        {
            //not consistent request or not owned by the user
            if (id != lunchSchedule.Id || lunchSchedule.UserId != int.Parse(this.User.Identity.Name))
            {
                return BadRequest();
            }
            _context.Entry(lunchSchedule).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LunchScheduleExists(id))
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

        // POST api/<LunchSchedule>
        [HttpPost]
        public async Task<ActionResult<LunchSchedule>> PostLunchSchedule(LunchSchedule lunchSchedule)
        {
            //set UserId
            lunchSchedule.UserId = int.Parse(this.User.Identity.Name);

            _context.LunchSchedules.Add(lunchSchedule);
            await _context.SaveChangesAsync();
            return CreatedAtAction("GetLunchSchedule", new { id = lunchSchedule.Id },
             lunchSchedule);
        }

        private bool LunchScheduleExists(int id)
        {
            return _context.LunchSchedules.Any(e => e.Id == id && e.UserId == int.Parse(this.User.Identity.Name));
        }
    }
}
