import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Overview", to: "/" },
  { label: "Campaigns", to: "/campaigns" },
  { label: "Donor", to: "/donor" },
  { label: "Verifier", to: "/verifier" },
];

function Navbar() {
  return (
    <header className="nav-bar">
      <div className="nav-brand">
        <span className="nav-brand__title">Charity Donation Platform</span>
        <span className="muted">Ganache + MetaMask + React prototype</span>
      </div>
      <nav className="nav-links" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
