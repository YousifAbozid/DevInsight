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
