import { Button } from "@/common/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";
import { firebaseAuthService } from "@/common/services/firebase/firebase-auth.service";
import { useGoogleAuthSupport } from "@/common/hooks/use-google-auth-support";
import { LogIn } from "lucide-react";

export const LoginButton = () => {
  const { isGoogleAuthSupported } = useGoogleAuthSupport();

  const handleGoogleLogin = async () => {
    try {
      const user = await firebaseAuthService.signInWithGoogle();
      if (user) {
        console.log(`Welcome, ${user.displayName}!`);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (!isGoogleAuthSupported) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleGoogleLogin}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <LogIn className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <div className="text-center">
            <p className="font-medium">Sign In</p>
            <p className="text-xs text-slate-500">Click to sign in with Google</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
