import { useState, useRef, useCallback } from "react";

/**
 * Custom hook for handling scroll-to-top functionality in FlatList
 * @returns {Object} An object containing scroll-related state and handlers
 */
const useScrollToTop = () => {
  const flatListRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");

  const handleScroll = useCallback(
    (event) => {
      const { contentOffset } = event.nativeEvent;
      const { y } = contentOffset;

      if (y > offset) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }
      setOffset(y);
    },
    [offset]
  );

  const scrollToTop = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  const scrollToOffset = useCallback((targetOffset) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({
        offset: targetOffset,
        animated: true,
      });
    }
  }, []);

  const showScrollToTop = scrollDirection === "down" && offset > 0;

  return {
    flatListRef,
    offset,
    scrollDirection,
    handleScroll,
    scrollToTop,
    scrollToOffset,
    showScrollToTop,
  };
};

export default useScrollToTop;
