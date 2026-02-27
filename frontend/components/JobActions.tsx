'use client';

import { useRouter } from 'next/navigation';

export default function JobActions({ jobId }: { jobId: number }) {
    const router = useRouter();

    async function handleDelete() {
        if (!confirm('Are you sure you want to delete this job?')) return;

        const res = await fetch(`/api/jobs/${jobId}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            router.push('/jobs');
        }
    }

    return (
      
        <div className="flex gap-3 mt-6">
            <a
                href={`/jobs/${jobId}/edit`}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
                Edit Job
            </a>
            <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition"
            >
                Delete Job
            </button>
        </div>
    );
      
}