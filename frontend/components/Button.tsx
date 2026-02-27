import Link from 'next/link';

type ButtonProps = {
    href?: string;
    onClick?: () => void;
    variant?: 'primary' | 'outline' | 'gray';
    children: React.ReactNode;
    className?: string;
}

export default function Button({ href, onClick, variant = 'primary', children, className = '' }: ButtonProps) {
    const styles = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50',
        gray: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
    };

    const base = `px-5 py-2 rounded-full text-sm font-medium transition ${styles[variant]} ${className}`;

    if (href) {
        return <Link href={href} className={base}>{children}</Link>;
    }

    return <button onClick={onClick} className={base}>{children}</button>;
}