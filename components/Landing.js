import LinkButton from "./LinkButton";

function Landing() {
  return (
    <div className="h-screen w-full bg-white dark:bg-black text-black dark:text-white">
      <div className="w-full p-4 flex items-center justify-between">
        <p className="text-xl font-semibold">hypercomms</p>
        <LinkButton
          href="/signIn"
          text="Sign in"
          className={"bg-purple-500 text-white"}
        />
      </div>
      <div className="flex items-center justify-center flex-1">
        <p className="text-3xl font-semibold ">It's hyperchat but better!</p>
      </div>
    </div>
  );
}

export default Landing;
