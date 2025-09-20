import { RxEvent } from '@/common/lib/rx-event'

export type ReadMoreStatus = {
  messageId: string
  long: boolean
  expanded: boolean
  collapseInlineVisible?: boolean
}

class ReadMoreBus {
  statusChanged$ = new RxEvent<ReadMoreStatus>()
  requestCollapse$ = new RxEvent<{ messageId: string }>()
}

export const readMoreBus = new ReadMoreBus()

