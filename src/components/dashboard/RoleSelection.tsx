import { motion } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Briefcase, GraduationCap, User } from 'lucide-react';

interface RoleSelectionProps {
  selectedRole: string;
  customRole: string;
  experienceLevel: string;
  onRoleChange: (role: string) => void;
  onCustomRoleChange: (role: string) => void;
  onExperienceLevelChange: (level: string) => void;
}

const predefinedRoles = [
  'Software Engineer Intern',
  'Data Analyst',
  'Product Manager',
  'UI/UX Designer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Business Analyst',
];

const experienceLevels = [
  { value: 'Student', label: 'Student', description: 'Currently studying', icon: GraduationCap },
  { value: 'Fresher', label: 'Fresher', description: '0-1 year experience', icon: User },
  { value: '1-3 Years', label: '1-3 Years', description: 'Some work experience', icon: Briefcase },
];

export function RoleSelection({
  selectedRole,
  customRole,
  experienceLevel,
  onRoleChange,
  onCustomRoleChange,
  onExperienceLevelChange,
}: RoleSelectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Target Role Selection */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Target Role</Label>
        <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full h-12">
            <SelectValue placeholder="Select your dream role" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            {predefinedRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
            <SelectItem value="custom">Other (specify below)</SelectItem>
          </SelectContent>
        </Select>

        {selectedRole === 'custom' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Input
              placeholder="Enter your target role"
              value={customRole}
              onChange={(e) => onCustomRoleChange(e.target.value)}
              className="mt-2"
            />
          </motion.div>
        )}
      </div>

      {/* Experience Level */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Experience Level</Label>
        <RadioGroup
          value={experienceLevel}
          onValueChange={onExperienceLevelChange}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {experienceLevels.map((level) => (
            <div key={level.value}>
              <RadioGroupItem
                value={level.value}
                id={level.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={level.value}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/50"
              >
                <level.icon className="w-6 h-6 text-primary" />
                <span className="font-medium text-foreground">{level.label}</span>
                <span className="text-xs text-muted-foreground">{level.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </motion.div>
  );
}
