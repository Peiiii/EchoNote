import { useCallback, useEffect, useRef, useState } from 'react'
import { GlobalCollapseController } from '../controllers/global-collapse.controller'

export function useGlobalCollapse(containerRef: React.RefObject<HTMLDivElement | null>) {
  const controllerRef = useRef<GlobalCollapseController | null>(null)
  const [showCollapse, setShow] = useState(false)

  useEffect(() => {
    const ctl = new GlobalCollapseController(containerRef)
    controllerRef.current = ctl
    const unsub = ctl.changed$.listen(() => setShow(ctl.showCollapse))
    setShow(ctl.showCollapse)
    return () => { unsub(); ctl.dispose(); controllerRef.current = null }
  }, [containerRef])

  const handleScroll = useCallback(() => { controllerRef.current?.handleScroll() }, [])
  const collapseCurrent = useCallback(() => { controllerRef.current?.collapseCurrent() }, [])

  return { showCollapse, handleScroll, collapseCurrent } as const
}

