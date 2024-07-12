const randomColor = () => {
  const colors = [
    "#facc15",
    "#84cc16",
    "#22c55e",
    "#22c55e",
    "#10b981",
    "#29007a",
    "#07264a",
    "#0d007a",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default randomColor;
