import { firebaseConfig } from '@/common/config/firebase.config';

export const useGoogleAuthSupport = () => {
  return {
    isGoogleAuthSupported: firebaseConfig.supportGoogleAuth(),
    isInCNRegion: firebaseConfig.isInCNRegion(),
  };
};
