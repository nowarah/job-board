import Link from 'next/link';
import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';

export default async function Navbar() {
    noStore(); 
    const cookieStore = await cookies();
    const token = cookieStore.get('token');
    const isLoggedIn = !!token;

    return (
        <nav className="flex justify-between items-center px-10 py-5 border-b border-gray-100">
            <Link href="/" className="text-xl font-bold text-gray-900">
                JobBoard<span className="text-blue-600">.</span>
            </Link>
            <div className="flex items-center gap-3">
                {isLoggedIn ? (
                    <>
                        <Link href="/jobs/create" className="text-gray-600 text-sm font-medium hover:text-blue-600">
                            Post a Job
                        </Link>
                        <form action="/api/auth/logout" method="POST">
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition">
                                Logout
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <Link href="/auth/login" className="text-gray-600 text-sm font-medium hover:text-blue-600">
                            Sign In
                        </Link>
                        <Link href="/auth/register" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}