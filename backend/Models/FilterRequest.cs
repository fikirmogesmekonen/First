using System.Collections.Generic;

namespace ZoSaleBackend.Models
{
    public class FilterRequest
    {
        public List<string> Employee { get; set; } = new();
        public List<string> Type { get; set; } = new();
        public List<string> Vendor { get; set; } = new();
        public List<string> Status { get; set; } = new();
        public List<string> PackageName { get; set; } = new();
        public string SerNumber { get; set; } = string.Empty;
        public string RefNo { get; set; } = string.Empty;
        public string DateFrom { get; set; } = string.Empty;
        public string DateTo { get; set; } = string.Empty;
        public string SearchQuery { get; set; } = string.Empty;
    }
}
