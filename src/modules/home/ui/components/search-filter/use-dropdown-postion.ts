import { Ref, RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };
    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240; // width of the dropdown=w-60=15rem= 240px
    //Calculate the initial position of the dropdown
    const top = rect.bottom + window.scrollY; // bottom of the button + scroll position
    let left = rect.left + window.scrollX;

    if (left + dropdownWidth > window.innerWidth) {
      // If the dropdown goes beyond the right edge of the screen, adjust its position

      left = rect.right + window.scrollX - dropdownWidth; // right of the button - dropdown width
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16; // If it goes beyond the left edge, set it to the left edge
      }
    }
    //Ensure dropdown does'nt go off left edge of the screen
    if (left < 0) {
      left = 16; // If it goes beyond the left edge, set it to the left edge
    }
    return { top, left };
  };
  return {
    getDropdownPosition,
  };
};
