export class ScrollManager {
    private scrollContainerRef: React.RefObject<HTMLDivElement | null> | null = null;
    setScrollContainerRef = (ref: React.RefObject<HTMLDivElement | null>) => {
        this.scrollContainerRef = ref;
    }
    getScrollContainer = () => {
        return this.scrollContainerRef?.current;
    }
}