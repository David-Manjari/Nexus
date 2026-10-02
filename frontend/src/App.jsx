import { useEffect, useState } from 'react';
import AppLayout from './layouts/AppLayout';
import { PAGE_LINKS } from './layouts/Navbar';

function getActivePage() {
    const pageId = window.location.hash.replace(/^#\/?/, '');
    return PAGE_LINKS.find((page) => page.id === pageId) ?? PAGE_LINKS[0];
}

export default function App() {
    const [activePage, setActivePage] = useState(getActivePage);

    useEffect(() => {
        const updatePage = () => setActivePage(getActivePage());
        window.addEventListener('hashchange', updatePage);
        return () => window.removeEventListener('hashchange', updatePage);
    }, []);

    return (
        <AppLayout activePage={activePage.id}>
            <main className="page-content">
                <p className="page-eyebrow">ShopFlow workspace</p>
                <h1>{activePage.label}</h1>
            </main>
        </AppLayout>
    );
}
