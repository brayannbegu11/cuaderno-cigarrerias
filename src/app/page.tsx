import Link from 'next/link';
import { businesses } from './helpers/businesses';

export default function HomePage() {
  return (
    <div className="p-8 bg-gray-800 min-h-screen text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
        Lista de Negocios
      </h1>
      <ul className="space-y-4">
        {businesses.map((business) => (
          <li key={business.id} className="flex justify-between items-center p-4 bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <span className="text-lg font-semibold text-blue-300">{business.name}</span>
            <Link
              href={`/${business.id}`}
              className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg shadow-md transition-all transform hover:scale-105"
            >
              Ir al Negocio
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
