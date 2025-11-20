import { MapPin } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { UpdatedRegions } from './UpdatedRegions';
import { RegionSelector } from './RegionSelector';   // ⭐ 추가
import { useState } from 'react';

export function Hero({ onSearch, isLoading }) {
  const [region, setRegion] = useState('chicago'); // ⭐ 현재 선택된 지역 상태

  const handleSearch = (address) => {
    onSearch(address, region); // ⭐ 지역 포함해서 검색
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <div className="mb-8 inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
        <MapPin className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Stay Score
      </h1>

      <p className="text-gray-600 mb-12 max-w-2xl">
        여행지의 안전성, 접근성, 편의성을 한눈에 확인하세요.
        <br />
        데이터 기반 인텔리전스로 더 안전하고 편리한 여행을 계획하세요.
      </p>

      
      {/* 검색바 */}
      <div className="w-full max-w-2xl">
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* 지원 지역 안내 */}
      <UpdatedRegions />
    </div>
  );
}
