import { useValueFromObservable } from "@/common/features/note-search/hooks/use-value-from-observable";
import { modalManager } from "./modal-manager";
import { ModalContainer } from "./modal-container";

export function ModalRenderer() {
  const instances = useValueFromObservable(modalManager.instancesObservable, []);

  return (
    <>
      {instances.map(instance => (
        <ModalContainer
          key={instance.id}
          instance={instance}
          onClose={(result) => modalManager.hide(instance.id, result)}
        />
      ))}
    </>
  );
}
