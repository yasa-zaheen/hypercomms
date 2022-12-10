function IconButton({ Icon, className, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center p-3 ${className} active:brightness-90 duration-75 ease-in-out`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

export default IconButton;
