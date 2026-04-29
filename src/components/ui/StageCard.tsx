import { useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, Check, ChevronDown, ChevronRight } from 'lucide-react';

interface StageCardProps {
  stageNumber: number;
  title: string;
  description?: string;
  status: 'active' | 'complete' | 'pending';
  children?: React.ReactNode;
  defaultOpen?: boolean;
}

export default function StageCard({
  stageNumber,
  title,
  description,
  status,
  children,
  defaultOpen = false
}: StageCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const statusColors = {
    active: 'border-cyan-400/50 shadow-cyan-400/20',
    complete: 'border-emerald-400/50',
    pending: 'border-white/10'
  };

  const statusBadge = {
    active: (
      <span className="flex items-center gap-1.5 text-cyan-400 text-xs animate-pulse">
        <Circle className="w-2 h-2 fill-cyan-400" /> Active
      </span>
    ),
    complete: (
      <span className="flex items-center gap-1 text-emerald-400 text-xs">
        <Check className="w-3 h-3" /> Complete
      </span>
    ),
    pending: <span className="text-gray-500 text-xs">Pending</span>
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`glass ${statusColors[status]} p-6 space-y-4`}
    >
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-sm ${
            status === 'active' ? 'bg-cyan-400/20 text-cyan-400 shadow-lg shadow-cyan-400/50' :
            status === 'complete' ? 'bg-emerald-400/20 text-emerald-400' :
            'bg-white/5 text-gray-500'
          }`}>
            {stageNumber}          </div>
          <div>
            <h3 className="font-semibold text-white">{title}</h3>
            {description && <p className="text-sm text-gray-400">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {statusBadge[status]}
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />}
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pt-4 border-t border-white/5"
        >
          {children}        </motion.div>
      )}
    </motion.div>
  );
}
