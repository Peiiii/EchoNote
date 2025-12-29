import type { ExtensionDefinition } from "@cardos/extension";
import { useEffect, useRef, useState } from "react";
import { extensionManager } from "@/core/services/extension-manager.service";

export const useExtensions = (extensions: ExtensionDefinition<unknown>[]) => {
  const [initialized, setInitialized] = useState(false);
  const processedExtensionsRef = useRef<Set<string>>(new Set());

  // Register extensions (only on first load or when new ones are added)
  useEffect(() => {
    extensions.forEach(extension => {
      const extensionId = extension.manifest.id;
      if (!extensionManager.getExtension(extensionId)) {
        extensionManager.registerExtension(extension);
      }
    });
  }, [extensions]);

  // Activate extensions (only on first load or when new ones are added)
  useEffect(() => {
    const currentExtensionIds = new Set(extensions.map(ext => ext.manifest.id));
    const processedIds = processedExtensionsRef.current;

    // Activate new extensions
    extensions.forEach(extension => {
      const extensionId = extension.manifest.id;
      if (!processedIds.has(extensionId)) {
        extensionManager.activateExtension(extensionId);
        processedIds.add(extensionId);
      }
    });

    // Deactivate extensions that are no longer needed
    const idsToDeactivate = Array.from(processedIds).filter(id => !currentExtensionIds.has(id));
    idsToDeactivate.forEach(extensionId => {
      extensionManager.deactivateExtension(extensionId);
      processedIds.delete(extensionId);
    });

    setInitialized(true);
  }, [extensions]);

  // Cleanup function (when component unmounts)
  useEffect(() => {
    return () => {
      const processedIds = processedExtensionsRef.current;
      const idsToCleanup = Array.from(processedIds);
      idsToCleanup.forEach(extensionId => {
        extensionManager.deactivateExtension(extensionId);
      });
      processedIds.clear();
    };
  }, []);

  return {
    initialized,
  };
};
