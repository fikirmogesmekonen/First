using Microsoft.EntityFrameworkCore;
using ZoSaleBackend.Models;

namespace ZoSaleBackend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<ServiceRecord> Services { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial data
            modelBuilder.Entity<ServiceRecord>().HasData(
                new ServiceRecord
                {
                    Id = "SER-001",
                    RefNo = "#ref2024",
                    Employee = "Aman Buze",
                    Type = "Packages",
                    PackageName = "Unlimited Voice",
                    SerNumber = "+251980808080",
                    Vendor = "ETHIO_TELE",
                    Status = "Active",
                    Expires = "02/10/2026"
                },
                new ServiceRecord
                {
                    Id = "SER-002",
                    RefNo = "#ref2024",
                    Employee = "Aman Buze",
                    Type = "Packages",
                    PackageName = "Unlimited Voice",
                    SerNumber = "+251980808080",
                    Vendor = "ETHIO_TELE",
                    Status = "Exp_soon",
                    Expires = "02/10/2026"
                },
                new ServiceRecord
                {
                    Id = "SER-003",
                    RefNo = "#ref2024",
                    Employee = "Aman Buze",
                    Type = "Packages",
                    PackageName = "Unlimited Voice",
                    SerNumber = "+251980808080",
                    Vendor = "ETHIO_TELE",
                    Status = "Expired",
                    Expires = "02/10/2026"
                }
            );
        }
    }
}
