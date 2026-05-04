

import { useAuthStore } from "@/stores/authStore";


export default function Navbar() {
  const { logout, user } = useAuthStore();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">W</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            BetterUpTime
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-gray-600">Welcome, {user.name || 'User'}</span>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 text-gray-700 hover:text-red-600 transition-colors font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
