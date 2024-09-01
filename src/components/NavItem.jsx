export default function NavItem({ isActive, children, setActiveNavItem }) {
  return (
    <li>
      <a
        onClick={() => {
          if (!isActive) setActiveNavItem(children);
          else setActiveNavItem(null);
        }}
        className={`block px-3 py-2 rounded-md ${
          isActive ? "bg-sky-500 text-white" : "bg-slate-50"
        }`}
      >
        {children}
      </a>
    </li>
  );
}
