import { Shield, Navigation, Store, Train, TrendingUp } from 'lucide-react';
import { Card } from './ui/card';

export function ComparisonView({ locations }) {
  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A':
        return 'text-green-600 bg-green-100';
      case 'B':
        return 'text-blue-600 bg-blue-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBestIndex = (values) => {
    const maxValue = Math.max(...values);
    return values.indexOf(maxValue);
  };

  const safetyScores = locations.map((l) => l.safetyScore);
  const accessibilityScores = locations.map((l) => l.accessibilityScore);
  const convenienceScores = locations.map((l) => l.convenienceScore);

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <h3 className="text-gray-900 mb-2">비교 분석 요약</h3>
        <p className="text-gray-600">선택한 {locations.length}개 장소를 한눈에 비교하세요</p>
      </Card>

      {/* 안전성 비교 */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">안전성 비교</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                index === getBestIndex(safetyScores)
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-gray-900 truncate flex-1">
                  {location.location}
                </div>
                {index === getBestIndex(safetyScores) && (
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className={`text-3xl px-3 py-1 rounded ${getGradeColor(location.safetyGrade)}`}>
                  {location.safetyGrade}
                </div>
                <div>
                  <div className="text-gray-600">점수</div>
                  <div className={getScoreColor(location.safetyScore)}>
                    {location.safetyScore}/100
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 도심 접근성 비교 */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Navigation className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900">도심 접근성 비교</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                index === getBestIndex(accessibilityScores)
                  ? 'border-purple-400 bg-purple-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-gray-900 truncate flex-1">
                  {location.location}
                </div>
                {index === getBestIndex(accessibilityScores) && (
                  <TrendingUp className="w-5 h-5 text-purple-600 flex-shrink-0 ml-2" />
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600">점수</div>
                  <div className={`text-2xl ${getScoreColor(location.accessibilityScore)}`}>
                    {location.accessibilityScore}/100
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">도심까지</div>
                  <div className="text-gray-900">{location.accessibilityTime}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 편의성 비교 */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Store className="w-5 h-5 text-green-600" />
          <h3 className="text-gray-900">편의성 비교</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                index === getBestIndex(convenienceScores)
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-gray-900 truncate flex-1">
                  {location.location}
                </div>
                {index === getBestIndex(convenienceScores) && (
                  <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 ml-2" />
                )}
              </div>
              <div className="mb-3">
                <div className="text-gray-600 mb-1">점수</div>
                <div className={`text-2xl ${getScoreColor(location.convenienceScore)}`}>
                  {location.convenienceScore}/100
                </div>
              </div>
              <div className="space-y-1">
                {location.nearbyFacilities.slice(0, 2).map((facility, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">{facility.name}</span>
                    <span className="text-gray-900">{facility.count}개</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 대중교통 비교 */}
      <Card className="p-6 bg-white border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <Train className="w-5 h-5 text-orange-600" />
          <h3 className="text-gray-900">대중교통 비교</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50"
            >
              <div className="text-gray-900 mb-3 truncate">
                {location.location}
              </div>
              <div className="space-y-2">
                <div>
                  <div className="text-gray-600">가장 가까운 정류장</div>
                  <div className="text-gray-900">{location.nearestStation.name}</div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-gray-600 text-sm">거리</div>
                    <div className="text-gray-900">
                      {location.nearestStation.distance}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-sm">도보</div>
                    <div className="text-gray-900">
                      {location.nearestStation.walkTime}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-gray-600 text-sm">심야 운행</div>
                  <div
                    className={
                      location.nearestStation.nightService
                        ? 'text-green-600'
                        : 'text-red-600'
                    }
                  >
                    {location.nearestStation.nightService ? '가능' : '불가능'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
