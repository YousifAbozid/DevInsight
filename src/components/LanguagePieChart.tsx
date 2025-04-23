import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { useState } from 'react';
import SectionHeader from './shared/SectionHeader';
import { Icons } from './shared/Icons';
import LanguagePieChartSkeleton from './shared/Skeletons/LanguagePieChartSkeleton';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface LanguagePieChartProps {
  data: LanguageData[];
  loading: boolean;
}

export default function LanguagePieChart({
  data,
  loading,
}: LanguagePieChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Loading and empty states
  if (loading) {
    return <LanguagePieChartSkeleton />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d h-80 flex items-center justify-center">
        <p className="text-l-text-2 dark:text-d-text-2">
          No language data available
        </p>
      </div>
    );
  }

  // Sort data by value for better visualization
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Take top 8 languages and group the rest as "Others" for cleaner visualization
  let chartData = sortedData;
  if (sortedData.length > 8) {
    const topLanguages = sortedData.slice(0, 7);
    const otherLanguages = sortedData.slice(7);

    const othersValue = otherLanguages.reduce(
      (sum, lang) => sum + lang.value,
      0
    );
    const othersPercentage = otherLanguages.reduce(
      (sum, lang) => sum + lang.percentage,
      0
    );

    chartData = [
      ...topLanguages,
      {
        name: 'Others',
        value: othersValue,
        percentage: othersPercentage,
        color: '#6c757d',
      },
    ];
  }

  // Prepare data for Chart.js
  const chartJsData: ChartData<'doughnut'> = {
    labels: chartData.map(lang => lang.name),
    datasets: [
      {
        data: chartData.map(lang => lang.value),
        backgroundColor: chartData.map(lang => lang.color),
        borderColor: chartData.map(() => 'rgba(255, 255, 255, 0.8)'),
        borderWidth: 1.5,
        hoverBackgroundColor: chartData.map(lang => lang.color),
        hoverBorderColor: 'white',
        hoverBorderWidth: 2,
        offset: 4, // Creates spacing between segments
      },
    ],
  };

  // Chart.js options with improved styling
  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Creates doughnut hole
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    layout: {
      padding: 10,
    },
    plugins: {
      legend: {
        display: false, // We'll create our own custom legend
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827', // Dark text for better readability on white
        bodyColor: '#111827',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        callbacks: {
          title: items => {
            return items[0].label;
          },
          label: context => {
            // const label = context.label || '';
            const value = context.raw as number;
            const total = context.dataset.data.reduce(
              (sum, val) => sum + (val as number),
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return [
              `${percentage}% of repositories`,
              `${value} ${value === 1 ? 'repository' : 'repositories'}`,
            ];
          },
        },
      },
    },
    onHover: (_, elements) => {
      const index = elements.length > 0 ? elements[0].index : null;
      setHoveredIndex(index);
    },
  };

  // Total repositories count
  const totalRepos = chartData.reduce((sum, lang) => sum + lang.value, 0);

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d">
      <SectionHeader
        title="Language Distribution"
        icon={Icons.Languages}
        subtitle={`Analysis across ${totalRepos} repositories`}
        infoTooltip="This chart shows the programming languages used across your repositories, helping you visualize your technical expertise and project diversity."
      />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2 h-64 md:h-80">
          <Doughnut data={chartJsData} options={options} />
        </div>

        <div className="md:w-1/2">
          <h3 className="text-lg font-medium text-l-text-1 dark:text-d-text-1 mb-3">
            Languages
          </h3>
          <div className="space-y-3 max-h-64 md:max-h-72 overflow-y-auto scrollbar-hide pr-2">
            {chartData.map((lang, index) => (
              <div
                key={lang.name}
                className={`flex items-center justify-between p-2 rounded-md transition-all ${
                  hoveredIndex === index
                    ? 'bg-l-bg-3 dark:bg-d-bg-3 shadow-sm transform scale-102'
                    : 'hover:bg-l-bg-hover dark:hover:bg-d-bg-hover'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-sm"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-medium text-l-text-1 dark:text-d-text-1">
                    {lang.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-l-text-1 dark:text-d-text-1">
                    {lang.percentage}%
                  </span>
                  <span className="text-xs block text-l-text-3 dark:text-d-text-3">
                    {lang.value} {lang.value === 1 ? 'repo' : 'repos'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border-l dark:border-border-d">
            <div className="text-sm text-l-text-2 dark:text-d-text-2">
              <span className="font-medium">Pro tip:</span> Hover over chart
              segments or language names for more details
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
