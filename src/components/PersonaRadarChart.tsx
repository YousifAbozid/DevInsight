import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

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

export default function PersonaRadarChart({
  strengths,
  color,
}: PersonaRadarChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Extract color values from Tailwind classes
  const getColorFromClass = (colorClass: string): string => {
    // Default colors if we can't extract from the class
    const defaultColors = {
      'bg-purple-100': {
        light: 'rgba(233, 213, 255, 0.6)',
        dark: 'rgba(91, 33, 182, 0.6)',
      },
      'bg-blue-100': {
        light: 'rgba(191, 219, 254, 0.6)',
        dark: 'rgba(37, 99, 235, 0.6)',
      },
      'bg-green-100': {
        light: 'rgba(187, 247, 208, 0.6)',
        dark: 'rgba(22, 163, 74, 0.6)',
      },
      'bg-orange-100': {
        light: 'rgba(254, 215, 170, 0.6)',
        dark: 'rgba(234, 88, 12, 0.6)',
      },
      'bg-gray-100': {
        light: 'rgba(243, 244, 246, 0.6)',
        dark: 'rgba(75, 85, 99, 0.6)',
      },
      'bg-pink-100': {
        light: 'rgba(252, 231, 243, 0.6)',
        dark: 'rgba(219, 39, 119, 0.6)',
      },
      'bg-yellow-100': {
        light: 'rgba(254, 249, 195, 0.6)',
        dark: 'rgba(202, 138, 4, 0.6)',
      },
      'bg-teal-100': {
        light: 'rgba(204, 251, 241, 0.6)',
        dark: 'rgba(20, 184, 166, 0.6)',
      },
      'bg-indigo-100': {
        light: 'rgba(224, 231, 255, 0.6)',
        dark: 'rgba(79, 70, 229, 0.6)',
      },
    };

    // Extract the color and shade from the class
    const colorMatch = colorClass.match(/bg-(\w+)-\d+/);
    if (!colorMatch) {
      return 'rgba(99, 102, 241, 0.6)'; // Default indigo color
    }

    const colorName = colorMatch[1];
    const isDark = document.documentElement.classList.contains('dark');

    // Find the matching color or use a default
    for (const [key, value] of Object.entries(defaultColors)) {
      if (key.includes(colorName)) {
        return isDark ? value.dark : value.light;
      }
    }

    return isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(99, 102, 241, 0.6)';
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const bgColor = getColorFromClass(color);
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#e5e7eb' : '#374151';

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: [
          'Language Diversity',
          'Contribution Consistency',
          'Collaboration',
          'Project Popularity',
          'Code Quality',
          'Community Impact',
        ],
        datasets: [
          {
            label: 'Developer Strengths',
            data: [
              strengths.languageDiversity,
              strengths.contributionConsistency,
              strengths.collaboration,
              strengths.projectPopularity,
              strengths.codeQuality,
              strengths.communityImpact,
            ],
            backgroundColor: bgColor,
            borderColor: bgColor.replace('0.6', '1'),
            borderWidth: 2,
            pointBackgroundColor: bgColor.replace('0.6', '1'),
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              display: false,
              stepSize: 25,
            },
            pointLabels: {
              color: textColor,
              font: {
                size: 12,
              },
            },
            grid: {
              color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
            angleLines: {
              color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: isDark ? '#374151' : '#ffffff',
            titleColor: isDark ? '#e5e7eb' : '#111827',
            bodyColor: isDark ? '#e5e7eb' : '#374151',
            borderColor: isDark ? '#4b5563' : '#e5e7eb',
            borderWidth: 1,
            padding: 10,
            displayColors: false,
            callbacks: {
              label: function (context) {
                return `Score: ${context.raw}/100`;
              },
            },
          },
        },
        responsive: true,
        maintainAspectRatio: true,
      },
    });

    // Add event listener for theme changes
    const observer = new MutationObserver(() => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        // Re-render the chart
        const newBgColor = getColorFromClass(color);
        const isDark = document.documentElement.classList.contains('dark');
        const newTextColor = isDark ? '#e5e7eb' : '#374151';

        if (ctx) {
          chartInstanceRef.current = new Chart(ctx, {
            type: 'radar',
            data: {
              labels: [
                'Language Diversity',
                'Contribution Consistency',
                'Collaboration',
                'Project Popularity',
                'Code Quality',
                'Community Impact',
              ],
              datasets: [
                {
                  label: 'Developer Strengths',
                  data: [
                    strengths.languageDiversity,
                    strengths.contributionConsistency,
                    strengths.collaboration,
                    strengths.projectPopularity,
                    strengths.codeQuality,
                    strengths.communityImpact,
                  ],
                  backgroundColor: newBgColor,
                  borderColor: newBgColor.replace('0.6', '1'),
                  borderWidth: 2,
                  pointBackgroundColor: newBgColor.replace('0.6', '1'),
                  pointRadius: 4,
                  pointHoverRadius: 6,
                },
              ],
            },
            options: {
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    display: false,
                    stepSize: 25,
                  },
                  pointLabels: {
                    color: newTextColor,
                    font: {
                      size: 12,
                    },
                  },
                  grid: {
                    color: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                  angleLines: {
                    color: isDark
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  backgroundColor: isDark ? '#374151' : '#ffffff',
                  titleColor: isDark ? '#e5e7eb' : '#111827',
                  bodyColor: isDark ? '#e5e7eb' : '#374151',
                  borderColor: isDark ? '#4b5563' : '#e5e7eb',
                  borderWidth: 1,
                  padding: 10,
                  displayColors: false,
                  callbacks: {
                    label: function (context) {
                      return `Score: ${context.raw}/100`;
                    },
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: true,
            },
          });
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [strengths, color]);

  return (
    <div className="w-full h-64">
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
