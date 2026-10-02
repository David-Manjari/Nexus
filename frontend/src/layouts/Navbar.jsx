import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

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
                        <Link className="nav-item" to={`/${page.id}`} key={page.id}>
                            {page.label}
                        </Link>
                    ))}
                </nav>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#cbd5e1' }}>{user.name}</span>
                        <button type="button" onClick={handleLogout} style={{ padding: '8px 12px', borderRadius: '8px' }}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
