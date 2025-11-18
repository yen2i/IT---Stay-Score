import { MapPin } from 'lucide-react';

export function Header({ onLogoClick }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
            <MapPin className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Stay Score
            </div>
            <div className="text-gray-500">여행 안전 인텔리전스</div>
          </div>
        </button>
      </div>
    </header>
  );
}
