
import { GripVertical } from "lucide-react";
import { memo } from "react";

/**
 * A visible/accessible drag handle for React Flow nodes.
 * Does not interfere with node controls.
 */
export const DragHandle = memo(function DragHandle() {
  return (
    <div
      className="drag-handle absolute z-10 flex items-center justify-center bg-white/80 dark:bg-background rounded shadow border border-border hover:scale-110 transition-transform"
      style={{ 
        width: 26, 
        height: 26,
        top: -13,    // Half the height to center at corner
        right: -13,  // Half the width to center at corner
        cursor: "grab", // Enforce grab cursor for better UX
      }}
      draggable={true} // Important: Make this explicitly draggable
    >
      <GripVertical className="text-gray-400 dark:text-gray-500" size={16} />
    </div>
  );
});
