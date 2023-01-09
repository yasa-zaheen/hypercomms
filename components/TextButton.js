function TextButton({ text, className, onClick, submit }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg duration-200 ease-in-out active:brightness-90 ${className}`}
      type={submit ? "submit" : "button"}
    >
      {text}
    </button>
  );
}

export default TextButton;
