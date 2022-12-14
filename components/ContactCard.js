import Avatar from "./Avatar";

function ContactCard({ data }) {
  return (
    <div
      onClick={() => {
        router.push(data.email);
      }}
      className="flex p-4 bg-gray-50 rounded-xl items-center cursor-pointer hover:brightness-95 duration-75 ease-in-out active:brightness-90"
    >
      <Avatar src={data.photoURL} />
      <div className="flex flex-col flex-1 items-start ml-4">
        <p className="text-sm">{data.displayName}</p>
        <p className="text-xs opacity-50">Hey!</p>
      </div>
      <p className="text-xs opacity-50">5m</p>
    </div>
  );
}

export default ContactCard;
