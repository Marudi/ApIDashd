
// Generate a random color for user collaboration
export const getRandomColor = () => {
  const colors = [
    '#ef4444', '#f97316', '#f59e0b', '#16a34a', 
    '#0ea5e9', '#8b5cf6', '#c026d3', '#ec4899'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};
