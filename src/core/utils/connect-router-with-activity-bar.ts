import { navigationStore } from "@/core/stores/navigation.store";
import { useActivityBarStore } from "@/core/stores/activity-bar.store";

/**
 * Route configuration examples:
 *
 * ```typescript
 * // Basic route configuration
 * const basicRoutes: RouteConfig[] = [
 *   {
 *     activityKey: "home",
 *     routerPath: "/",
 *     matchOptions: { exact: true }
 *   },
 *   {
 *     activityKey: "chat",
 *     routerPath: "/chat"
 *   }
 * ];
 *
 * // Routes with dynamic parameters
 * const dynamicRoutes: RouteConfig[] = [
 *   {
 *     activityKey: "chat",
 *     routerPath: "/chat",
 *     children: [
 *       {
 *         activityKey: "chat-detail",
 *         routerPath: "/chat/:id"
 *       },
 *       {
 *         activityKey: "chat-settings",
 *         routerPath: "/chat/:id/settings"
 *       }
 *     ]
 *   }
 * ];
 *
 * // Routes with wildcards
 * const wildcardRoutes: RouteConfig[] = [
 *   {
 *     activityKey: "settings",
 *     routerPath: "/settings/*"
 *   },
 *   {
 *     activityKey: "profile",
 *     routerPath: "/profile/*"
 *   }
 * ];
 *
 * // Complex nested routes
 * const nestedRoutes: RouteConfig[] = [
 *   {
 *     activityKey: "workspace",
 *     routerPath: "/workspace",
 *     children: [
 *       {
 *         activityKey: "workspace-projects",
 *         routerPath: "/workspace/projects",
 *         children: [
 *           {
 *             activityKey: "workspace-project-detail",
 *             routerPath: "/workspace/projects/:projectId"
 *           }
 *         ]
 *       },
 *       {
 *         activityKey: "workspace-settings",
 *         routerPath: "/workspace/settings"
 *       }
 *     ]
 *   }
 * ];
 *
 * // Usage example
 * function App() {
 *   useEffect(() => {
 *     // Basic usage
 *     const unsubscribe = connectRouterWithActivityBar(basicRoutes);
 *
 *     // Usage with match options
 *     const unsubscribeWithOptions = connectRouterWithActivityBar(dynamicRoutes, {
 *       exact: false,
 *       sensitive: true
 *     });
 *
 *     return () => {
 *       unsubscribe();
 *       unsubscribeWithOptions();
 *     };
 *   }, []);
 *
 *   return <div>...</div>;
 * }
 * ```
 */

/**
 * example:
 * 
 * // const routerToActivityBarMap = {
//   "/": "home",
//   "/chat": "chat",
//   "/card": "card",
// };

// const activityBarToRouterMap = {
//   home: "/",
//   chat: "/chat",
//   card: "/card",
// };
 */

/**
 * Route matching options
 */
export interface RouteMatchOptions {
  /**
   * Whether to match exactly
   * @default false
   */
  exact?: boolean;
  /**
   * Whether to match case-sensitive
   * @default false
   */
  sensitive?: boolean;
}

/**
 * Route configuration item
 */
export interface RouteConfig {
  /**
   * Activity bar key
   */
  activityKey: string;
  /**
   * Route path (single)
   */
  routerPath?: string;
  /**
   * Route paths (multiple)
   */
  routerPaths?: string[];
  /**
   * Route matching options
   */
  matchOptions?: RouteMatchOptions;
  /**
   * Child route configuration
   */
  children?: RouteConfig[];
}

/**
 * Create route to activity bar mapping
 */
export function createRouterToActivityBarMap(items: RouteConfig[]) {
  const map: Record<string, string> = {};

  function processRoute(route: RouteConfig) {
    // Process single route path
    if (route.routerPath) {
      map[route.routerPath] = route.activityKey;
    }
    // Process multiple route paths
    if (route.routerPaths) {
      route.routerPaths.forEach(path => {
        map[path] = route.activityKey;
      });
    }
    // Process child routes
    if (route.children) {
      route.children.forEach(processRoute);
    }
  }

  items.forEach(processRoute);
  return map;
}

/**
 * Create activity bar to route mapping
 */
export function createActivityBarToRouterMap(items: RouteConfig[]) {
  const map: Record<string, string> = {};

  function processRoute(route: RouteConfig) {
    // Prefer routerPath, if not available use the first path from routerPaths
    const primaryPath = route.routerPath || (route.routerPaths && route.routerPaths[0]);
    if (primaryPath) {
      map[route.activityKey] = primaryPath;
    }
    if (route.children) {
      route.children.forEach(processRoute);
    }
  }

  items.forEach(processRoute);
  return map;
}

/**
 * Convert route path to regular expression
 */
function pathToRegexp(path: string, options: RouteMatchOptions = {}): RegExp {
  const { exact = false, sensitive = false } = options;

  // Handle dynamic parameters
  const pattern = path
    .replace(/:[^/]+/g, "([^/]+)") // Convert :param to ([^/]+)
    .replace(/\*/g, ".*"); // Convert * to .*

  const flags = sensitive ? "" : "i";
  const regexp = new RegExp(`^${pattern}${exact ? "$" : ""}`, flags);

  return regexp;
}

/**
 * Find matching route
 */
function findMatchingRoute(
  path: string,
  routes: RouteConfig[],
  options: RouteMatchOptions = {}
): RouteConfig | undefined {
  // Sort by priority: exact match > dynamic parameters > wildcards
  const sortedRoutes = [...routes].sort((a, b) => {
    const aHasParams =
      (a.routerPath?.includes(":") || a.routerPaths?.some(p => p.includes(":"))) ?? false;
    const bHasParams =
      (b.routerPath?.includes(":") || b.routerPaths?.some(p => p.includes(":"))) ?? false;
    const aHasWildcard =
      (a.routerPath?.includes("*") || a.routerPaths?.some(p => p.includes("*"))) ?? false;
    const bHasWildcard =
      (b.routerPath?.includes("*") || b.routerPaths?.some(p => p.includes("*"))) ?? false;

    if (aHasParams && !bHasParams) return 1;
    if (!aHasParams && bHasParams) return -1;
    if (aHasWildcard && !bHasWildcard) return 1;
    if (!aHasWildcard && bHasWildcard) return -1;
    return 0;
  });

  for (const route of sortedRoutes) {
    // Check single route path
    if (route.routerPath) {
      const regexp = pathToRegexp(route.routerPath, options);
      if (regexp.test(path)) {
        return route;
      }
    }
    // Check multiple route paths
    if (route.routerPaths) {
      for (const routePath of route.routerPaths) {
        const regexp = pathToRegexp(routePath, options);
        if (regexp.test(path)) {
          return route;
        }
      }
    }
    // Check child routes
    if (route.children) {
      const childMatch = findMatchingRoute(path, route.children, options);
      if (childMatch) {
        return childMatch;
      }
    }
  }

  return undefined;
}

/**
 * Update activity bar state based on route path
 */
function updateActivityBarByPath(
  currentPath: string,
  routes: RouteConfig[],
  options: RouteMatchOptions = {}
) {
  const matchingRoute = findMatchingRoute(currentPath, routes, options);
  if (matchingRoute) {
    useActivityBarStore.getState().setActiveId(matchingRoute.activityKey);
  }
}

/**
 * Update route path based on activity bar state
 */
function updateRouterByActivityBar(
  activeItemKey: string,
  routes: RouteConfig[],
  options: RouteMatchOptions = {}
) {
  // Find matching route configuration
  const route = routes.find(r => r.activityKey === activeItemKey);
  if (!route) return;

  // Get current path
  const currentPath = navigationStore.getState().currentPath;
  if (!currentPath) return;

  // Get all possible target paths
  const targetPaths: string[] = [];
  if (route.routerPath) {
    targetPaths.push(route.routerPath);
  }
  if (route.routerPaths) {
    targetPaths.push(...route.routerPaths);
  }
  if (route.children) {
    route.children.forEach(child => {
      if (child.routerPath) {
        targetPaths.push(child.routerPath);
      }
      if (child.routerPaths) {
        targetPaths.push(...child.routerPaths);
      }
    });
  }

  // Check if current path already matches any target path
  for (const path of targetPaths) {
    const regexp = pathToRegexp(path, options);
    if (regexp.test(currentPath)) {
      // Current path already matches, no need to redirect
      return;
    }
  }

  // Sort paths by priority
  const sortedPaths = targetPaths.sort((a, b) => {
    const aHasParams = a.includes(":");
    const bHasParams = b.includes(":");
    const aHasWildcard = a.includes("*");
    const bHasWildcard = b.includes("*");

    // First select static paths
    if (!aHasParams && bHasParams) return -1;
    if (aHasParams && !bHasParams) return 1;
    // Then select paths with parameters
    if (!aHasWildcard && bHasWildcard) return -1;
    if (aHasWildcard && !bHasWildcard) return 1;
    // Sort by path length (shorter paths first)
    return a.length - b.length;
  });

  // Select the path with the highest priority
  const targetPath = sortedPaths[0];
  if (targetPath) {
    navigationStore.getState().navigate(targetPath);
  }
}

export function mapRouterToActivityBar(routes: RouteConfig[], options: RouteMatchOptions = {}) {
  // Initialize with a mapping
  const currentPath = navigationStore.getState().currentPath;
  if (currentPath) {
    updateActivityBarByPath(currentPath, routes, options);
  }

  return navigationStore.subscribe((state, prevState) => {
    if (state.currentPath === prevState.currentPath) {
      return;
    }
    const currentPath = state.currentPath;
    if (currentPath) {
      updateActivityBarByPath(currentPath, routes, options);
    }
  });
}

export function mapActivityBarToRouter(routes: RouteConfig[]) {
  // Initialize with a mapping
  const activeItemKey = useActivityBarStore.getState().activeId;
  if (activeItemKey) {
    updateRouterByActivityBar(activeItemKey, routes);
  }

  return useActivityBarStore.subscribe((state, prevState) => {
    if (state.activeId === prevState.activeId) {
      return;
    }
    const activeItemKey = state.activeId;
    if (activeItemKey) {
      updateRouterByActivityBar(activeItemKey, routes);
    }
  });
}

/**
 * Connect routes with activity bar
 * @param routes Route configuration
 * @param options Route matching options
 * @returns Unsubscribe function
 */
export function connectRouterWithActivityBar(
  routes: RouteConfig[],
  options: RouteMatchOptions = {}
) {
  const unsubscribeRouter = mapRouterToActivityBar(routes, options);
  const unsubscribeActivityBar = mapActivityBarToRouter(routes);

  return () => {
    unsubscribeRouter();
    unsubscribeActivityBar();
  };
}
