using Microsoft.AspNetCore.Mvc;

namespace DronePilot.Controllers
{
    // =========================================================================
    // CONTROLLER: HomeController
    // =========================================================================
    // Handles routing for the main application entry point.
    // =========================================================================
    public class HomeController : Controller
    {
        // ---------------------------------------------------------------------
        // Logger
        // ---------------------------------------------------------------------
        // Used for diagnostic output and runtime event tracking.
        // ---------------------------------------------------------------------
        private readonly ILogger<HomeController> _logger;

        // ---------------------------------------------------------------------
        // Constructor
        // ---------------------------------------------------------------------
        // Injects the logger instance via dependency injection.
        // ---------------------------------------------------------------------
        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        // ---------------------------------------------------------------------
        // ACTION: Index
        // ---------------------------------------------------------------------
        // Default endpoint: returns the main view of the application.
        // ---------------------------------------------------------------------
        public IActionResult Index()
        {
            return View();
        }
    }
}
