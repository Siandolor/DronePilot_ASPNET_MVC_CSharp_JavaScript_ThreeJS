// ============================================================================
// PROGRAM ENTRY POINT
// ============================================================================
// Initializes and configures the DronePilot web application.
// Responsible for setting up middleware, routing, and global services.
// ============================================================================

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------------------------------
// SERVICES CONFIGURATION
// --------------------------------------------------------------------------
// Registers MVC controllers with views for standard MVC routing.
// --------------------------------------------------------------------------
builder.Services.AddControllersWithViews();

// --------------------------------------------------------------------------
// BUILD APPLICATION
// --------------------------------------------------------------------------
var app = builder.Build();

// --------------------------------------------------------------------------
// ERROR HANDLING & SECURITY (PRODUCTION ONLY)
// --------------------------------------------------------------------------
// Uses centralized error handling and HSTS in non-development environments.
// --------------------------------------------------------------------------
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

// --------------------------------------------------------------------------
// MIDDLEWARE PIPELINE
// --------------------------------------------------------------------------
// Enforces HTTPS and configures routing for controllers and static assets.
// --------------------------------------------------------------------------
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

// --------------------------------------------------------------------------
// STATIC ASSET MAPPING
// --------------------------------------------------------------------------
// Enables serving of static content (JS, CSS, images, etc.).
// --------------------------------------------------------------------------
app.MapStaticAssets();

// --------------------------------------------------------------------------
// DEFAULT ROUTE CONFIGURATION
// --------------------------------------------------------------------------
// Defines default route pattern for controllers and actions.
// --------------------------------------------------------------------------
app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

// --------------------------------------------------------------------------
// APPLICATION RUN
// --------------------------------------------------------------------------
// Starts the web server and begins handling incoming requests.
// --------------------------------------------------------------------------
app.Run();
