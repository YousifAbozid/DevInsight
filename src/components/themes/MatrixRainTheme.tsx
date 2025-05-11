import { useState, useEffect, useRef } from 'react';
import { Icons } from '../shared/Icons';
import { Badge } from '../DevCardGenerator';

interface MatrixRainThemeProps {
  user: GithubUser;
  repositories?: Repository[];
  languageData: LanguageData[];
  badges?: Badge[];
}

export default function MatrixRainTheme({ user }: MatrixRainThemeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix rain effect
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Characters to display in the Matrix rain
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track the Y position of each drop
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#0F0'; // Matrix green
      ctx.font = `${fontSize}px monospace`;

      // Looping over drops
      for (let i = 0; i < drops.length; i++) {
        // Random character to print
        const text = characters[Math.floor(Math.random() * characters.length)];

        // x = i*fontSize, y = drops[i]*fontSize
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Sending the drop back to the top randomly after it crosses the screen
        // Adding randomness to the reset to make the drops scattered
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Incrementing Y coordinate
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 35);

    return () => clearInterval(interval);
  }, []);

  // Simulate active days data (Monday to Sunday)
  const activeDays = [
    { day: 'Monday', count: Math.floor(Math.random() * 30) + 10 },
    { day: 'Tuesday', count: Math.floor(Math.random() * 30) + 5 },
    { day: 'Wednesday', count: Math.floor(Math.random() * 40) + 15 },
    { day: 'Thursday', count: Math.floor(Math.random() * 25) + 10 },
    { day: 'Friday', count: Math.floor(Math.random() * 20) + 5 },
    { day: 'Saturday', count: Math.floor(Math.random() * 15) },
    { day: 'Sunday', count: Math.floor(Math.random() * 10) },
  ]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3); // Get top 3 active days

  // Create a simulated contribution graph
  const contributionMonths = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const contributionData = contributionMonths.map(month => ({
    month,
    count: Math.floor(Math.random() * 150) + 10,
  }));

  // Find max contribution for scaling
  const maxContribution = Math.max(...contributionData.map(d => d.count));

  return (
    <div
      className="w-full max-w-md rounded-lg relative overflow-hidden"
      style={{ backgroundColor: '#0c0c0c' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Matrix rain canvas as background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
      />

      {/* Content container */}
      <div
        className="relative z-10 p-6"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          boxShadow: isHovered
            ? '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.2)'
            : 'none',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        {/* Terminal-style header */}
        <div className="flex items-center justify-between mb-4 border-b border-green-800 pb-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
          <div className="text-green-500 font-mono text-sm">
            github.com/{user.login}
          </div>
        </div>

        {/* User Info with typing effect */}
        <div className="font-mono mb-6 border-b border-green-800 pb-4">
          <div className="text-green-400 mb-2">{'>'} SUBJECT IDENTIFIED</div>
          <div className="text-2xl font-bold text-green-500 mb-1 flex items-center">
            <span className="mr-2">[</span>
            {user.name || user.login}
            <span className="ml-2">]</span>
          </div>
          <div className="text-green-400 text-sm flex items-center gap-2">
            <Icons.User className="w-4 h-4" />
            <span>@{user.login}</span>
          </div>

          {user.bio && (
            <div className="text-green-400/80 text-sm mt-2 bg-black/50 p-2 rounded border border-green-900">
              {'>'} {user.bio}
            </div>
          )}
        </div>

        {/* Contributions graph */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-green-500 font-mono mb-3">
            <Icons.Activity className="w-4 h-4" />
            <span className="uppercase text-sm">Contribution Pattern</span>
          </div>

          <div className="relative h-32 bg-black/50 border border-green-900 p-3 rounded">
            {/* Draw contribution graph */}
            <div className="flex items-end justify-between h-full relative">
              {contributionData.map(month => {
                const height = (month.count / maxContribution) * 100;
                return (
                  <div key={month.month} className="flex flex-col items-center">
                    <div
                      className="w-4 bg-green-500 mb-1 transition-all duration-300 hover:bg-green-400"
                      style={{
                        height: `${height}%`,
                        boxShadow: isHovered
                          ? '0 0 10px rgba(0, 255, 0, 0.5)'
                          : 'none',
                      }}
                    ></div>
                    <div className="text-green-500/80 text-xs font-mono">
                      {month.month}
                    </div>
                  </div>
                );
              })}

              {/* Grid lines */}
              <div className="absolute inset-0 border-t border-green-900/30 transform translate-y-1/4"></div>
              <div className="absolute inset-0 border-t border-green-900/30 transform translate-y-2/4"></div>
              <div className="absolute inset-0 border-t border-green-900/30 transform translate-y-3/4"></div>
            </div>
          </div>
        </div>

        {/* Most active days */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-green-500 font-mono mb-3">
            <Icons.Calendar className="w-4 h-4" />
            <span className="uppercase text-sm">Top Active Days</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {activeDays.map(day => (
              <div
                key={day.day}
                className="bg-black/50 border border-green-900 rounded p-2 hover:border-green-500 transition-colors"
              >
                <div className="text-green-500 font-mono text-sm text-center">
                  {day.day}
                </div>
                <div className="text-green-400 font-mono text-lg text-center font-bold">
                  {day.count}
                </div>
                <div className="text-green-500/70 text-xs text-center font-mono">
                  commits
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="font-mono text-xs text-green-500/70 space-y-1 border-t border-green-800 pt-3">
          <div className="flex justify-between">
            <span>FOLLOWERS:</span>
            <span className="text-green-400">{user.followers}</span>
          </div>
          <div className="flex justify-between">
            <span>REPOSITORIES:</span>
            <span className="text-green-400">{user.public_repos}</span>
          </div>
          <div className="flex justify-between">
            <span>LAST SEEN:</span>
            <span className="text-green-400">
              {new Date().toISOString().split('T')[0]}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center text-green-500/50 text-xs font-mono">
          MATRIX CONNECTION ESTABLISHED • DEVINSIGHT ACCESS GRANTED
        </div>
      </div>
    </div>
  );
}
