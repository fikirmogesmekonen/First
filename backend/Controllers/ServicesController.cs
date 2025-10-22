using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ZoSaleBackend.Models;
using ZoSaleBackend.Services;

namespace ZoSaleBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ServicesController : ControllerBase
    {
        private readonly IServiceService _serviceService;

        public ServicesController(IServiceService serviceService)
        {
            _serviceService = serviceService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ServiceRecord>>> GetAllServices()
        {
            var services = await _serviceService.GetAllServicesAsync();
            return Ok(services);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceRecord>> GetServiceById(string id)
        {
            var service = await _serviceService.GetServiceByIdAsync(id);
            if (service == null)
                return NotFound();

            return Ok(service);
        }

        [HttpPost]
        public async Task<ActionResult<ServiceRecord>> CreateService([FromBody] CreateServiceRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var service = await _serviceService.CreateServiceAsync(request);
            return CreatedAtAction(nameof(GetServiceById), new { id = service.Id }, service);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ServiceRecord>> UpdateService(string id, [FromBody] CreateServiceRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var service = await _serviceService.UpdateServiceAsync(id, request);
            if (service == null)
                return NotFound();

            return Ok(service);
        }

        [HttpPatch("{id}/enable")]
        public async Task<IActionResult> EnableService(string id)
        {
            var result = await _serviceService.EnableServiceAsync(id);
            if (!result)
                return NotFound();

            return Ok(new { message = "Service enabled successfully" });
        }

        [HttpPatch("{id}/disable")]
        public async Task<IActionResult> DisableService(string id)
        {
            var result = await _serviceService.DisableServiceAsync(id);
            if (!result)
                return NotFound();

            return Ok(new { message = "Service disabled successfully" });
        }

        [HttpPost("filter")]
        public async Task<ActionResult<List<ServiceRecord>>> FilterServices([FromBody] FilterRequest filter)
        {
            var services = await _serviceService.FilterServicesAsync(filter);
            return Ok(services);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteService(string id)
        {
            var result = await _serviceService.DeleteServiceAsync(id);
            if (!result)
                return NotFound();

            return Ok(new { message = "Service deleted successfully" });
        }
    }
}
