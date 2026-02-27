import Link from 'next/link';
import FilterBar from './filter';
import JobCard from '../../components/JobCard';

async function getJobs(location?: string, status?: string) {
    const params = new URLSearchParams();
    if (location) params.set('location', location);
    if (status) params.set('status', status);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs?${params.toString()}`);
    return res.json();
    
}

export default async function JobsPage({ searchParams }: { searchParams: Promise<{ location?: string, status?: string }> }) {
    const { location, status } = await searchParams;
    const response = await getJobs(location, status);
    const jobs = response.data;

    return (
        <main className="min-h-screen bg-gray-50 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Listings</h1>
            <FilterBar />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job: any) => (
                  <JobCard key={job.id} job={job} />
                ))}
            </div>
        </main>
    );
}