function IconButton({ Icon, className, onClick, submit }) {
  return (
    <button
      onClick={onClick}
      type={submit ? "submit" : "button"}
      className={`h-10 w-10 rounded-full flex items-center justify-center p-3 ${className} active:brightness-90 duration-75 ease-in-out`}
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}

export default IconButton;
