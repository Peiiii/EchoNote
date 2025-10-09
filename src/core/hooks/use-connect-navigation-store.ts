import { navigationStore } from "@/core/stores/navigation.store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useConnectNavigationStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetPath = navigationStore(state => state.targetPath);
  const currentPath = navigationStore(state => state.currentPath);

  useEffect(() => {
    if (targetPath) {
      navigate(targetPath);
      navigationStore.getState().navigate(null);
    }
  }, [targetPath, navigate]);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      navigationStore.getState().setCurrentPath(location.pathname);
    }
  }, [location.pathname, currentPath]);
};
