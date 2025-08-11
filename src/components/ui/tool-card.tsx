import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  emoji: string;
  title: string;
  path: string;
  isSubscription?: boolean;
}

const ToolCard = ({ emoji, title, path, isSubscription = false }: ToolCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (path === '/subscription') {
      // Handle subscription page navigation
      navigate('/subscription');
    } else {
      navigate(path);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        card-hover bg-card rounded-xl p-6 text-center shadow-card border-2
        ${isSubscription ? 'border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50' : 'border-border'}
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
    </div>
  );
};

export default ToolCard;