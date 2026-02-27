import Link from 'next/link';
import JobActions from '@/components/JobActions';
import { cookies } from 'next/headers';

async function getJob(id: string) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`);
    return res.json();
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = await getJob(id);
    const cookieStore = await cookies();
    const isLoggedIn = !!cookieStore.get('token');

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <Link href="/jobs" className="text-blue-600 text-sm mb-6 inline-block hover:underline">
                    ← Back to Jobs
                </Link>
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {job.status}
                    </span>
                </div>
                <p className="text-blue-600 font-medium mb-1">{job.company.name}</p>
                <p className="text-gray-500 text-sm mb-6">📍 {job.location}</p>
                <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>
                <p className="text-xl font-semibold text-gray-900">
                    {job.salary ? `€${job.salary.toLocaleString()}` : 'Salary not specified'}
                </p>
                {isLoggedIn && <JobActions jobId={job.id} />}
            </div>
        </main>
    );
}