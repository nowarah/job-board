import Link from 'next/link';

type Job = {
    id: number;
    title: string;
    description: string;
    salary: number | null;
    location: string;
    status: string;
    company: { id: number; name: string };
}

export default function JobCard({ job }: { job: Job }) {
    return (
        <Link href={`/jobs/${job.id}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer h-full">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">{job.title}</h2>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {job.status}
                    </span>
                </div>
                <p className="text-blue-600 font-medium text-sm mb-2">{job.company.name}</p>
                <p className="text-gray-500 text-sm mb-3">📍 {job.location}</p>
                <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                <p className="text-gray-900 font-semibold mt-4">
                    {job.salary ? `€${job.salary.toLocaleString()}` : 'Salary not specified'}
                </p>
            </div>
        </Link>
    );
}