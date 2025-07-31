function Spinner({ size = "medium" }) {
  const fontSizes = {
    small: "text-[30px]",
    medium: "text-[45px]",
    large: "text-[70px]",
  };

  return (
    <div className="flex justify-center items-center">
      <span
        className={`loader text-slate-800 ${fontSizes[size]}`}
        aria-label="Loading"
      >
        Loading
      </span>
    </div>
  );
}

export default Spinner;
