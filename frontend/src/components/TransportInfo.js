import { Train, MapPin, Clock, Moon, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';

export function TransportInfo({ station }) {
  return (
    <Card className="p-6 bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Train className="w-5 h-5 text-orange-600" />
            <h3 className="text-gray-900">대중교통 정보</h3>
          </div>
          <p className="text-gray-500">가까운 정류장 및 운행 정보</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center">
              <Train className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-gray-900">{station.name}</div>
              <div className="text-gray-600">가장 가까운 정류장</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-2 bg-white/60 rounded">
              <div className="text-gray-600 mb-1">거리</div>
              <div className="text-gray-900">{station.distance}</div>
            </div>
            <div className="p-2 bg-white/60 rounded">
              <div className="text-gray-600 mb-1">도보</div>
              <div className="text-gray-900">{station.walkTime}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Clock className="w-6 h-6 text-gray-600" />
          <div className="flex-1">
            <div className="text-gray-600 mb-1">배차 간격</div>
            <div className="text-gray-900">{station.interval}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <Moon className="w-6 h-6 text-gray-600" />
          <div className="flex-1">
            <div className="text-gray-600 mb-1">심야 운행</div>
            <div className="flex items-center gap-2">
              {station.nightService ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">운행 중</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">미운행</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-gray-700">
              주변에 버스 정류장 3개, 지하철역 1개가 있어 이동이 편리합니다.
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
