import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function SearchBar({ onSearch, isLoading, initialValue = '' }) {
  const [location, setLocation] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (location.trim()) {
      onSearch(location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          type="text"
          placeholder="장소나 주소를 입력하세요 (예: 서울 강남구 역삼동)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="pl-10 h-12 bg-white border-gray-300 shadow-sm"
          disabled={isLoading}
        />
      </div>
      <Button
        type="submit"
        disabled={isLoading || !location.trim()}
        className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            분석 중
          </>
        ) : (
          '분석하기'
        )}
      </Button>
    </form>
  );
}
