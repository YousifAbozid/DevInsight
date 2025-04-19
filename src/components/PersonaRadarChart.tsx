import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface PersonaRadarChartProps {
  strengths: {
    languageDiversity: number;
    contributionConsistency: number;
    collaboration: number;
    projectPopularity: number;
    codeQuality: number;
    communityImpact: number;
  };
  color: string;
}

// Define proper types for chart options
type RadarChartOptions = ChartOptions<'radar'> & {
  scales: {
    r: {
      angleLines: { color: string };
      grid: { color: string };
      pointLabels: {
        color: string;
        font: { size: number; family: string };
      };
      ticks: {
        backdropColor: string;
        color: string;
        stepSize: number;
        font: { size: number };
        showLabelBackdrop: boolean;
      };
      suggestedMin: number;
      suggestedMax: number;
    };
  };
};

export default function PersonaRadarChart({
  strengths,
  color,
}: PersonaRadarChartProps) {
  // Prepare nice labels for the strengths
  const labels = {
    languageDiversity: 'Language Diversity',
    contributionConsistency: 'Contribution Consistency',
    collaboration: 'Collaboration',
    projectPopularity: 'Project Popularity',
    codeQuality: 'Code Quality',
    communityImpact: 'Community Impact',
  };

  // Use app's primary accent color if none provided
  const chartColor = color || '#3b82f6'; // Default to accent-1 color

  // Create data for the radar chart
  const data = {
    labels: Object.values(labels),
    datasets: [
      {
        label: 'Your Developer Profile',
        data: Object.keys(strengths).map(key =>
          Math.round(strengths[key as keyof typeof strengths])
        ),
        backgroundColor: `${chartColor}33`, // Add transparency
        borderColor: chartColor,
        borderWidth: 2,
        pointBackgroundColor: chartColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: chartColor,
        pointHoverBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  // Chart options with proper typing
  const options: RadarChartOptions = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(150, 150, 150, 0.2)', // Subtle angle lines
        },
        grid: {
          color: 'rgba(150, 150, 150, 0.2)', // Subtle grid lines
        },
        pointLabels: {
          color:
            getComputedStyle(document.documentElement).getPropertyValue(
              '--color-l-text-1'
            ) || '#111827',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
        ticks: {
          backdropColor: 'transparent', // Remove tick backdrop
          color:
            getComputedStyle(document.documentElement).getPropertyValue(
              '--color-l-text-3'
            ) || '#6b7280',
          stepSize: 20,
          font: {
            size: 10,
          },
          showLabelBackdrop: false, // Remove tick label backdrop
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend as we don't need it for single dataset
      },
      tooltip: {
        backgroundColor: '#ffffff', // Light background for visibility
        titleColor: '#111827', // Dark text for contrast
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: (items: TooltipItem<'radar'>[]) => {
            return items[0].label;
          },
          label: (context: TooltipItem<'radar'>) => {
            return `Score: ${context.raw}/100`;
          },
        },
        // Fix tooltip text visibility
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
      },
    },
    maintainAspectRatio: true,
    responsive: true,
    elements: {
      line: {
        tension: 0.2, // Slight curve for the lines
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[280px] flex items-center justify-center">
      <Radar data={data} options={options} />
    </div>
  );
}
