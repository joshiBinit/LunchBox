const RupeeIcon = ({
  size = 24,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <text
      x="0"
      y="20"
      fontSize="18"
      fontFamily="Arial, sans-serif"
      fill={color}
    >
      रु
    </text>
  </svg>
);

export default RupeeIcon;
