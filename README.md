# Muscat Bay Utility Management Dashboard

A comprehensive dashboard system for managing utilities at Muscat Bay, including water analysis, electrical consumption tracking, STP (Sewage Treatment Plant) monitoring, and contract management.

## Features

- **Dashboard Overview:** Central hub with key metrics and visualizations from all utility modules
- **Water Analysis Module:** Monitor water quality parameters and trends (existing module)
- **Electrical Analysis Module:** Track electrical consumption across facilities
- **STP Monitoring Module:** Monitor sewage treatment plant performance and recycled water usage
- **Contract Tracker Module:** Manage service provider contracts and track renewals

## Tech Stack

- **Framework:** Next.js 13+ with App Router
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Charts & Visualizations:** Recharts
- **State Management:** React Hooks

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ARahim900/mb-wateranalysis.git
cd mb-wateranalysis
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the dashboard.

## Project Structure

```
mb-wateranalysis/
├── app/                    # Next.js app directory
│   ├── page.jsx            # Main dashboard
│   ├── water/              # Water analysis module (existing)
│   ├── electrical-analysis/ # Electrical consumption tracking
│   ├── stp-monitoring/     # STP plant monitoring
│   └── contract-tracker/   # Contract management
├── components/             # Shared UI components
├── public/                 # Static assets and CSV data files
└── README.md               # Documentation
```

## Module Navigation

The dashboard is structured with a central hub (main dashboard) that provides access to all four modules:

1. **Water Analysis:** Click on the Water Analysis card to access the existing water module
2. **Electrical Analysis:** Track and visualize electrical consumption data
3. **STP Monitoring:** Monitor sewage treatment plant operations and recycled water usage
4. **Contract Tracker:** Manage service provider contracts and track renewals

Each module has its own specialized dashboard with relevant metrics, visualizations, and management tools.

## Data Integration

The dashboard is designed to work with CSV data sources:

- **Water Analysis:** Uses water quality data from the existing module
- **Electrical Analysis:** Connects to `Electrical Consumptions 2024.csv`
- **STP Monitoring:** Connects to `2024 STP Master Database Daily Operation Maintenance.csv`
- **Contract Tracker:** Connects to `Contract Tracker 2.csv`

To use your own data, place CSV files in the public directory and update the data loading functions in each module.

## Customization

The dashboard is built with customization in mind:

- **Colors & Styling:** Edit Tailwind classes or create custom themes
- **Charts & Visualizations:** Modify Recharts components to display your preferred metrics
- **Data Sources:** Connect to your own CSV files or API endpoints
- **UI Components:** Add or remove components based on your specific requirements

## Making Changes

The codebase follows a consistent structure:

1. The main dashboard (`app/page.jsx`) serves as the central hub
2. Each module has its own directory under `app/`
3. All pages use the same UI component library and styling approach
4. Charts and visualizations use Recharts with a consistent color scheme

To modify or extend the dashboard:

1. Make changes to the relevant module in its directory
2. Test the changes using the development server
3. Update the main dashboard if you've added new metrics or features
4. Deploy the updated application

## License

This project is proprietary and for the exclusive use of Muscat Bay.

## Contact

For support or questions, contact the development team.
