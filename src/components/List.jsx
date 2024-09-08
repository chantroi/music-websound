export default function List({ children }) {
  return (
    <ul className="divide-y divide-slate-300 bg-slate-300 fixed top-12 bottom-14 w-full overflow-y-auto">
      {children}
    </ul>
  );
}
