# Route-Optimizer---Capstone-4
A web application that optimizes delivery routes with multiple stops using Google Maps API and Node.js
## Features
-  Multi-destination routing - Plan routes with multiple stops
- Route optimization - Calculate the most efficient path between destinations
- Circular routes - Automatically return to starting point
- Interactive maps - Visualize routes with Google Maps integration
- Step-by-step directions - Detailed turn-by-turn instructions
- Distance and time estimates - Know exactly how long deliveries will take
- Route history - Save and reload previous routes
- Print functionality - Generate printable route sheets
- Route sharing - Share routes via URL
- Responsive design - Works on desktop and mobile devices
- MVC architecture - Clean code organization with separation of concerns

## Technologies Used

- Node.js & Express.js - Backend server framework
- JavaScript (ES Modules) - Modern JavaScript syntax
- Google Maps API - Maps visualization and route calculation
- EJS Templating - Dynamic HTML generation
- CSS3 - Custom styling with responsive design
- LocalStorage - Client-side route history storage
- MVC Architecture - Organized code structure
- Middleware Pattern - Input validation and request processing

## Installation

1. Clone the repository
   git clone https://github.com/anthonyjomarq/Route-Optimizer---Capstone-4.git
   cd Route-Optimizer---Capstone-4

2. Install dependencies
   npm install
3. Create a .env file in the project root and add your Google Maps API key
PORT=3000
NODE_ENV=development
GOOGLE_API_KEY=your_google_api_key_here

4. Start the development server
   npm run dev
5. Open http://localhost:3000 in your browser

## Usage

1. Enter your starting point (defaults to Dynamics Payments in San Juan)
2. Add one or more destinations
3. Click "Calculate Optimal Route" to generate the route
4. View the optimized route on the map with turn-by-turn directions
5. Print or share your route as needed

## License
This project is MIT licensed.

## Author
Anthony Colon

GitHub: @anthonyjomarq
