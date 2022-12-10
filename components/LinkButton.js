import Link from "next/link";

function LinkButton({ href, text, className }) {
  return (
    <div
      className={`px-4 py-2 rounded-3xl flex items-center justify-center ${className}`}
    >
      <Link href={href}>{text}</Link>
    </div>
  );
}

export default LinkButton;
