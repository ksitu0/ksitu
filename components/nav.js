import Link from 'next/link'
import { useEffect } from 'react'
import { CgArrowLeft, CgDarkMode } from 'react-icons/cg'
import {useTheme} from 'next-themes'
import Router, { useRouter } from 'next/router'

import {RiHomeLine} from 'react-icons/ri'
import {FaGithub} from 'react-icons/fa'


const links = [
    { label: "Philosophy", href: "/philosophy" },
    { label: "Me and my Projects", href: "/" },
]

export default function Nav(props) {
    const {theme, setTheme} = useTheme()
    const router = useRouter()
    
    return (
        <nav className="dark:text-white">
            <ul className="sticky top-0 flex flex-wrap sm:justify-between items-end sm:items-center p-4 sm:p-8 mt-0">
                <li className="hidden sm:block">
                    <Link href={router.pathname =="/" ? "https://github.com/ksitu0": "/"}>
                    <div className="p-2 rounded-full hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 transform duration-200">
                        {router.pathname == "/" ? <FaGithub size={24}/> : <RiHomeLine size={24} />}
                        </div>
                        </Link>
                </li>
                <ul className={`mx-auto sm:mx-0 flex flex-row space-x-5`}>
                    {links.map(({ href, label }) => (
                        <li className="self-center" key={`${href}${label}`}>
                            <Link href={href}>
                                <a className={`text-xs sm:text-base font-inter px-4 py-2 rounded hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10`}>
                                    {label}
                                </a>
                            </Link>
                        </li>
                    ))}
                    <li>
                        <button
                            onClick={() => {
                                setTheme(theme === 'dark' ? 'light' : 'dark');
                                document.querySelector("#theme_toggle").classList.toggle("rotate-180");
                            }}
                            className="p-2 rounded-full hover:bg-black dark:hover:bg-white hover:bg-opacity-10 dark:hover:bg-opacity-10 transform duration-200" id="theme_toggle">
                            <CgDarkMode size={24} />
                        </button>
                    </li>
                </ul>
            </ul>
        </nav>
    )
}