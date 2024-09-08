export default function Nav({ children }) {
  return (
    <nav className="text-sm font-medium justify-center flex fixed top-1 bg-transparent w-full z-50">
      <ul className="flex space-x-3">{children}</ul>
    </nav>
  );
}
