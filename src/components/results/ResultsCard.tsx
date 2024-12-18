import React from 'react';
import { Card } from '../Card';
import { Calendar, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ResultsCardProps {
  type: 'translation' | 'enhance';
  date: Date;
  status: 'in-progress' | 'completed';
  isNew?: boolean;
  onClick?: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  type,
  date,
  status,
  isNew,
  onClick,
}) => {
  return (
    <Card
      className={cn(
        'cursor-pointer hover:border-blue-300 transition-colors p-6',
        isNew && 'ring-2 ring-blue-500'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">
            {type === 'translation' ? 'Translation' : 'Enhancement'}
          </h3>
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {date.toLocaleDateString()}
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-gray-400" />
      </div>
      
      {status === 'in-progress' && (
        <div className="mt-4 text-sm text-blue-600">In progress...</div>
      )}
    </Card>
  );
};