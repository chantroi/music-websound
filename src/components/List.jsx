export default function List({ children }) {
  return <ul className="divide-y divide-slate-300 bg-slate-300 fixed top-20 bottom-20 left-1 right-1 overflow-y-auto">{children}</ul>;
}
