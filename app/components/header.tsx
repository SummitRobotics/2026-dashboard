'use client';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import "./header.css";

export default function Header() {
    const pathname = usePathname();

    const links = [
        { name: 'Match Strategy', href: '/matchStrategy' },
        { name: 'Teams', href: '/teams' },
        { name: 'Alliance Builder', href: '/allianceBuilder' },
    ];

    function toggleNavMenu(){
        const menu = document.querySelector('#menu') as HTMLElement | null;
        if (!menu) return;
        menu.classList.toggle('hidden');
    };

    return (
        <header>
            <nav id="mainNav" className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 px-4 text-lg">
            <h1>
                <a href="/">5468 Chaos Theory</a>
            </h1>

            <svg xmlns="http://www.w3.org/2000/svg" id="menu-button" onClick={toggleNavMenu} className="h-6 w-6 cursor-pointer md:hidden block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>

            <div className="hidden w-full md:flex md:items-center md:w-auto" id="menu">
                <ul className="pt-4 text-base md:flex md:justify-between md:pt-0">
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <li>
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="rounded-sm p-8 md:p-4 py-2 block hover:bg-color-chaos"
                                >
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
                </div>
            </nav>
        </header>
    );
}
