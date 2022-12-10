function CustonInput({ placeholder, Icon, value, setValue }) {
  return (
    <div className="mt-4 w-full flex items-center bg-gray-50 rounded-md rounded-b-none p-2 text-sm">
      <Icon className="h-4 w-4 mr-2 text-gray-400" />
      <input
        className="bg-gray-50 rounded-md w-full outline-none"
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

export default CustonInput;
