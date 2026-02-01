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
        <header className="bg-white dark:bg-black p-4 shadow-md">
            <nav id="mainNav" className="flex flex-wrap items-center justify-between w-full py-4 md:py-0 text-lg">
                <h1 className="font-chaos text-chaos text-left uppercase">
                    Chaos Theory
                </h1>

                <svg xmlns="http://www.w3.org/2000/svg" id="menu-button" onClick={toggleNavMenu} className="h-6 w-6 cursor-pointer md:hidden block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>

                <div className="hidden w-full md:flex md:items-center md:w-auto" id="menu">
                    <ul className="pt-4 text-base md:flex md:justify-between md:pt-0">
                        {links.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <li key={link.href} className="ml-2">
                                    <Link
                                        href={link.href}
                                        className={`rounded-full py-2 px-4 text-black border-1 border-summit-grey-100 hover:border-chaos-300 [&.active]:border-chaos-300 bg-white hover:bg-chaos [&.active]:bg-chaos ${isActive ? 'active' : ''}`}
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
