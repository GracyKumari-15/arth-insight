import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ToolCardProps {
  emoji: string;
  title: string;
  path: string;
  isSubscription?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

const ToolCard = ({ emoji, title, path, isSubscription = false, disabled = false, disabledMessage }: ToolCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (disabled) {
      if (disabledMessage) {
        toast({ title: disabledMessage, variant: 'default' });
      }
      return;
    }
    navigate(path);
  };

  return (
    <div 
      onClick={handleClick}
      role="button"
      aria-disabled={disabled}
      className={`
        card-hover bg-card rounded-xl p-6 text-center shadow-card border-2
        ${isSubscription ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-border'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
        transition-all duration-300
      `}
    >
      <div className="text-4xl mb-3">{emoji}</div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {isSubscription && (
        <div className="mt-2">
          <span className="text-xs text-amber-700 font-medium px-2 py-1 bg-amber-100 rounded-full">
            ⭐ Premium
          </span>
        </div>
      )}
      {disabled && disabledMessage && (
        <p className="mt-2 text-sm text-green-600">{disabledMessage}</p>
      )}
    </div>
  );
};

export default ToolCard;