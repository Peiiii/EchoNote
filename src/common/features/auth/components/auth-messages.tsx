interface AuthMessagesProps {
  error: string;
  isPasswordReset: boolean;
  isEmailVerificationSent: boolean;
  email: string;
  onResendVerification: () => void;
  onBackToSignIn: () => void;
  isAuthenticating: boolean;
}

export const AuthMessages = ({
  error,
  isPasswordReset,
  isEmailVerificationSent,
  email,
  onResendVerification,
  onBackToSignIn,
  isAuthenticating
}: AuthMessagesProps) => {
  return (
    <>
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
          {error}
        </div>
      )}

      {isPasswordReset && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
          Password reset email sent! Check your inbox.
        </div>
      )}

      {isEmailVerificationSent && (
        <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="font-medium mb-1">Check your email</div>
          <div className="text-xs">
            We've sent a verification link to <strong>{email}</strong>. Click the link to complete registration.
          </div>
          <div className="mt-2 flex gap-2">
            <button
              onClick={onResendVerification}
              disabled={isAuthenticating}
              className="text-xs text-green-600 hover:text-green-800 underline underline-offset-2 disabled:opacity-50"
            >
              Resend link
            </button>
            <span className="text-xs text-green-500">•</span>
            <button
              onClick={onBackToSignIn}
              className="text-xs text-green-600 hover:text-green-800 underline underline-offset-2"
            >
              Back to sign in
            </button>
          </div>
        </div>
      )}
    </>
  );
};
