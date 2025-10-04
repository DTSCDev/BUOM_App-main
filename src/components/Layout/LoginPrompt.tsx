import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface LoginPromptProps {
  className?: string;
}

const LoginPrompt = ({ className = "" }: LoginPromptProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return null;
  }

  return (
    <div className={`absolute top-6 right-8 z-50 ${className}`}>
      {!user ? (
        <div className="backdrop-blur-sm rounded-md px-2 py-1 border border-gray-700 shadow-md flex items-center gap-2" style={{ backgroundColor: '#4FF546' }}>
          <span className="text-gray-700 text-xs font-bold">Already a BUOMer?</span>
          <Button 
            onClick={() => navigate('/auth')} 
            className="bg-gray-700 hover:bg-gray-800 font-medium px-2 py-1 text-xs"
            style={{ color: '#4FF546' }}
          >
            <LogIn className="w-3 h-3 mr-1" />
            Log In
          </Button>
        </div>
      ) : (
        <div className="backdrop-blur-sm rounded-md px-2 py-1 border border-gray-700 shadow-md flex items-center gap-2" style={{ backgroundColor: '#4FF546' }}>
          <span className="text-gray-700 text-xs font-bold">Welcome back!</span>
          <Button 
            onClick={() => navigate('/dashboard')} 
            className="bg-gray-700 hover:bg-gray-800 font-medium px-2 py-1 text-xs"
            style={{ color: '#4FF546' }}
          >
            Go to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default LoginPrompt;