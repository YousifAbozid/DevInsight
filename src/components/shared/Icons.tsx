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
  TerminalSquare,
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

  // Missing icons for expand/collapse functionality
  ChevronUp,
  ChevronDown,

  // Additional icons needed for DevJourneyTimeline
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
  Code: ({ className }: IconProps) => (
    <TerminalSquare className={className} /> // Changed to TerminalSquare for consistency
  ),
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

  // Add missing icons for expand/collapse functionality
  ChevronUp: ({ className }: IconProps) => <ChevronUp className={className} />,
  ChevronDown: ({ className }: IconProps) => (
    <ChevronDown className={className} />
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
};
