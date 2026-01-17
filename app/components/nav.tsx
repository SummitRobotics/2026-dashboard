'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function Navbar() {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/' },
        { name: 'Next Match', href: '/nextMatch' },
        { name: 'Teams', href: '/teams' },
    ];

    return (
        <nav className="w-80 h-screen bg-green-950 flex flex-col shrink-0">
            <div className="bg-lime-900 h-24 flex items-center justify-center mb-4">
                <p className="text-3xl font-bold">5468 Dashboard</p>
            </div>
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`
                            m-3 h-20 rounded-lg border border-lime-950 
                            flex items-center justify-center transition-colors
                            ${isActive ? 'bg-lime-600' : 'bg-lime-800 hover:bg-lime-700'}
                        `}
                    >
                        <span className="text-3xl">{link.name}</span>
                    </Link>
                );
            })}
        </nav>
    );
}