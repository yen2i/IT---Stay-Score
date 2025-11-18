/* global google */
import { useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { MapPin, AlertCircle } from "lucide-react";

export function SafetyHeatMap({ location, safetyScore, lat, lng }) {
  const mapRef = useRef(null);

  useEffect(() => {
    // 스크립트가 아직 안 불러와졌으면 그냥 나가기 (에러 방지)
    if (
      typeof window === "undefined" ||
      !window.google ||
      !window.google.maps
    ) {
      console.warn("Google Maps JS not loaded yet");
      return;
    }

    const center = {
      lat: lat ?? 37.5665, // lat 없으면 서울 시청 근처
      lng: lng ?? 126.978,
    };

    const map = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 15,
    });

    // 위치 마커
    new window.google.maps.Marker({
      position: center,
      map,
    });

    // 간단한 히트맵용 더미 포인트 생성 (safetyScore 낮을수록 붉은 점 많이)
    const dangerCount = Math.floor((100 - safetyScore) / 10) + 3;
    const points = [];

    for (let i = 0; i < dangerCount; i++) {
      const offsetLat = (Math.random() - 0.5) * 0.01;
      const offsetLng = (Math.random() - 0.5) * 0.01;
      points.push(
        new window.google.maps.LatLng(
          center.lat + offsetLat,
          center.lng + offsetLng
        )
      );
    }

    // visualization 라이브러리가 로드된 경우에만 히트맵 생성
    if (
      window.google.maps.visualization &&
      typeof window.google.maps.visualization.HeatmapLayer === "function"
    ) {
      new window.google.maps.visualization.HeatmapLayer({
        data: points,
        map,
        radius: 40,
      });
    } else {
      console.warn("Heatmap library not loaded (no visualization)");
    }
  }, [lat, lng, safetyScore]);

  return (
    <Card className="p-6 bg-white border-gray-200 shadow-sm">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-gray-900">지역 안전도 히트맵</h3>
        </div>
        <p className="text-gray-500">색상이 진할수록 주의가 필요한 지역입니다</p>
      </div>

      <div className="relative rounded-lg overflow-hidden border border-gray-200">
        {/* 여기 div가 실제 지도 들어가는 곳 */}
        <div
          ref={mapRef}
          className="w-full h-[400px]"
          style={{ width: "100%", height: "400px" }}
        />

        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="text-gray-700 mb-2">범례</div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-gray-600">위험 (주의 필요)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-400"></div>
              <span className="text-gray-600">보통 (경계)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-400"></div>
              <span className="text-gray-600">양호</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-gray-600">안전</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>
              <span className="text-gray-600">현재 위치</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">{location}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-gray-700">
          💡 이 지도는 실제 Google 지도 위에 위험도 시뮬레이션 포인트를 표시한
          히트맵입니다.
        </p>
      </div>
    </Card>
  );
}
