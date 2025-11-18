import { Plus, X } from 'lucide-react';

export function LocationTabs({
  locations,
  activeIndex,
  onTabClick,
  onAddTab,
  onCloseTab,
}) {
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'bg-green-100 text-green-700';
      case 'B':
        return 'bg-blue-100 text-blue-700';
      case 'C':
        return 'bg-yellow-100 text-yellow-700';
      case 'D':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="mb-6 -mx-4 px-4 overflow-x-auto">
      <div className="flex gap-2 min-w-max pb-2">
        <button
          onClick={onAddTab}
          className="flex items-center justify-center w-10 h-10 rounded-lg bg-white border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          title="새로운 장소 추가"
        >
          <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
        </button>

        {locations.map((location, index) => (
          <div
            key={index}
            className={`relative flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 transition-all cursor-pointer min-w-[280px] group ${
              activeIndex === index
                ? 'bg-white border-blue-500 shadow-md'
                : 'bg-white/60 border-gray-200 hover:border-gray-300 hover:bg-white'
            }`}
            onClick={() => onTabClick(index)}
          >
            <div className="flex-1 min-w-0">
              <div className="text-gray-900 truncate mb-1">
                {location.location}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${getGradeColor(
                    location.safetyGrade,
                  )}`}
                >
                  안전 {location.safetyGrade}
                </span>
                <span className="text-gray-500 text-xs">
                  편의 {location.convenienceScore}점
                </span>
                <span className="text-gray-500 text-xs">
                  접근 {location.accessibilityScore}점
                </span>
              </div>
            </div>

            {locations.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(index);
                }}
                className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
