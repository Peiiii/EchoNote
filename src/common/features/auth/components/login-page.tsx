import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { useAuthStore } from '@/core/stores/auth.store';
import { MessageSquare } from 'lucide-react';
import { useState } from 'react';

export const LoginPage = () => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    sendSignUpLink,
    sendPasswordReset,
    sendEmailVerification,
    isAuthenticating 
  } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [isEmailVerificationSent, setIsEmailVerificationSent] = useState(false);
  const [pendingUser, setPendingUser] = useState<{ email: string } | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (error: unknown) {
      console.error('Google login failed:', error);
      const firebaseError = error as { code?: string; message?: string };
      
      // 处理Google登录的Firebase错误
      switch (firebaseError.code) {
        case 'auth/popup-closed-by-user':
          setError('Sign-in was cancelled. Please try again.');
          break;
        case 'auth/popup-blocked':
          setError('Popup was blocked. Please allow popups and try again.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        default:
          setError('Google sign-in failed. Please try again.');
      }
    }
  };


  const handleEmailSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // 注册时的额外验证
    if (isSignUp) {
      if (!confirmPassword) {
        setError('Please confirm your password');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    try {
      setError('');
      if (isSignUp) {
        const result = await sendSignUpLink(email, password);
        if (result.verificationSent) {
          setPendingUser({ email });
          setIsEmailVerificationSent(true);
          setError('');
        }
      } else {
        await signInWithEmail(email, password);
      }
    } catch (error: unknown) {
      console.error('Email auth failed:', error);
      
      // 处理常见的Firebase错误，转换为用户友好的错误信息
      const firebaseError = error as { code?: string; message?: string };
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password');
          break;
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please check your credentials and try again.');
          break;
        case 'auth/email-already-in-use':
          setError('An account with this email already exists');
          break;
        case 'auth/weak-password':
          setError('Password should be at least 6 characters');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        case 'auth/operation-not-allowed':
          setError('This sign-in method is not enabled. Please try a different method.');
          break;
        default:
          if (firebaseError.message === 'EMAIL_NOT_VERIFIED') {
            setError('Please verify your email address before signing in. Check your inbox for a verification link.');
          } else if (firebaseError.message === 'EMAIL_ALREADY_VERIFIED') {
            setError('This email is already verified. Please sign in instead.');
          } else if (firebaseError.message === 'ACCOUNT_EXISTS_WRONG_PASSWORD') {
            setError('An account with this email already exists, but the password is incorrect. Please check your password or try signing in.');
          } else {
            setError('Authentication failed. Please check your credentials and try again.');
          }
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      setError('');
      await sendPasswordReset(email);
      setIsPasswordReset(true);
    } catch (error: unknown) {
      console.error('Password reset failed:', error);
      const firebaseError = error as { code?: string; message?: string };
      
      // 处理密码重置的Firebase错误
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many reset attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        default:
          setError('Failed to send password reset email. Please try again.');
      }
    }
  };

  const handleResendVerification = async () => {
    if (!pendingUser) {
      setError('No pending user found');
      return;
    }

    try {
      setError('');
      await sendEmailVerification();
      setIsEmailVerificationSent(true);
    } catch (error: unknown) {
      console.error('Resend verification failed:', error);
      const firebaseError = error as { code?: string; message?: string };
      
      switch (firebaseError.code) {
        case 'auth/too-many-requests':
          setError('Too many verification attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection and try again.');
          break;
        default:
          setError('Failed to resend verification email. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Brand */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
            </div>
              <span className="text-xl font-semibold text-slate-900">EchoNote</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Join EchoNote</h1>
          </div>
          
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            {/* Social Login Buttons */}
            <div className="mb-6">
            <Button
              onClick={handleGoogleLogin}
              disabled={isAuthenticating}
                className="w-full h-12 text-sm font-medium rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-900 transition-colors shadow-sm hover:shadow-md"
              size="lg"
            >
              {isAuthenticating ? (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </div>
              )}
            </Button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>


            {/* Email and Password Inputs */}
            <form onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }} className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* Confirm Password - Only show during sign up */}
              {isSignUp && (
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                  {error}
                </div>
              )}

              {/* Password Reset Success Message */}
              {isPasswordReset && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                  Password reset email sent! Check your inbox.
                </div>
              )}

              {/* Email Verification Success Message */}
              {isEmailVerificationSent && (
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="font-medium mb-1">Check your email</div>
                  <div className="text-xs">
                    We've sent a verification link to <strong>{email}</strong>. Click the link to complete registration.
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleResendVerification}
                      disabled={isAuthenticating}
                      className="text-xs text-green-600 hover:text-green-800 underline underline-offset-2 disabled:opacity-50"
                    >
                      Resend link
                    </button>
                    <span className="text-xs text-green-500">•</span>
                    <button
                      onClick={() => {
                        setIsEmailVerificationSent(false);
                        setPendingUser(null);
                        setIsSignUp(false);
                        setError('');
                        setPassword('');
                        setConfirmPassword('');
                      }}
                      className="text-xs text-green-600 hover:text-green-800 underline underline-offset-2"
                    >
                      Back to sign in
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={handleEmailSubmit}
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

              {/* Toggle between Sign In and Sign Up */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                    setIsPasswordReset(false);
                    setIsEmailVerificationSent(false);
                    setPendingUser(null);
                    setConfirmPassword('');
                    setShowConfirmPassword(false);
                  }}
                  className="text-sm text-slate-600 hover:text-slate-800 transition-colors underline underline-offset-2"
                  disabled={isAuthenticating}
                >
                  {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
                </button>
          </div>

              {/* Forgot Password */}
              {!isSignUp && (
                <div className="text-center">
                  <button
                    onClick={handlePasswordReset}
                    className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline underline-offset-2"
                    disabled={isAuthenticating || !email}
                  >
                    Forgot your password?
                  </button>
            </div>
              )}
            </form>

            {/* Terms and Privacy */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                By continuing, you agree to the{' '}
                <button className="underline underline-offset-2 hover:text-slate-700 transition-colors font-medium">
                  Terms
                </button>
                ,{' '}
                <button className="underline underline-offset-2 hover:text-slate-700 transition-colors font-medium">
                  Privacy
                </button>
                .
              </p>
            </div>

            {/* Social Icons */}
            <div className="flex justify-center gap-4 mt-6">
              <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </button>
              <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Illustration */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative overflow-hidden">
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-bold text-slate-800 mb-8">Write something good.</h2>
          
          {/* Illustration SVG */}
          <div className="relative">
            <svg width="400" height="300" viewBox="0 0 400 300" className="mx-auto">
              {/* Person sitting */}
              <g transform="translate(150, 80)">
                {/* Body */}
                <ellipse cx="0" cy="40" rx="25" ry="35" fill="none" stroke="#374151" strokeWidth="2"/>
                {/* Head */}
                <circle cx="0" cy="-10" r="20" fill="none" stroke="#374151" strokeWidth="2"/>
                {/* Hair */}
                <path d="M-15,-25 Q-20,-35 -10,-30 Q0,-40 10,-30 Q20,-35 15,-25" fill="none" stroke="#374151" strokeWidth="2"/>
                {/* Arms */}
                <path d="M-25,20 Q-35,10 -30,0" fill="none" stroke="#374151" strokeWidth="2"/>
                <path d="M25,20 Q35,10 30,0" fill="none" stroke="#374151" strokeWidth="2"/>
                {/* Legs */}
                <path d="M-15,70 L-20,100" fill="none" stroke="#374151" strokeWidth="2"/>
                <path d="M15,70 L20,100" fill="none" stroke="#374151" strokeWidth="2"/>
                {/* Hand reaching for butterfly */}
                <circle cx="30" cy="0" r="3" fill="#10b981"/>
              </g>
              
              {/* Tree/Plant behind person */}
              <g transform="translate(120, 60)">
                <path d="M0,100 Q-20,80 -15,60 Q-10,40 0,50 Q10,40 15,60 Q20,80 0,100" fill="none" stroke="#374151" strokeWidth="2"/>
                <path d="M0,50 L0,100" fill="none" stroke="#374151" strokeWidth="2"/>
              </g>
              
              {/* Butterfly */}
              <g transform="translate(180, 60)">
                <circle cx="0" cy="0" r="8" fill="#10b981"/>
                <path d="M-8,0 Q-12,-5 -8,-10 Q-4,-15 0,-10 Q4,-15 8,-10 Q12,-5 8,0" fill="none" stroke="#10b981" strokeWidth="1"/>
              </g>
              
              {/* Decorative elements */}
              <g transform="translate(50, 40)">
                <path d="M0,0 Q10,-10 20,0 Q10,10 0,0" fill="none" stroke="#374151" strokeWidth="1"/>
              </g>
              
              <g transform="translate(320, 60)">
                <path d="M0,0 Q5,-8 10,0 Q5,8 0,0" fill="none" stroke="#374151" strokeWidth="1"/>
              </g>
              
              <g transform="translate(80, 120)">
                <path d="M0,20 Q-10,10 -5,0 Q0,-10 5,0 Q10,10 0,20" fill="none" stroke="#374151" strokeWidth="1"/>
                <path d="M0,0 L0,20" fill="none" stroke="#374151" strokeWidth="1"/>
              </g>
            </svg>
          </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-10 right-10 w-8 h-8 border-2 border-slate-300 rounded-full"></div>
        <div className="absolute top-20 right-20 w-4 h-4 bg-slate-300 rounded-full"></div>
        <div className="absolute bottom-20 left-10 w-6 h-6 border border-slate-300 rounded-full"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-slate-300 rounded-full"></div>
      </div>
    </div>
  );
};