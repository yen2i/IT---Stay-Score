import { Navigation, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export function AccessibilityScore({ score, distanceKm, landmark }) {
  const getAccessibilityLevel = (score) => {
    if (score >= 80) return { text: '우수', color: 'text-green-600' };
    if (score >= 60) return { text: '양호', color: 'text-blue-600' };
    if (score >= 40) return { text: '보통', color: 'text-yellow-600' };
    return { text: '불편', color: 'text-red-600' };
  };

  const level = getAccessibilityLevel(score);

  return (
    <Card className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-5 h-5 text-purple-600" />
            <h3 className="text-gray-900">도심 접근성</h3>
          </div>
          <p className="text-gray-500">주요 지역까지의 이동성</p>
        </div>

        <div className={`text-right ${level.color}`}>
          <div className="text-4xl mb-1">{score}</div>
          <div className="text-sm">{level.text}</div>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">접근성 점수</span>
          <span className="text-gray-900">{score}/100</span>
        </div>
        <Progress value={score} className="h-3" />
      </div>

      {/* Purple Box */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-purple-600" />
          <div className="text-gray-600">도심 기준</div>
        </div>

        <div className="text-gray-900">{landmark}</div>

        <div className="mt-3 text-gray-600">지도 기준 직선거리</div>
        <div className="text-gray-900">{distanceKm} km</div>
      </div>
    </Card>
  );
}
