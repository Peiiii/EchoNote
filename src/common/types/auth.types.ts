export enum AuthStep {
  IDLE = 'idle',
  AUTHENTICATING = 'authenticating',
  VERIFYING_EMAIL = 'verifying-email',
  INITIALIZING_DATA = 'initializing-data',
  COMPLETE = 'complete',
  ERROR = 'error'
}

export enum AuthMessage {
  CONNECTING_GOOGLE = 'Connecting to Google...',
  VERIFYING_CREDENTIALS = 'Verifying credentials...',
  CHECKING_EMAIL_VERIFICATION = 'Checking email verification...',
  SETTING_UP_WORKSPACE = 'Setting up your workspace...',
  WELCOME_BACK = 'Welcome back!',
  SIGN_IN_FAILED = 'Sign-in failed. Please try again.',
  CHECK_CREDENTIALS = 'Sign-in failed. Please check your credentials.',
  CREATING_ACCOUNT = 'Creating your account...',
  SENDING_VERIFICATION = 'Sending verification email...',
  ACCOUNT_CREATED = 'Account created successfully!'
}

export enum AuthProgress {
  START = 0,
  AUTHENTICATING = 25,
  VERIFYING_EMAIL = 50,
  INITIALIZING_DATA = 75,
  COMPLETE = 100
}
