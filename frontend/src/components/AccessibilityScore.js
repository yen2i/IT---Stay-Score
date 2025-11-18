import { Navigation, Clock, MapPin } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export function AccessibilityScore({ score, time }) {
  const getAccessibilityLevel = (score) => {
    if (score >= 80) return { text: '우수', color: 'text-green-600' };
    if (score >= 60) return { text: '양호', color: 'text-blue-600' };
    if (score >= 40) return { text: '보통', color: 'text-yellow-600' };
    return { text: '불편', color: 'text-red-600' };
  };

  const level = getAccessibilityLevel(score);

  return (
    <Card className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
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

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">접근성 점수</span>
          <span className="text-gray-900">{score}/100</span>
        </div>
        <Progress value={score} className="h-3" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
          <Clock className="w-6 h-6 text-purple-600" />
          <div className="flex-1">
            <div className="text-gray-600 mb-1">도심까지 예상 시간</div>
            <div className="text-gray-900">{time} (대중교통 이용 시)</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
          <MapPin className="w-6 h-6 text-purple-600" />
          <div className="flex-1">
            <div className="text-gray-600 mb-1">주요 랜드마크</div>
            <div className="text-gray-900">강남역 상권 중심부</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-gray-600 mb-1">도보</div>
            <div className="text-gray-900">20분</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-gray-600 mb-1">대중교통</div>
            <div className="text-gray-900">15분</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-gray-600 mb-1">차량</div>
            <div className="text-gray-900">10분</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
