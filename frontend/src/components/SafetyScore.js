import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

export function SafetyScore({ score, grade }) {
  const getGradeColor = (g) => {
    switch (g) {
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getGradeText = (g) => {
    switch (g) {
      case 'A':
        return '매우 안전';
      case 'B':
        return '안전';
      case 'C':
        return '보통';
      case 'D':
        return '주의 필요';
      default:
        return '데이터 없음';
    }
  };

  return (
    <Card className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-gray-900">안전성 수치</h3>
          </div>
          <p className="text-gray-500">지역 안전도 및 위험 지수</p>
        </div>
        <div className={`text-right ${getGradeColor(grade)}`}>
          <div className="text-4xl mb-1">{grade}</div>
          <div className="text-sm">{getGradeText(grade)}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">안전 점수</span>
          <span className="text-gray-900">{score}/100</span>
        </div>
        <Progress value={score} className="h-3" />
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-gray-900 mb-1">안전 요소</div>
            <div className="text-gray-600">활발한 유동인구, 조명 시설 양호</div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-gray-900 mb-1">주의 사항</div>
            <div className="text-gray-600">야간 외곽 지역 이동 시 주의</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
