import { useAuthStore } from '@/core/stores/auth.store';
import { useState } from 'react';
import { SocialLogin } from './social-login';
import { EmailPasswordForm } from './email-password-form';
import { AuthMessages } from './auth-messages';
import { LoginHeader } from './login-header';
import { LoginFooter } from './login-footer';
import { LoginIllustration } from './login-illustration';

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

  const handleToggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setIsPasswordReset(false);
    setIsEmailVerificationSent(false);
    setPendingUser(null);
    setConfirmPassword('');
  };

  const handleBackToSignIn = () => {
    setIsEmailVerificationSent(false);
    setPendingUser(null);
    setIsSignUp(false);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <LoginHeader />
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <SocialLogin onGoogleLogin={handleGoogleLogin} isAuthenticating={isAuthenticating} />

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">or</span>
              </div>
            </div>

            <EmailPasswordForm
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              isSignUp={isSignUp}
              isAuthenticating={isAuthenticating}
              onEmailChange={setEmail}
              onPasswordChange={setPassword}
              onConfirmPasswordChange={setConfirmPassword}
              onToggleSignUp={handleToggleSignUp}
              onPasswordReset={handlePasswordReset}
              onSubmit={handleEmailSubmit}
            />

            <AuthMessages
              error={error}
              isPasswordReset={isPasswordReset}
              isEmailVerificationSent={isEmailVerificationSent}
              email={email}
              onResendVerification={handleResendVerification}
              onBackToSignIn={handleBackToSignIn}
              isAuthenticating={isAuthenticating}
            />

            <LoginFooter />
          </div>
        </div>
      </div>

      <LoginIllustration />
    </div>
  );
};