function TextButton({ text, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-black text-white duration-200 ease-in-out active:brightness-90 ${className}`}
    >
      {text}
    </button>
  );
}

export default TextButton;
