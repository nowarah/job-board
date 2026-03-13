import JobCard from '../components/JobCard';
import Button from '../components/Button';

async function getStats() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs`);
    const data = await res.json();
    return data.total;
}

async function getLatestJobs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs?limit=3`);
    const data = await res.json();
    return data.data;
}

export default async function HomePage() {
    const total = await getStats();
    const latestJobs = await getLatestJobs();

    return (
        <main className="min-h-screen bg-white">

            <section className="text-center py-24 px-8 bg-gradient-to-b from-blue-50 to-white">
                <span className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-4 inline-block">
                    🚀 {total} Jobs Available
                </span>
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Find Your Next <br />
                    <span className="text-blue-600">Tech Job in Spain</span>
                </h1>
                <p className="text-gray-500 text-lg mb-10 max-w-xl mx-auto">
                    Connecting developers with the best tech companies across Spain.
                </p>
                <Button href="/jobs" className="px-8 py-4 text-lg shadow-lg">
                    Explore Jobs →
                </Button>
            </section>

            <section className="flex justify-center gap-16 py-16 border-y border-gray-100">
                {[
                    { label: 'Jobs Available', value: total },
                    { label: 'Cities', value: 4 },
                    { label: 'Companies', value: 4 },
                ].map((stat) => (
                    <div key={stat.label} className="text-center">
                        <p className="text-4xl font-extrabold text-blue-600">{stat.value}</p>
                        <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
                    </div>
                ))}
            </section>

            <section className="py-20 px-8 max-w-5xl mx-auto">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Opportunities</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {latestJobs.map((job: { id: number; title: string; description: string; salary: number | null; location: string; status: string; company: { id: number; name: string } }) => (
                        <JobCard key={job.id} job={job} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Button href="/jobs" variant="outline" className="px-8 py-3">
                        View All Jobs →
                    </Button>
                </div>
            </section>
        </main>
    );
}