import { useState } from 'react';
import { User } from 'firebase/auth';
import { Button } from '@/common/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/common/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/common/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/common/components/ui/tooltip';
import { LogOut } from 'lucide-react';
import { firebaseAuthService } from '@/common/services/firebase';
import { LoginButton } from '@/common/features/auth/components/login-button';

interface UserProfileProps {
  user: User | null; // Firebase User
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="px-2 py-1">
              <LoginButton />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Sign in to sync your data</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const handleLogout = async () => {
    try {
      await firebaseAuthService.signOut();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                  <AvatarFallback className="text-xs">
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" className="w-64 p-3">
              <div className="space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || undefined} alt="User avatar" />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="text-center">
            <p className="font-medium">{user.displayName || 'User'}</p>
            <p className="text-xs text-slate-400">{user.email}</p>
            <p className="text-xs text-slate-500">Click to manage account</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
