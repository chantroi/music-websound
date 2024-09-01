export default function Nav({ children }) {
  return (
    <nav className="py-4 px-6 text-sm font-medium justify-center flex">
      <ul className="flex space-x-3">{children}</ul>
    </nav>
  );
}
