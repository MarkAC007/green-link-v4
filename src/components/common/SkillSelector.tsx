import React from 'react';
import { X, Plus, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Skill } from '../../types/skill';

interface SkillSelectorProps {
  availableSkills: Skill[];
  selectedSkills: string[];
  verifiedSkills?: string[];
  rejectedSkills?: string[];
  onSkillToggle: (skillId: string) => void;
  className?: string;
}

export function SkillSelector({
  availableSkills,
  selectedSkills,
  verifiedSkills = [],
  rejectedSkills = [],
  onSkillToggle,
  className = ''
}: SkillSelectorProps) {
  const getSkillStatus = (skillId: string) => {
    if (verifiedSkills.includes(skillId)) return 'verified';
    if (rejectedSkills.includes(skillId)) return 'rejected';
    if (selectedSkills.includes(skillId)) return 'pending';
    return 'unselected';
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 ml-1 text-green-600" />;
      case 'rejected':
        return (
          <div className="relative">
            <XCircle className="w-4 h-4 ml-1 text-red-500" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Verification rejected
            </div>
          </div>
        );
      case 'pending':
        return (
          <div className="relative">
            <AlertCircle className="w-4 h-4 ml-1 text-yellow-500" />
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Pending verification
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex flex-wrap gap-2">
        {availableSkills.map((skill) => {
          const status = getSkillStatus(skill.id);
          const isSelected = status !== 'unselected';
          
          return (
            <button
              key={skill.id}
              onClick={() => onSkillToggle(skill.id)}
              className={`group relative inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors ${getStatusStyles(status)}`}
            >
              {isSelected ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  {skill.name}
                  {getStatusIcon(status)}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  {skill.name}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}