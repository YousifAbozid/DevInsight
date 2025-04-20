import {
  ArrowLeft,
  Microscope,
  Calendar,
  Monitor,
  Lightbulb,
  Package,
  Star,
  FileText,
  LayoutGrid,
  Download,
  Copy,
  Info,
  Code,
  Users,
  CheckCircle,
  Globe,
  User,
} from 'lucide-react';

// Icon wrapper to maintain the same interface but use Lucide icons
export const Icons = {
  // Persona icons
  CodeBranches: ({ className }: { className?: string }) => (
    <ArrowLeft className={className} />
  ),
  Microscope: ({ className }: { className?: string }) => (
    <Microscope className={className} />
  ),
  Calendar: ({ className }: { className?: string }) => (
    <Calendar className={className} />
  ),
  Network: ({ className }: { className?: string }) => (
    <Monitor className={className} />
  ),
  Lightbulb: ({ className }: { className?: string }) => (
    <Lightbulb className={className} />
  ),
  Cubes: ({ className }: { className?: string }) => (
    <Package className={className} />
  ),
  Star: ({ className }: { className?: string }) => (
    <Star className={className} />
  ),
  Document: ({ className }: { className?: string }) => (
    <FileText className={className} />
  ),
  Template: ({ className }: { className?: string }) => (
    <LayoutGrid className={className} />
  ),
  Download: ({ className }: { className?: string }) => (
    <Download className={className} />
  ),
  Copy: ({ className }: { className?: string }) => (
    <Copy className={className} />
  ),
  Info: ({ className }: { className?: string }) => (
    <Info className={className} />
  ),

  // Additional icons for PersonasPage
  Code: ({ className }: { className?: string }) => (
    <Code className={className} />
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
};
