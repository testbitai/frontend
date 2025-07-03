import { useState } from "react";
import { RotateCcw } from "lucide-react";

interface ResendButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

const ResendButton = ({ onClick, isLoading }: ResendButtonProps) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (isLoading) return;
    
    setIsClicked(true);
    onClick();
    
    // Reset animation state
    setTimeout(() => setIsClicked(false), 300);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        w-full bg-gradient-to-r from-purple-600 to-indigo-600 
        hover:from-purple-700 hover:to-indigo-700 
        text-white font-semibold py-4 px-6 rounded-2xl 
        transition-all duration-300 ease-out
        transform hover:scale-[1.02] hover:shadow-xl
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-4 focus:ring-purple-500/25
        ${isClicked ? 'scale-95' : ''}
        relative overflow-hidden group
      `}
    >
      {/* Background shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      <div className="relative flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <RotateCcw className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <RotateCcw className="w-5 h-5" />
            Resend verification email
          </>
        )}
      </div>
    </button>
  );
};

export default ResendButton;
