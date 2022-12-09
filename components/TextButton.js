function TextButton({ text, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg bg-black text-white duration-200 ease-in-out hover:bg-blue-500 active:brightness-90 ${className}`}
    >
      {text}
    </button>
  );
}

export default TextButton;
