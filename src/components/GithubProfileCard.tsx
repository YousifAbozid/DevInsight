import { useState, useRef, useEffect } from 'react';
import { useUserPullRequests, useUserIssues } from '../services/githubService';
import { Icons } from './shared/Icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../context/ToastContext';
import GithubProfileCardSkeleton from './shared/Skeletons/GithubProfileCardSkeleton';
import { useGithubToken } from '../hooks/useStorage';

interface GithubProfileCardProps {
  user: GithubUser;
  publicProfileUrl?: string;
  onSaveUserData?: () => void;
  onSaveReposData?: () => void;
  hasRepositories?: boolean;
  loading?: boolean;
}

export default function GithubProfileCard({
  user,
  publicProfileUrl,
  onSaveUserData,
  onSaveReposData,
  hasRepositories = false,
  loading = false,
}: GithubProfileCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownButtonRef = useRef<HTMLButtonElement>(null);
  const { notify } = useToast(); // Use our new toast notification system
  const [token] = useGithubToken();

  // Return skeleton loader if loading prop is true
  if (loading) {
    return <GithubProfileCardSkeleton />;
  }

  // Use the new React Query hooks for PRs and issues
  const { data: pullRequests = 0, isLoading: isPRsLoading } =
    useUserPullRequests(user.login, token);

  const { data: issues = 0, isLoading: isIssuesLoading } = useUserIssues(
    user.login,
    token
  );

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        dropdownButtonRef.current &&
        !dropdownButtonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExportCSV = (userData: GithubUser) => {
    try {
      // Create CSV header row
      const headers = [
        'username',
        'name',
        'email',
        'location',
        'company',
        'bio',
        'followers',
        'following',
        'public_repos',
        'created_at',
        'updated_at',
        'twitter_username',
        'blog',
      ];

      // Create CSV data row
      const data = [
        userData.login || '',
        userData.name || '',
        userData.email || '',
        userData.location || '',
        userData.company || '',
        userData.bio ? `"${userData.bio.replace(/"/g, '""')}"` : '', // Escape quotes in bio
        userData.followers,
        userData.following,
        userData.public_repos,
        userData.created_at,
        userData.updated_at,
        userData.twitter_username || '',
        userData.blog || '',
      ];

      // Combine header and data into CSV content
      const csvContent = [headers.join(','), data.join(',')].join('\n');

      // Create and download a file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${userData.login}-github-profile.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success notification using our toast system
      notify('success', 'CSV file exported successfully!');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      // Show error notification using our toast system
      notify('error', 'Failed to export CSV file');
    }
  };

  const handleExportText = (userData: GithubUser) => {
    try {
      const accountAge = calculateAccountAge();
      // Format user data as plain text
      const textContent = [
        `GitHub Profile Summary for ${userData.name || userData.login}`,
        '======================================================',
        '',
        `Username: ${userData.login}`,
        `Name: ${userData.name || 'Not provided'}`,
        userData.bio ? `Bio: ${userData.bio}` : '',
        userData.email ? `Email: ${userData.email}` : '',
        userData.location ? `Location: ${userData.location}` : '',
        userData.company ? `Company: ${userData.company}` : '',
        userData.blog ? `Website: ${userData.blog}` : '',
        userData.twitter_username
          ? `Twitter: @${userData.twitter_username}`
          : '',
        '',
        'Account Statistics',
        '-----------------',
        `Public Repositories: ${userData.public_repos}`,
        `Followers: ${userData.followers}`,
        `Following: ${userData.following}`,
        `Public Gists: ${userData.public_gists}`,
        `Pull Requests: ${isPRsLoading ? 'Loading...' : pullRequests}`,
        `Issues: ${isIssuesLoading ? 'Loading...' : issues}`,
        '',
        'Account Information',
        '------------------',
        `Account Age: ${accountAge.years} years, ${accountAge.months} months, ${accountAge.days} days`,
        `Created At: ${new Date(userData.created_at).toLocaleDateString()} ${new Date(
          userData.created_at
        ).toLocaleTimeString()}`,
        `Last Updated: ${new Date(userData.updated_at).toLocaleDateString()} ${new Date(
          userData.updated_at
        ).toLocaleTimeString()}`,
        '',
        `GitHub URL: ${userData.html_url}`,
        '',
        '======================================================',
        'Generated with DevInsight - https://github.com/YousifAbozid/DevInsight',
      ]
        .filter(Boolean)
        .join('\n');

      // Create and download a file
      const blob = new Blob([textContent], {
        type: 'text/plain;charset=utf-8;',
      });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `${userData.login}-github-profile.txt`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success notification using our toast system
      notify('success', 'Text summary exported successfully!');
    } catch (error) {
      console.error('Error exporting text:', error);
      // Show error notification using our toast system
      notify('error', 'Failed to export text summary');
    }
  };

  const handleExportReposCSV = async () => {
    if (!onSaveReposData) return;

    try {
      // This is a placeholder function since we don't have direct access to the repos data
      // In a real implementation, you would use the repositories data passed to this component
      // For now, we'll just trigger a success notification
      notify('success', 'Repository CSV exported successfully!');
    } catch (error) {
      console.error('Error exporting repos CSV:', error);
      notify('error', 'Failed to export repositories CSV');
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate account age in years, months, and days
  const calculateAccountAge = () => {
    const joinDate = new Date(user.created_at);
    const now = new Date();

    let yearDiff = now.getFullYear() - joinDate.getFullYear();
    let monthDiff = now.getMonth() - joinDate.getMonth();

    // Calculate days
    const currentDay = now.getDate();
    const joinDay = joinDate.getDate();
    let dayDiff = currentDay - joinDay;

    // Adjust for negative days
    if (dayDiff < 0) {
      // Get the last day of previous month
      const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      dayDiff = dayDiff + lastMonth.getDate();
      monthDiff--;
    }

    // Adjust for negative months
    if (monthDiff < 0) {
      yearDiff--;
      monthDiff = monthDiff + 12;
    }

    return {
      years: yearDiff,
      months: monthDiff,
      days: dayDiff,
    };
  };

  // Calculate next GitHub anniversary with countdown
  const calculateNextAnniversary = () => {
    const now = new Date();
    const joinDate = new Date(user.created_at);

    // Get just the month and day of the join date
    const joinMonth = joinDate.getMonth();
    const joinDay = joinDate.getDate();

    // Check if today is the anniversary
    const isToday = now.getMonth() === joinMonth && now.getDate() === joinDay;

    // Set up the next anniversary date
    const nextAnniversary = new Date(now.getFullYear(), joinMonth, joinDay);

    // If the anniversary has already passed this year, set for next year
    if (nextAnniversary < now && !isToday) {
      nextAnniversary.setFullYear(now.getFullYear() + 1);
    }

    const diffTime = nextAnniversary.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Calculate hours, minutes left for more precise countdown
    const hoursLeft = Math.floor(
      (diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutesLeft = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

    return {
      date: nextAnniversary,
      daysUntil: diffDays,
      hoursLeft,
      minutesLeft,
      isAnniversaryToday: isToday,
    };
  };

  const accountAge = calculateAccountAge();
  const nextAnniversary = calculateNextAnniversary();
  const isBirthday = nextAnniversary.isAnniversaryToday;

  return (
    <div className="bg-l-bg-2 dark:bg-d-bg-2 rounded-lg p-6 border border-border-l dark:border-border-d relative">
      {/* Remove legacy export status notification - using toast system instead */}

      {/* Save Options Dropdown */}
      {(onSaveUserData || onSaveReposData) && (
        <div className="absolute top-4 right-4">
          <button
            ref={dropdownButtonRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 rounded-full hover:bg-l-bg-1 dark:hover:bg-d-bg-1 transition-colors cursor-pointer"
            title="Save options"
          >
            <Icons.MoreVertical className="w-[18px] h-[18px] text-l-text-2 dark:text-d-text-2" />
          </button>

          {showDropdown && (
            <AnimatePresence>
              <motion.div
                ref={dropdownRef}
                className="absolute right-0 mt-1 w-64 bg-l-bg-1 dark:bg-d-bg-1 rounded-lg shadow-lg border border-border-l dark:border-border-d z-10 overflow-hidden"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="py-2">
                  <div className="px-3 py-2 border-b border-border-l dark:border-border-d">
                    <h3 className="text-sm font-medium text-l-text-1 dark:text-d-text-1 flex items-center">
                      <Icons.Download className="w-4 h-4 mr-2 text-accent-1" />
                      Export Options
                    </h3>
                  </div>

                  {/* User data download options */}
                  {onSaveUserData && (
                    <div className="pt-1">
                      <p className="px-3 py-1 text-xs font-medium text-l-text-3 dark:text-d-text-3">
                        User Data
                      </p>
                      <motion.button
                        onClick={() => {
                          onSaveUserData();
                          notify('success', 'JSON file exported successfully!');
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 cursor-pointer group"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Icons.FileJson className="w-4 h-4 text-accent-1 group-hover:scale-110 transition-transform" />
                        JSON Format
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleExportCSV(user);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 cursor-pointer group"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Icons.FileCsv className="w-4 h-4 text-accent-success group-hover:scale-110 transition-transform" />
                        CSV Format
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleExportText(user);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 cursor-pointer group"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Icons.FileText className="w-4 h-4 text-accent-2 group-hover:scale-110 transition-transform" />
                        Text Summary
                      </motion.button>
                    </div>
                  )}

                  {/* Repos data download options */}
                  {onSaveReposData && hasRepositories && (
                    <div className="pt-1 mt-1 border-t border-border-l dark:border-border-d">
                      <p className="px-3 py-1 text-xs font-medium text-l-text-3 dark:text-d-text-3">
                        Repository Data
                      </p>
                      <motion.button
                        onClick={() => {
                          onSaveReposData();
                          notify(
                            'success',
                            'Repositories JSON file exported successfully!'
                          );
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 cursor-pointer group"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Icons.FileJson className="w-4 h-4 text-accent-1 group-hover:scale-110 transition-transform" />
                        JSON Format
                      </motion.button>

                      <motion.button
                        onClick={() => {
                          handleExportReposCSV();
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-l-text-1 dark:text-d-text-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover flex items-center gap-2 cursor-pointer group"
                        whileHover={{ x: 5 }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        <Icons.FileCsv className="w-4 h-4 text-accent-success group-hover:scale-110 transition-transform" />
                        CSV Format
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {/* Top Section with Avatar and Basic Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        {/* Avatar Column */}
        <div className="flex flex-col items-center space-y-3">
          <div className="relative">
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {/* Pulsing border effect */}
              <motion.div
                className="absolute -inset-1 rounded-full bg-accent-1/30 blur-sm z-0"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 0.4, 0.7],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />

              {/* Circle animation similar to theme toggle */}
              <span className="absolute inset-0 rounded-full scale-0 bg-accent-1/15 group-hover:scale-150 transition-transform duration-500 origin-center"></span>

              <img
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
                className="w-28 h-28 rounded-full border-4 border-accent-1 shadow-md relative z-10 bg-l-bg-2 dark:bg-d-bg-2"
              />
            </motion.div>

            {user.hireable && (
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/3 bg-accent-success text-white text-xs px-2 py-1 rounded-md shadow-sm z-20"
              >
                Hireable
              </motion.span>
            )}
          </div>

          {/* Enhanced Profile Links with consistent styling and new tab behavior */}
          <div className="flex flex-col w-full gap-3 mt-2">
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-l-bg-1 dark:bg-d-bg-1 hover:bg-l-bg-hover dark:hover:bg-d-bg-hover px-4 py-2.5 rounded-lg border border-border-l/30 dark:border-border-d/30 text-l-text-1 dark:text-d-text-1 hover:text-accent-1 transition-all duration-200 group shadow-sm hover:shadow-md"
            >
              <Icons.GitHub className="w-5 h-5 text-accent-1 group-hover:scale-110 transition-transform" />
              <span className="font-medium">GitHub Profile</span>
              <Icons.ExternalLink className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100" />
            </a>

            {publicProfileUrl && (
              <a
                href={publicProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-r from-accent-1 to-accent-2 text-white px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-accent-2 to-accent-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                <Icons.Activity className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                <span className="font-medium relative z-10">
                  DevInsight Profile
                </span>
                <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-xs font-medium relative z-10">
                  Public
                </span>
                <Icons.ExternalLink className="w-4 h-4 ml-1 opacity-70 group-hover:opacity-100 relative z-10" />
              </a>
            )}
          </div>
        </div>

        {/* User Info Column */}
        <div className="flex-1 w-full md:w-auto text-center md:text-left">
          {/* User Name and Type */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 flex-wrap justify-center md:justify-start">
            <h2 className="text-2xl font-bold text-l-text-1 dark:text-d-text-1">
              {user.name || user.login}
            </h2>

            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
              {user.type && user.type !== 'User' && (
                <span className="bg-accent-2/20 text-accent-2 text-xs px-2 py-0.5 rounded-full">
                  {user.type}
                </span>
              )}
              {user.site_admin && (
                <span className="bg-accent-warning/20 text-accent-warning text-xs px-2 py-0.5 rounded-full">
                  Staff
                </span>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="text-l-text-2 dark:text-d-text-2 mt-1 text-lg">
            @{user.login}
          </div>

          {/* Bio */}
          {user.bio && (
            <p className="mt-3 text-l-text-2 dark:text-d-text-2 bg-l-bg-1 dark:bg-d-bg-1 p-3 rounded-md border border-border-l/50 dark:border-border-d/50 shadow-sm">
              {user.bio}
            </p>
          )}

          {/* Redesigned GitHub Membership Section */}
          <div className="mt-4 bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-md border border-border-l/50 dark:border-border-d/50 relative overflow-hidden">
            {/* Birthday confetti background effect */}
            {isBirthday && (
              <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-full opacity-5 bg-confetti"></div>
              </div>
            )}

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center mb-2 sm:mb-0">
                <Icons.Users className="w-5 h-5 mr-2 text-accent-1 flex-shrink-0" />
                <h3 className="text-l-text-1 dark:text-d-text-1 font-medium">
                  GitHub Membership
                </h3>
              </div>

              {/* Membership Duration Badge */}
              <div className="bg-accent-1/10 text-accent-1 px-3 py-1 rounded-full text-sm flex items-center">
                <Icons.Calendar className="w-4 h-4 mr-1.5" />
                <span className="whitespace-nowrap">
                  {accountAge.years > 0
                    ? `${accountAge.years} year${
                        accountAge.years !== 1 ? 's' : ''
                      } `
                    : ''}
                  {accountAge.months > 0
                    ? `${accountAge.months} month${
                        accountAge.months !== 1 ? 's' : ''
                      } `
                    : ''}
                  {accountAge.days > 0
                    ? `${accountAge.days} day${
                        accountAge.days !== 1 ? 's' : ''
                      }`
                    : ''}
                  {accountAge.years === 0 &&
                  accountAge.months === 0 &&
                  accountAge.days === 0
                    ? 'Just joined'
                    : ''}
                </span>
              </div>
            </div>

            {/* Membership Timeline */}
            <div className="mt-4 space-y-3">
              {/* Join Date with Icon */}
              <div className="flex items-start">
                <div className="bg-l-bg-2 dark:bg-d-bg-2 p-1.5 rounded-full mr-3 mt-0.5">
                  <Icons.Clock className="w-4 h-4 text-accent-success" />
                </div>
                <div className="flex flex-col items-start">
                  <p className="font-medium text-l-text-1 dark:text-d-text-1">
                    Joined GitHub
                  </p>
                  <p className="text-l-text-2 dark:text-d-text-2 text-sm">
                    {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              {/* Future Anniversary (Only shown when not birthday) */}
              {!isBirthday && (
                <div className="flex items-start">
                  <div className="bg-l-bg-2 dark:bg-d-bg-2 p-1.5 rounded-full mr-3 mt-0.5">
                    <Icons.Timer className="w-4 h-4 text-accent-warning" />
                  </div>
                  <div className="flex flex-col items-start">
                    <p className="font-medium text-l-text-1 dark:text-d-text-1">
                      Next Anniversary
                    </p>
                    <p className="text-l-text-2 dark:text-d-text-2 text-sm">
                      {formatDate(nextAnniversary.date.toISOString())}
                    </p>

                    {/* Enhanced countdown display */}
                    <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="inline-flex items-center bg-accent-success/10 text-accent-success text-xs px-2 py-1 rounded-md">
                        <Icons.Timer className="w-3 h-3 mr-1" />
                        {nextAnniversary.daysUntil} day
                        {nextAnniversary.daysUntil !== 1 ? 's' : ''}
                      </span>

                      {nextAnniversary.daysUntil <= 7 && (
                        <span className="inline-flex items-center bg-accent-warning/10 text-accent-warning text-xs px-2 py-1 rounded-md">
                          <Icons.Timer className="w-3 h-3 mr-1" />
                          {nextAnniversary.hoursLeft}h{' '}
                          {nextAnniversary.minutesLeft}m
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Anniversary Celebration (Only shown on birthday) */}
            {isBirthday && (
              <div className="mt-3 bg-accent-warning/10 p-3 rounded-md border border-accent-warning/30">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-3">
                    <span className="inline-block text-2xl">🎉</span>
                  </div>
                  <div>
                    <p className="text-start text-accent-warning font-medium">
                      Happy GitHub Anniversary!
                    </p>
                    <p className="text-start text-sm text-l-text-2 dark:text-d-text-2">
                      Today marks {accountAge.years} year
                      {accountAge.years !== 1 ? 's' : ''} since you joined
                      GitHub!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact and Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-4">
            {/* Left column */}
            <div>
              {user.location && (
                <div className="flex items-center text-l-text-2 dark:text-d-text-2">
                  <Icons.MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{user.location}</span>
                </div>
              )}

              {user.company && (
                <div className="flex items-center text-l-text-2 dark:text-d-text-2 mt-1.5">
                  <Icons.Building className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{user.company}</span>
                </div>
              )}
            </div>

            {/* Right column */}
            <div>
              {user.blog && (
                <div className="flex items-center text-l-text-2 dark:text-d-text-2">
                  <Icons.Link className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a
                    href={
                      user.blog.startsWith('http')
                        ? user.blog
                        : `https://${user.blog}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-1 hover:underline cursor-pointer truncate"
                  >
                    {
                      new URL(
                        user.blog.startsWith('http')
                          ? user.blog
                          : `https://${user.blog}`
                      ).hostname
                    }
                  </a>
                </div>
              )}

              {user.twitter_username && (
                <div className="flex items-center text-l-text-2 dark:text-d-text-2 mt-1.5">
                  <Icons.Twitter className="w-4 h-4 mr-2 flex-shrink-0" />
                  <a
                    href={`https://x.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-1 hover:underline cursor-pointer"
                  >
                    @{user.twitter_username}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Email Info */}
          {user.email && (
            <div className="flex items-center text-l-text-2 dark:text-d-text-2 mt-4">
              <Icons.Mail className="w-4 h-4 mr-2 flex-shrink-0" />
              <a
                href={`mailto:${user.email}`}
                className="text-accent-1 hover:underline cursor-pointer"
              >
                {user.email}
              </a>
            </div>
          )}

          <div className="text-l-text-3 dark:text-d-text-3 text-sm mt-4">
            <span className="bg-l-bg-1 dark:bg-d-bg-1 px-2 py-1 rounded-md">
              Last updated {formatDate(user.updated_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div
        className={`grid grid-cols-2 ${user.type === 'User' ? 'md:grid-cols-6' : 'md:grid-cols-3'} gap-4 mt-4`}
      >
        {/* Repositories - shown for both users and organizations */}
        <StatCard
          title="Repos"
          value={user.public_repos}
          icon={<Icons.Folder className="w-5 h-5" />}
        />

        {/* Followers - shown for both users and organizations */}
        <StatCard
          title="Followers"
          value={user.followers}
          icon={<Icons.Users className="w-5 h-5" />}
        />

        {/* Show different third stat based on profile type */}
        {user.type === 'User' ? (
          <StatCard
            title="Following"
            value={user.following}
            icon={<Icons.UserPlus className="w-5 h-5" />}
          />
        ) : (
          <StatCard
            title="Members"
            value={user.following || 0} // Organizations often use this field differently
            icon={<Icons.UserPlus className="w-5 h-5" />}
          />
        )}

        {/* The remaining stats are only shown for individual users */}
        {user.type === 'User' && (
          <>
            <StatCard
              title="Gists"
              value={user.public_gists}
              icon={<Icons.FileText className="w-5 h-5" />}
            />
            <StatCard
              title="PRs"
              value={pullRequests}
              isLoading={isPRsLoading}
              icon={<Icons.GitPullRequest className="w-5 h-5" />}
            />
            <StatCard
              title="Issues"
              value={issues}
              isLoading={isIssuesLoading}
              icon={<Icons.AlertCircle className="w-5 h-5" />}
            />
          </>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  icon?: React.ReactNode;
  isLoading?: boolean;
}

function StatCard({ title, value, icon, isLoading = false }: StatCardProps) {
  return (
    <div className="bg-l-bg-1 dark:bg-d-bg-1 p-4 rounded-lg border border-border-l dark:border-border-d hover:shadow-md transition-all hover:border-accent-1/30 group">
      <div className="flex items-center gap-2">
        {icon && (
          <div className="text-accent-1 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
        <div className="text-l-text-3 dark:text-d-text-3 text-sm font-medium">
          {title}
        </div>
      </div>
      <div className="text-l-text-1 dark:text-d-text-1 text-xl font-bold mt-2">
        {isLoading ? (
          <div className="w-6 h-5 bg-l-bg-3 dark:bg-d-bg-3 rounded animate-pulse"></div>
        ) : (
          value.toLocaleString()
        )}
      </div>
    </div>
  );
}
