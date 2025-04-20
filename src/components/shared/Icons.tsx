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
} from 'lucide-react';

// Icon wrapper to maintain the same interface but use Lucide icons
export const Icons = {
  // Persona icons with more semantically meaningful choices
  CodeBranches: ({ className }: { className?: string }) => (
    <Code className={className} /> // Changed from ArrowLeft to Code for The Polyglot
  ),
  Microscope: ({ className }: { className?: string }) => (
    <Microscope className={className} /> // Kept as is - good fit for The Specialist
  ),
  Calendar: ({ className }: { className?: string }) => (
    <Calendar className={className} /> // Kept as is - good fit for The Consistent Committer
  ),
  Network: ({ className }: { className?: string }) => (
    <GitFork className={className} /> // Changed from Monitor to GitFork for The OSS Contributor
  ),
  Lightbulb: ({ className }: { className?: string }) => (
    <Lightbulb className={className} /> // Kept as is - good fit for The Solo Hacker
  ),
  Cubes: ({ className }: { className?: string }) => (
    <Layers className={className} /> // Changed from Package to Layers for The Project Juggler
  ),
  Star: ({ className }: { className?: string }) => (
    <Star className={className} /> // Kept as is - good fit for The Community Pillar
  ),
  Document: ({ className }: { className?: string }) => (
    <FileCheck className={className} /> // Changed from FileText to FileCheck for The Documentation Hero
  ),
  Template: ({ className }: { className?: string }) => (
    <Library className={className} /> // Changed from LayoutGrid to Library for The Framework Lord
  ),
  Download: ({ className }: { className?: string }) => (
    <Zap className={className} /> // Changed from Download to Zap for The Sprinter
  ),
  Copy: ({ className }: { className?: string }) => (
    <Copy className={className} />
  ),
  Info: ({ className }: { className?: string }) => (
    <Info className={className} />
  ),

  // Additional icons for PersonasPage
  Code: ({ className }: { className?: string }) => (
    <TerminalSquare className={className} /> // Changed to TerminalSquare for consistency
  ),
  Users: ({ className }: { className?: string }) => (
    <Users className={className} />
  ),
  Check: ({ className }: { className?: string }) => (
    <CheckCircle className={className} />
  ),
  Globe: ({ className }: { className?: string }) => (
    <Globe className={className} />
  ),
  User: ({ className }: { className?: string }) => (
    <User className={className} />
  ),
  Close: ({ className }: { className?: string }) => (
    <X className={className} /> // Added for modal close button
  ),

  // Developer Badges Icons
  Repository: ({ className }: { className?: string }) => (
    <Package className={className} />
  ),
  Commit: ({ className }: { className?: string }) => (
    <GitCommit className={className} />
  ),
  Activity: ({ className }: { className?: string }) => (
    <Activity className={className} />
  ),
  Specialty: ({ className }: { className?: string }) => (
    <Shield className={className} />
  ),
  Trophy: ({ className }: { className?: string }) => (
    <Trophy className={className} />
  ),
  Filter: ({ className }: { className?: string }) => (
    <Filter className={className} />
  ),
  Medal: ({ className }: { className?: string }) => (
    <Medal className={className} />
  ),
};
