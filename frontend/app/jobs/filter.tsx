'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function FilterBar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [location, setLocation] = useState(searchParams.get('location') ?? '');
    const [status, setStatus] = useState(searchParams.get('status') ?? '');
    const [cities, setCities] = useState<string[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/locations`)
            .then(res => res.json())
            .then(data => setCities(data));
    }, []);

    function handleSearch(newLocation: string, newStatus: string) {
        const params = new URLSearchParams();
        if (newLocation) params.set('location', newLocation);
        if (newStatus) params.set('status', newStatus);
        router.push(`${pathname}?${params.toString()}`);
    }

    function handleLocationChange(value: string) {
        setLocation(value);
        handleSearch(value, status); 
    }

    function handleStatusChange(value: string) {
        setStatus(value);
        handleSearch(location, value); 
    }

    function handleReset() {
        setLocation('');
        setStatus('');
        router.push(pathname);
    }

    return (
        <div className="flex gap-3 mb-8 flex-wrap">
            <select
                value={location}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">All Cities</option>
                {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>

            <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
            </select>

            <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
                Reset
            </button>
        </div>
    );
}