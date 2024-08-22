import React from "react";
import { useInView } from "react-intersection-observer";
type InfiniteScrollContainerProps = React.PropsWithChildren & {
  onBottomReached: () => void;
  className?: string;
};

function InfiniteScrollContainer({
  children,
  onBottomReached,
  className,
}: InfiniteScrollContainerProps) {
  const { ref } = useInView({
    rootMargin: "200px",
    onChange(inView) {
      if (inView) {
        onBottomReached();
      }
    },
  });
  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}

export default InfiniteScrollContainer;
