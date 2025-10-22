using System;
using System.ComponentModel.DataAnnotations;

namespace ZoSaleBackend.Models
{
    public class ServiceRecord
    {
        [Key]
        public string Id { get; set; } = string.Empty;

        [Required]
        public string RefNo { get; set; } = string.Empty;

        [Required]
        public string Employee { get; set; } = string.Empty;

        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        public string PackageName { get; set; } = string.Empty;

        [Required]
        public string SerNumber { get; set; } = string.Empty;

        [Required]
        public string Vendor { get; set; } = string.Empty;

        [Required]
        public string Status { get; set; } = "Active";

        [Required]
        public string Expires { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
