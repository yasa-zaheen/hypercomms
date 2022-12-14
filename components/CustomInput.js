function CustomInput({ placeholder, Icon, value, setValue, className }) {
  return (
    <div
      className={`w-full flex items-center bg-gray-50 p-2 text-sm ${className}`}
    >
      {Icon && <Icon className="h-4 w-4 mr-2 text-gray-400" />}
      <input
        className="bg-inherit rounded-md w-full outline-none"
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </div>
  );
}

export default CustomInput;
