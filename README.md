# DevInsight: GitHub Profile Analytics Dashboard

<p align="center">
  <img src="public/favicon.svg" alt="DevInsight Logo" width="200"/>
</p>

DevInsight is a comprehensive visual analytics dashboard for GitHub profiles that empowers developers to gain deeper insights into their coding activities, repository performance, language preferences, and contribution patterns. Whether you're preparing for job interviews, analyzing your development journey, or showcasing your portfolio, DevInsight provides rich, data-driven visualizations to tell your developer story.

## 🔍 Features

- **Profile Analytics**: Comprehensive overview of GitHub profiles with key metrics and statistics
- **Repository Insights**: Detailed analysis of repositories, including stars, forks, and activity metrics
- **Language Distribution**: Visual breakdown of programming languages used across all repositories
- **Contribution Graphs**: Time-series visualizations of commit activity and contribution patterns
- **Star History**: Track repository popularity over time with star history charts
- **Exportable Reports**: Generate and download visual reports for portfolios or presentations
- **Customizable Dashboard**: Arrange and prioritize the metrics that matter most to you
- **Dark/Light Mode**: Seamless theme switching for comfortable viewing in any environment
- **Responsive Design**: Optimized for both desktop and mobile devices

## 🛠️ Technologies Used

DevInsight leverages modern web technologies for optimal performance and user experience:

- **React 19**: For building a reactive and component-based UI
- **TypeScript**: Ensuring type safety and enhanced developer experience
- **Vite**: Fast development and optimized production builds
- **Tailwind CSS v4**: Utility-first styling with seamless dark mode support
- **React Router**: Handling navigation and routing
- **TanStack React Query**: Managing API requests with caching and state synchronization
- **Chart.js & React-Chartjs-2**: Creating dynamic and responsive data visualizations
- **Framer Motion**: Adding smooth animations and transitions
- **Crypto-js**: Secure handling of API keys and sensitive data
- **HTML-to-Image**: Generating shareable graphics from dashboard components

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- npm (v9.0.0 or higher) or [Yarn](https://yarnpkg.com/) (v1.22.0 or higher)
- Git

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/YousifAbozid/DevInsight.git
   cd DevInsight
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with your GitHub API credentials:

   ```
   VITE_GITHUB_API_KEY=your_github_personal_access_token
   ```

   > 💡 **Note**: You can create a GitHub personal access token by following [these instructions](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and visit http://localhost:5173

### Available Scripts

- **`npm run dev`**: Start the development server
- **`npm run build`**: Type-check and build the app for production
- **`npm run preview`**: Preview the production build locally
- **`npm run lint`**: Check for code issues using ESLint
- **`npm run lint:fix`**: Automatically fix ESLint issues
- **`npm run format`**: Format all files with Prettier
- **`npm run format:check`**: Check if files are properly formatted
- **`npm run fix-all`**: Run both lint:fix and format to fix all issues
- **`npm run type-check`**: Run TypeScript type checking
- **`npm run upgrade`**: Update all dependencies to their latest versions

## 📁 Project Structure

```
DevInsight/
├── src/
│   ├── api/                  # API integration with GitHub
│   │   ├── endpoints.ts      # API endpoint definitions
│   │   ├── githubApi.ts      # GitHub API client
│   │   └── types.ts          # TypeScript interfaces for API data
│   ├── components/           # Reusable UI components
│   │   ├── charts/           # Data visualization components
│   │   ├── dashboard/        # Dashboard layout components
│   │   ├── common/           # Common UI elements
│   │   └── profile/          # Profile-related components
│   ├── context/              # React context providers
│   │   ├── ThemeContext.tsx  # Dark/light mode theme management
│   │   └── UserContext.tsx   # User authentication state
│   ├── hooks/                # Custom React hooks
│   │   ├── useGithubData.ts  # Hook for fetching GitHub data
│   │   └── useLocalStorage.ts # Local storage interaction hook
│   ├── pages/                # Application pages
│   │   ├── Dashboard.tsx     # Main dashboard view
│   │   ├── Profile.tsx       # Profile view
│   │   └── Repositories.tsx  # Repositories listing and analytics
│   ├── services/             # Business logic services
│   │   └── dataTransformers.ts # Transform API data for visualization
│   ├── styles/               # Global styles and theme variables
│   │   └── globals.css       # Global CSS including Tailwind directives
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts     # Data formatting utilities
│   │   └── constants.ts      # Application constants
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── vite-env.d.ts         # Vite type declarations
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
├── eslint.config.js          # ESLint configuration
└── tailwind.config.js        # Tailwind CSS configuration
```

## 🧩 Core Components

### Dashboard

The dashboard is the central hub of DevInsight, displaying an overview of the analyzed GitHub profile with key metrics and visualizations:

```jsx
<Dashboard username={username} />
```

Props:

- `username`: GitHub username to analyze

### Profile Analytics

Displays comprehensive analytics about a GitHub user's profile:

```jsx
<ProfileAnalytics userData={userData} />
```

Props:

- `userData`: Object containing GitHub user data

### Repository Explorer

Provides detailed analysis of repositories with filtering and sorting capabilities:

```jsx
<RepositoryExplorer repositories={repositories} />
```

Props:

- `repositories`: Array of repository objects

### Language Distribution Chart

Visualizes programming language distribution across repositories:

```jsx
<LanguageChart data={languageData} />
```

Props:

- `data`: Object mapping languages to usage percentages

### Contribution Timeline

Shows a timeline of GitHub contributions with activity heatmap:

```jsx
<ContributionTimeline contributions={contributionData} />
```

Props:

- `contributions`: Array of contribution data objects

## 🎨 Theme System

DevInsight includes a comprehensive theming system with seamless dark and light mode support.

### Color Scheme

The application uses semantic color variables organized in the following categories:

- **Light/Dark Background Colors**: Primary, secondary, tertiary backgrounds
- **Light/Dark Text Colors**: Primary, secondary, tertiary text
- **Accent Colors**: Primary, secondary, success, warning, danger
- **Chart Colors**: Optimized palettes for data visualizations
- **Border Colors**: For consistent component outlines
- **Shadow Colors**: For depth and elevation effects

### Theme Switching

The theme can be toggled using the ThemeToggle component:

```jsx
import { useTheme } from '../context/ThemeContext';

function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </header>
  );
}
```

## 📊 Data Visualization

DevInsight uses Chart.js and React-Chartjs-2 for data visualization. Here are some of the key chart components:

### Activity Chart

Shows commit frequency and activity patterns over time.

### Repository Stars Chart

Tracks star history for repositories to visualize growth in popularity.

### Language Breakdown Chart

Displays the proportion of different programming languages used.

### Contribution Heatmap

Visual representation of contribution frequency with a calendar heatmap.

## 🔐 Authentication & Security

DevInsight uses GitHub's OAuth for authentication and secure API access.

### Authentication Flow

1. User initiates GitHub login
2. User authorizes DevInsight to access their GitHub data
3. GitHub redirects back to DevInsight with an authorization code
4. DevInsight exchanges the code for an access token
5. Access token is securely stored and used for API requests

### Token Storage

GitHub tokens are securely encrypted using crypto-js before being stored in browser storage.

## 📱 Responsive Design

DevInsight is fully responsive and optimized for various screen sizes:

- **Desktop**: Full-featured dashboard with multi-column layout
- **Tablet**: Reorganized layout with preserved functionality
- **Mobile**: Streamlined interface with prioritized information

Responsive behavior is implemented using Tailwind CSS breakpoints and dynamic component rendering.

## ⚡ Performance Optimization

DevInsight employs several optimizations for smooth performance:

- **React Query Caching**: Minimize API calls with intelligent caching
- **Code Splitting**: Load components on-demand for faster initial loading
- **Memoization**: Prevent unnecessary re-renders with React.memo and useMemo
- **Virtualization**: Efficiently render large lists of repositories
- **API Rate Limiting**: Smart handling of GitHub API rate limits

## 🧪 Testing

DevInsight includes comprehensive testing:

- **Unit Tests**: Testing individual components and functions
- **Integration Tests**: Ensuring components work together correctly
- **API Mocks**: Simulated API responses for reliable tests

Run tests with:

```bash
npm run test
# or
yarn test
```

## 🤝 Contributing

Contributions to DevInsight are welcome! Here's how you can contribute:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the project's style guidelines and passes all tests.

### Development Guidelines

- Follow the existing code style
- Write comprehensive comments
- Include appropriate unit tests
- Update documentation as needed

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Yousif Abozid - [@YousifAbozid](https://github.com/YousifAbozid)

Project Link: [https://github.com/YousifAbozid/DevInsight](https://github.com/YousifAbozid/DevInsight)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/YousifAbozid">Yousif Abozid</a>
</p>
