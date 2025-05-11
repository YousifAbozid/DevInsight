import {
  // Updated persona icons for better representation
  Code,
  Microscope,
  Calendar,
  GitFork,
  Lightbulb,
  Layers,
  Star,
  FileCheck,
  Library,
  Zap,
  Copy,
  Info,

  // Additional icons for PersonasPage
  Users,
  CheckCircle,
  Globe,
  User,
  X,

  // Developer Badges Icons
  Activity,
  Trophy,
  Filter,
  Medal,
  Package,
  GitCommit,
  Shield,

  // Additional icons for PersonalizedSummary
  Flame,
  FolderClosed,
  Clock,
  Award,
  Heart, // Added Heart icon

  // Missing icons for expand/collapse functionality
  ChevronUp,
  ChevronDown,
  ChevronLeft,

  // Additional icons for DevJourneyTimeline
  Cake,

  // Additional icons for GithubProfileCard
  MoreVertical,
  Download,
  MapPin,
  Building2,
  Link,
  AtSign,
  Mail,
  ExternalLink,
  Eye,
  GitPullRequest,
  AlertCircle,
  FileText,
  UserPlus,
  Timer,

  // New icons for error states
  AlertTriangle,
  RefreshCw,
  Home,
  Search,
  Key,
  StretchHorizontal,

  // Additional icons for score system
  GitBranch,
  Languages,
  Database,
  ArrowUpRight,
  Gauge,
  BarChart,
  BadgeCheck,
  Calculator, // Added Calculator icon for GithubBattleResults
  TrendingUp, // Add the missing TrendingUp icon

  // New file type icons - fixed the name from FileCsv to Files
  FileJson,
  Files,
  Github,
  Linkedin,
  Twitter,
  Hash,

  // Adding missing icons used in CoderPersona and elsewhere
  Share2,
  Image,
  FileCode,

  // Add missing Loader icon for loading states
  Loader,

  // Add missing icons for ThemeToggle
  Sun,
  Moon,

  // Add missing icon for GithubCompareForm
  Swords,
  ArrowRight,

  // Add Flag icon import
  Flag,
  Plus,

  // Import proper Lucide icons to replace custom SVGs
  Flower as LucideFlower,
  Bug,
  FileType,
  Binary,

  // Additional icons
  Layout,
  Minus,
  Palette,
} from 'lucide-react';

// Define interface for icon props
interface IconProps {
  className?: string;
}

// Icon wrapper to maintain the same interface but use Lucide icons
export const Icons = {
  // Persona icons with more semantically meaningful choices
  CodeBranches: ({ className }: IconProps) => (
    <Code className={className} /> // Changed from ArrowLeft to Code for The Polyglot
  ),
  Microscope: ({ className }: IconProps) => (
    <Microscope className={className} /> // Kept as is - good fit for The Specialist
  ),
  Calendar: ({ className }: IconProps) => (
    <Calendar className={className} /> // Kept as is - good fit for The Consistent Committer
  ),
  Network: ({ className }: IconProps) => (
    <GitFork className={className} /> // Changed from Monitor to GitFork for The OSS Contributor
  ),
  Lightbulb: ({ className }: IconProps) => (
    <Lightbulb className={className} /> // Kept as is - good fit for The Solo Hacker
  ),
  Cubes: ({ className }: IconProps) => (
    <Layers className={className} /> // Changed from Package to Layers for The Project Juggler
  ),
  Star: ({ className }: IconProps) => (
    <Star className={className} /> // Kept as is - good fit for The Community Pillar
  ),
  Document: ({ className }: IconProps) => (
    <FileCheck className={className} /> // Changed from FileText to FileCheck for The Documentation Hero
  ),
  Template: ({ className }: IconProps) => (
    <Library className={className} /> // Changed from LayoutGrid to Library for The Framework Lord
  ),
  Zap: ({ className }: IconProps) => (
    <Zap className={className} /> // Changed from Download to Zap for The Sprinter
  ),
  Copy: ({ className }: IconProps) => <Copy className={className} />,
  Info: ({ className }: IconProps) => <Info className={className} />,

  // Additional icons for PersonasPage
  Code: ({ className }: IconProps) => <Code className={className} />, // Direct mapping to Code
  Users: ({ className }: IconProps) => <Users className={className} />,
  Check: ({ className }: IconProps) => <CheckCircle className={className} />,
  Globe: ({ className }: IconProps) => <Globe className={className} />,
  User: ({ className }: IconProps) => <User className={className} />,
  Close: ({ className }: IconProps) => (
    <X className={className} /> // Added for modal close button
  ),

  // Developer Badges Icons
  Repository: ({ className }: IconProps) => <Package className={className} />,
  Commit: ({ className }: IconProps) => <GitCommit className={className} />,
  Activity: ({ className }: IconProps) => <Activity className={className} />,
  Specialty: ({ className }: IconProps) => <Shield className={className} />,
  Trophy: ({ className }: IconProps) => <Trophy className={className} />,
  Filter: ({ className }: IconProps) => <Filter className={className} />,
  Medal: ({ className }: IconProps) => <Medal className={className} />,

  // Add direct Shield mapping
  Shield: ({ className }: IconProps) => <Shield className={className} />,

  // Add missing Repo icon (alias for Repository)
  Repo: ({ className }: IconProps) => <Package className={className} />,

  // Additional icons for PersonalizedSummary
  Fire: ({ className }: IconProps) => <Flame className={className} />,
  Folder: ({ className }: IconProps) => <FolderClosed className={className} />,
  Clock: ({ className }: IconProps) => <Clock className={className} />,
  Award: ({ className }: IconProps) => <Award className={className} />,
  Heart: ({ className }: IconProps) => <Heart className={className} />, // Added Heart icon

  // Add missing icons for expand/collapse functionality
  ChevronUp: ({ className }: IconProps) => <ChevronUp className={className} />,
  ChevronDown: ({ className }: IconProps) => (
    <ChevronDown className={className} />
  ),
  ChevronLeft: ({ className }: IconProps) => (
    <ChevronLeft className={className} />
  ),

  // Additional icons for DevJourneyTimeline
  Cake: ({ className }: IconProps) => <Cake className={className} />,

  // Additional icons for GithubProfileCard
  MoreVertical: ({ className }: IconProps) => (
    <MoreVertical className={className} />
  ),
  Download: ({ className }: IconProps) => <Download className={className} />,
  MapPin: ({ className }: IconProps) => <MapPin className={className} />,
  Building: ({ className }: IconProps) => <Building2 className={className} />,
  Link: ({ className }: IconProps) => <Link className={className} />,
  AtSign: ({ className }: IconProps) => <AtSign className={className} />,
  Mail: ({ className }: IconProps) => <Mail className={className} />,
  ExternalLink: ({ className }: IconProps) => (
    <ExternalLink className={className} />
  ),
  Eye: ({ className }: IconProps) => <Eye className={className} />,
  GitPullRequest: ({ className }: IconProps) => (
    <GitPullRequest className={className} />
  ),
  AlertCircle: ({ className }: IconProps) => (
    <AlertCircle className={className} />
  ),
  FileText: ({ className }: IconProps) => <FileText className={className} />,
  UserPlus: ({ className }: IconProps) => <UserPlus className={className} />,
  Timer: ({ className }: IconProps) => <Timer className={className} />,

  // New icons for error handling and UI enhancements
  AlertTriangle: ({ className }: IconProps) => (
    <AlertTriangle className={className} />
  ),
  RefreshCw: ({ className }: IconProps) => <RefreshCw className={className} />,
  Home: ({ className }: IconProps) => <Home className={className} />,
  Search: ({ className }: IconProps) => <Search className={className} />,
  Key: ({ className }: IconProps) => <Key className={className} />,
  SwitchHorizontal: ({ className }: IconProps) => (
    <StretchHorizontal className={className} />
  ),

  // Additional icons for score system
  GitBranch: ({ className }: IconProps) => <GitBranch className={className} />,
  Languages: ({ className }: IconProps) => <Languages className={className} />,
  Database: ({ className }: IconProps) => <Database className={className} />,
  ArrowUpRight: ({ className }: IconProps) => (
    <ArrowUpRight className={className} />
  ),
  ArrowRight: ({ className }: IconProps) => (
    <ArrowRight className={className} />
  ),
  Gauge: ({ className }: IconProps) => <Gauge className={className} />,
  BarChart: ({ className }: IconProps) => <BarChart className={className} />,
  BadgeCheck: ({ className }: IconProps) => (
    <BadgeCheck className={className} />
  ),
  TrendingUp: ({ className }: IconProps) => (
    <TrendingUp className={className} />
  ), // Add the TrendingUp icon component

  // Add missing Calculator icon
  Calculator: ({ className }: IconProps) => (
    <Calculator className={className} />
  ),

  // Add new file type icons
  FileJson: ({ className }: IconProps) => <FileJson className={className} />,
  FileCsv: ({ className }: IconProps) => <Files className={className} />,

  // Add GitHub Icon
  GitHub: ({ className }: IconProps) => <Github className={className} />,
  LinkedIn: ({ className }: IconProps) => <Linkedin className={className} />,
  Twitter: ({ className }: IconProps) => <Twitter className={className} />,

  // Add Hash icon
  Hash: ({ className }: IconProps) => <Hash className={className} />,

  // Add missing icons used in CoderPersona export section
  Share2: ({ className }: IconProps) => <Share2 className={className} />,
  Image: ({ className }: IconProps) => <Image className={className} />,
  FileCode: ({ className }: IconProps) => <FileCode className={className} />,

  // Add missing Loader icon for loading states
  Loader: ({ className }: IconProps) => <Loader className={className} />,

  // Add missing icons for ThemeToggle
  Sun: ({ className }: IconProps) => <Sun className={className} />,
  Moon: ({ className }: IconProps) => <Moon className={className} />,

  // Add missing icon for GithubCompareForm
  Swords: ({ className }: IconProps) => <Swords className={className} />,

  // Add missing Flag icon
  Flag: ({ className }: IconProps) => <Flag className={className} />,

  // Add missing Plus icon
  Plus: ({ className }: IconProps) => <Plus className={className} />,

  // Replace custom SVGs with Lucide icons
  Flower: ({ className }: IconProps) => <LucideFlower className={className} />,
  Butterfly: ({ className }: IconProps) => <Bug className={className} />,
  JavaScript: ({ className }: IconProps) => <FileJson className={className} />,
  TypeScript: ({ className }: IconProps) => <FileType className={className} />,
  Python: ({ className }: IconProps) => <Binary className={className} />,

  // Additional icons
  Layout: ({ className }: IconProps) => <Layout className={className} />,
  Minus: ({ className }: IconProps) => <Minus className={className} />,
  Palette: ({ className }: IconProps) => <Palette className={className} />,
};
