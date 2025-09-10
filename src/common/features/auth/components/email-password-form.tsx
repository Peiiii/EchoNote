import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { useState } from 'react';

interface EmailPasswordFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  isSignUp: boolean;
  isAuthenticating: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onToggleSignUp: () => void;
  onPasswordReset: () => void;
  onSubmit: () => void;
}

export const EmailPasswordForm = ({
  email,
  password,
  confirmPassword,
  isSignUp,
  isAuthenticating,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onToggleSignUp,
  onPasswordReset,
  onSubmit
}: EmailPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-4">
      <Input
        type="email"
        name="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="w-full h-12 text-sm rounded-xl border-slate-200 focus:border-slate-400 focus:ring-slate-400"
        disabled={isAuthenticating}
        autoComplete="email"
      />

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="w-full h-12 text-sm rounded-xl border-slate-200 focus:border-slate-400 focus:ring-slate-400 pr-10"
          disabled={isAuthenticating}
          autoComplete={isSignUp ? "new-password" : "current-password"}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          disabled={isAuthenticating}
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>

      {isSignUp && (
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            className="w-full h-12 text-sm rounded-xl border-slate-200 focus:border-slate-400 focus:ring-slate-400 pr-10"
            disabled={isAuthenticating}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            disabled={isAuthenticating}
          >
            {showConfirmPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      )}

      <Button
        onClick={onSubmit}
        disabled={
          isAuthenticating || 
          !email || 
          !password || 
          (isSignUp && (!confirmPassword || password !== confirmPassword || password.length < 6))
        }
        className="w-full h-12 text-sm font-medium rounded-xl bg-slate-600 hover:bg-slate-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        size="lg"
      >
        {isAuthenticating ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
          </div>
        ) : (
          isSignUp ? 'Create Account' : 'Sign In'
        )}
      </Button>

      <div className="text-center">
        <button
          onClick={onToggleSignUp}
          className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2"
          disabled={isAuthenticating}
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>
      </div>

      {!isSignUp && (
        <div className="text-center">
          <button
            onClick={onPasswordReset}
            className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline underline-offset-2"
            disabled={isAuthenticating || !email}
          >
            Forgot your password?
          </button>
        </div>
      )}
    </form>
  );
};
