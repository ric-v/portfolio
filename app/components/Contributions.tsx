type Props = {
  children: React.ReactNode;
};

const Contributions = ({ children }: Props) => {
  return (
    <>
      <p className="text-md md:text-xl mt-2 text-slate-800 dark:text-sky-300">
        Major roles played and contributions
      </p>
      <ul className="text-xs md:text-lg list-disc text-slate-700 dark:text-slate-300 mt-2">
        {children}
      </ul>
    </>
  );
};

export default Contributions;
