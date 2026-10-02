import NotificationBell from "../components/NotificationBell";

export const PAGE_LINKS = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'requests', label: 'Requests' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'approvals', label: 'Approvals' },
    { id: 'disbursements', label: 'Disbursements' },
    { id: 'projects', label: 'Projects' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'admin', label: 'Admin' },
];

export default function Navbar({ currentPage }) {
    return (
        <header className="app-header">
            <div className="header-inner">
                <span className="brand">NEXUS</span>
                <nav className="primary-nav" aria-label="Main navigation">
                    {PAGE_LINKS.map((page) => page.id === currentPage ? (
                        <span className="nav-item nav-item-current" aria-current="page" key={page.id}>
                            {page.label}
                        </span>
                    ) : (
                        <a className="nav-item" href={`#/${page.id}`} key={page.id}>
                            {page.label}
                        </a>
                    ))}
                </nav>
                <NotificationBell />
            </div>
        </header>
    );
}