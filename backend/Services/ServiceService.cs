using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZoSaleBackend.Data;
using ZoSaleBackend.Models;

namespace ZoSaleBackend.Services
{
    public interface IServiceService
    {
        Task<List<ServiceRecord>> GetAllServicesAsync();
        Task<ServiceRecord?> GetServiceByIdAsync(string id);
        Task<ServiceRecord> CreateServiceAsync(CreateServiceRequest request);
        Task<ServiceRecord?> UpdateServiceAsync(string id, CreateServiceRequest request);
        Task<bool> EnableServiceAsync(string id);
        Task<bool> DisableServiceAsync(string id);
        Task<List<ServiceRecord>> FilterServicesAsync(FilterRequest filter);
        Task<bool> DeleteServiceAsync(string id);
    }

    public class ServiceService : IServiceService
    {
        private readonly ApplicationDbContext _context;

        public ServiceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<ServiceRecord>> GetAllServicesAsync()
        {
            return await _context.Services.OrderByDescending(s => s.CreatedAt).ToListAsync();
        }

        public async Task<ServiceRecord?> GetServiceByIdAsync(string id)
        {
            return await _context.Services.FindAsync(id);
        }

        public async Task<ServiceRecord> CreateServiceAsync(CreateServiceRequest request)
        {
            var serviceId = $"SER-{DateTime.UtcNow.Ticks}";
            var service = new ServiceRecord
            {
                Id = serviceId,
                RefNo = request.RefNo,
                Employee = request.Employee,
                Type = request.Type,
                PackageName = request.PackageName,
                SerNumber = request.SerNumber,
                Vendor = request.Vendor,
                Status = "Active",
                Expires = request.Expires,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<ServiceRecord?> UpdateServiceAsync(string id, CreateServiceRequest request)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return null;

            service.RefNo = request.RefNo;
            service.Employee = request.Employee;
            service.Type = request.Type;
            service.PackageName = request.PackageName;
            service.SerNumber = request.SerNumber;
            service.Vendor = request.Vendor;
            service.Status = request.Status;
            service.Expires = request.Expires;
            service.UpdatedAt = DateTime.UtcNow;

            _context.Services.Update(service);
            await _context.SaveChangesAsync();
            return service;
        }

        public async Task<bool> EnableServiceAsync(string id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return false;

            service.Status = "Active";
            service.UpdatedAt = DateTime.UtcNow;
            _context.Services.Update(service);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DisableServiceAsync(string id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return false;

            service.Status = "Expired";
            service.UpdatedAt = DateTime.UtcNow;
            _context.Services.Update(service);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<ServiceRecord>> FilterServicesAsync(FilterRequest filter)
        {
            var query = _context.Services.AsQueryable();

            // Search query
            if (!string.IsNullOrEmpty(filter.SearchQuery))
            {
                var searchLower = filter.SearchQuery.ToLower();
                query = query.Where(s =>
                    s.Id.ToLower().Contains(searchLower) ||
                    s.Employee.ToLower().Contains(searchLower) ||
                    s.PackageName.ToLower().Contains(searchLower) ||
                    s.Vendor.ToLower().Contains(searchLower) ||
                    s.SerNumber.ToLower().Contains(searchLower) ||
                    s.RefNo.ToLower().Contains(searchLower)
                );
            }

            // Filter by employee
            if (filter.Employee.Count > 0)
            {
                query = query.Where(s => filter.Employee.Contains(s.Employee));
            }

            // Filter by type
            if (filter.Type.Count > 0)
            {
                query = query.Where(s => filter.Type.Contains(s.Type));
            }

            // Filter by vendor
            if (filter.Vendor.Count > 0)
            {
                query = query.Where(s => filter.Vendor.Contains(s.Vendor));
            }

            // Filter by status
            if (filter.Status.Count > 0)
            {
                query = query.Where(s => filter.Status.Contains(s.Status));
            }

            // Filter by package name
            if (filter.PackageName.Count > 0)
            {
                query = query.Where(s => filter.PackageName.Contains(s.PackageName));
            }

            // Filter by service number
            if (!string.IsNullOrEmpty(filter.SerNumber))
            {
                query = query.Where(s => s.SerNumber.ToLower().Contains(filter.SerNumber.ToLower()));
            }

            // Filter by reference number
            if (!string.IsNullOrEmpty(filter.RefNo))
            {
                query = query.Where(s => s.RefNo.ToLower().Contains(filter.RefNo.ToLower()));
            }

            // Filter by date range
            if (!string.IsNullOrEmpty(filter.DateFrom) || !string.IsNullOrEmpty(filter.DateTo))
            {
                query = query.Where(s =>
                {
                    var itemDate = ParseDate(s.Expires);
                    if (itemDate == null)
                        return true;

                    if (!string.IsNullOrEmpty(filter.DateFrom))
                    {
                        var fromDate = DateTime.Parse(filter.DateFrom);
                        if (itemDate < fromDate)
                            return false;
                    }

                    if (!string.IsNullOrEmpty(filter.DateTo))
                    {
                        var toDate = DateTime.Parse(filter.DateTo);
                        if (itemDate > toDate)
                            return false;
                    }

                    return true;
                });
            }

            return await query.OrderByDescending(s => s.CreatedAt).ToListAsync();
        }

        public async Task<bool> DeleteServiceAsync(string id)
        {
            var service = await _context.Services.FindAsync(id);
            if (service == null)
                return false;

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();
            return true;
        }

        private DateTime? ParseDate(string dateString)
        {
            try
            {
                if (DateTime.TryParse(dateString, out var date))
                    return date;

                // Try DD/MM/YYYY format
                var parts = dateString.Split('/');
                if (parts.Length == 3 && int.TryParse(parts[0], out var day) &&
                    int.TryParse(parts[1], out var month) && int.TryParse(parts[2], out var year))
                {
                    return new DateTime(year, month, day);
                }

                return null;
            }
            catch
            {
                return null;
            }
        }
    }
}
