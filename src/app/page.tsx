import Link from 'next/link';
import { businesses } from './helpers/businesses';



export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lista de Negocios</h1>
      <ul className="space-y-2">
        {businesses.map((business) => (
          <li key={business.id}>
            <Link
              href={`/${business.id}`}
              className="text-blue-500 underline hover:text-blue-700"
            >
              {business.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}