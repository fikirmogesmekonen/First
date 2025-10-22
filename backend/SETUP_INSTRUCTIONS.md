# ZoSale Services Dashboard - ASP.NET Backend Setup

## Prerequisites
- .NET 8.0 SDK or later
- SQL Server (LocalDB or full version)
- Node.js 18+ (for frontend)

## Backend Setup

### 1. Create ASP.NET Core Project
\`\`\`bash
dotnet new webapi -n ZoSaleBackend
cd ZoSaleBackend
\`\`\`

### 2. Add Required NuGet Packages
\`\`\`bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
dotnet add package Microsoft.EntityFrameworkCore.Tools
\`\`\`

### 3. Copy Project Files
Copy all the C# files from the backend folder into your project:
- Models/ServiceRecord.cs
- Models/CreateServiceRequest.cs
- Models/FilterRequest.cs
- Data/ApplicationDbContext.cs
- Services/ServiceService.cs
- Controllers/ServicesController.cs
- Program.cs
- appsettings.json
- appsettings.Development.json

### 4. Create Database Migrations
\`\`\`bash
dotnet ef migrations add InitialCreate
dotnet ef database update
\`\`\`

### 5. Run the Backend
\`\`\`bash
dotnet run
\`\`\`

The API will be available at: `https://localhost:7001`

## Frontend Setup

### 1. Set Environment Variable
Add to your `.env.local` file:
\`\`\`
NEXT_PUBLIC_API_URL=https://localhost:7001/api
\`\`\`

Or for production:
\`\`\`
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Run Frontend
\`\`\`bash
npm run dev
\`\`\`

## API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/{id}` - Get service by ID
- `POST /api/services` - Create new service
- `PUT /api/services/{id}` - Update service
- `PATCH /api/services/{id}/enable` - Enable service
- `PATCH /api/services/{id}/disable` - Disable service
- `POST /api/services/filter` - Filter services
- `DELETE /api/services/{id}` - Delete service

## Database Connection String

Update `appsettings.json` if using a different SQL Server:

\`\`\`json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER;Database=ZoSaleDb;Trusted_Connection=true;"
}
\`\`\`

## Troubleshooting

### CORS Issues
If you get CORS errors, ensure the backend is running and the API URL in `.env.local` is correct.

### Database Connection
Ensure SQL Server is running and the connection string is valid.

### Port Conflicts
If port 7001 is in use, change it in `launchSettings.json`:
\`\`\`json
"https": {
  "commandName": "Project",
  "dotnetRunMessages": true,
  "launchBrowser": false,
  "applicationUrl": "https://localhost:YOUR_PORT;http://localhost:YOUR_PORT_HTTP",
  ...
}
\`\`\`

## Production Deployment

### Backend (Azure, AWS, or your hosting provider)
1. Build: `dotnet publish -c Release`
2. Deploy the published files
3. Update connection string for production database
4. Update CORS policy for production domain

### Frontend (Vercel, Netlify, etc.)
1. Set `NEXT_PUBLIC_API_URL` to your production API URL
2. Deploy using your preferred platform
