import { Plus, X } from 'lucide-react';

export function LocationSidebar({ 
  locations, 
  activeIndex, 
  onTabClick, 
  onAddTab,
  onCloseTab 
}) {

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-700';
      case 'B': return 'bg-blue-100 text-blue-700';
      case 'C': return 'bg-yellow-100 text-yellow-700';
      case 'D': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="text-gray-900 mb-1">비교할 장소</div>
        <div className="text-gray-500">검색 후 추가 버튼을 눌러주세요</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {locations.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Plus className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>아직 추가된 장소가 없습니다</p>
            <p className="text-sm mt-2">검색 후 "이 장소 추가"를 눌러주세요</p>
          </div>
        ) : (
          locations.map((location, index) => (
            <div
              key={index}
              className={`relative p-4 rounded-lg border-2 transition-all cursor-pointer group ${
                activeIndex === index
                  ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-500 shadow-md'
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              onClick={() => onTabClick(index)}
            >
              <div className="mb-3 pr-6">
                <div className="text-gray-900 mb-1 line-clamp-2">
                  {location.location}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">안전성</span>
                  <span className={`px-2 py-0.5 rounded text-sm ${getGradeColor(location.safetyGrade)}`}>
                    {location.safetyGrade}등급
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">편의성</span>
                  <span className="text-gray-900 text-sm">{location.convenienceScore}점</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">접근성</span>
                  <span className="text-gray-900 text-sm">{location.accessibilityScore}점</span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(index);
                }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ))
        )}
      </div>

      {locations.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center text-gray-600">
            총 <span className="text-blue-600">{locations.length}</span>개 장소
          </div>
        </div>
      )}
    </div>
  );
}
