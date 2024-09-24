import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="fixed bottom-0 h-24 w-full items-center flex justify-center border-t-2 border-white text-white gap-6">
            <Link href="/">home</Link>
            <Link href="/">equipment</Link>
            <Link href="/">items</Link>
        </nav>
    );
}
