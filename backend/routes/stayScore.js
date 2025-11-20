// backend/routes/stayScore.js
const express = require("express");
const axios = require("axios");

const router = express.Router();

const GOOGLE_BASE = "https://maps.googleapis.com/maps/api"; // Geocoding용(그대로 사용)
const PLACES_BASE = "https://places.googleapis.com/v1";     // ✅ New Places API
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;




function calcCityAccessibilityScore(distanceMeters) {
  const score = 100 - 0.003 * distanceMeters;
  return Math.max(0, Math.min(100, Math.round(score)));
}



/* -------------------------------------------------------
 * 공통: Geocoding 같은 기존 Maps Web Service용 헬퍼
 *   - status 필드(OK, ZERO_RESULTS 등)가 있는 응답에만 사용
 * -----------------------------------------------------*/
async function callGoogleJson(url, params) {
  const res = await axios.get(url, {
    params: { key: API_KEY, ...params },
  });

  const data = res.data;
  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    console.error("Google API error:", data);
    throw new Error(`Google API error: ${data.status}`);
  }
  return data;
}

/* -------------------------------------------------------
 * New Places API v1 : searchNearby
 *   - POST https://places.googleapis.com/v1/places:searchNearby
 *   - header에 X-Goog-Api-Key, X-Goog-FieldMask
 * -----------------------------------------------------*/
async function searchNearbyPlaces(lat, lng, includedTypes, radiusMeters, maxResultCount = 20) {
  try {
    const url = `${PLACES_BASE}/places:searchNearby`;

    const body = {
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusMeters,
        },
      },
      includedTypes,         // ["convenience_store"], ["subway_station"] ...
      maxResultCount,
    };

    const res = await axios.post(url, body, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        // 필요한 필드만 달라고 요청 (displayName + location)
        "X-Goog-FieldMask": "places.displayName,places.location,places.types",
      },
    });

    return res.data.places || [];
  } catch (err) {
    // New Places API는 status 대신 HTTP error + error.message 로 옴
    if (err.response && err.response.data) {
      console.error("Places API error:", JSON.stringify(err.response.data, null, 2));
    } else {
      console.error("Places API error:", err.message);
    }
    // 실패하면 빈 배열 반환해서 점수만 낮게 주고 죽지 않게 처리
    return [];
  }
}

/* -------------------------------------------------------
 * 1) Geocoding: 주소 → (lat, lng)
 * -----------------------------------------------------*/
async function geocodeAddress(address) {
  const data = await callGoogleJson(`${GOOGLE_BASE}/geocode/json`, {
    address,
  });

  if (!data.results || !data.results.length) return null;

  const first = data.results[0];
  const loc = first.geometry.location;

  return {
    address: first.formatted_address,
    lat: loc.lat,
    lng: loc.lng,
  };
}

/* -------------------------------------------------------
 * 2) 거리 계산 (Haversine, meter 단위)
 * -----------------------------------------------------*/
function distanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000; // m
  const toRad = (d) => (d * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/* -------------------------------------------------------
 * 3) 편의성: 반경 1km 내 시설 검색
 *    - 편의점, 약국, 병원, 경찰서(police_station)
 *    - New Places API v1 사용
 * -----------------------------------------------------*/
const FACILITY_TYPES = {
  convenienceStore: { placeType: "convenience_store", label: "편의점", cap: 20, weight: 0.35 },
  pharmacy:         { placeType: "pharmacy",          label: "약국",   cap: 20,  weight: 0.20 },
  hospital:         { placeType: "hospital",          label: "병원",   cap: 20,  weight: 0.25 },
  police: {
    // 🔥 여기서 한 번에 여러 government 계열 타입을 묶어서 검색
    placeTypes: ["police", "local_government_office", "government_office"],
    label: "경찰서",
    cap: 20,
    weight: 0.20,
  }, // ✅ 네가 선택한 1번
};

async function getConvenienceInfo(lat, lng) {
  const radius = 1000; // 1km

  const facilities = {};
  let normalizedSum = 0;

  for (const [key, cfg] of Object.entries(FACILITY_TYPES)) {
    // ✅ placeTypes(배열) or placeType(단일) 둘 다 지원
    const typesForApi = cfg.placeTypes || [cfg.placeType];

    const places = await searchNearbyPlaces(
      lat,
      lng,
      typesForApi,
      radius,
      20
    );

    const count = places.length;

    facilities[key] = {
      label: cfg.label,
      count,
      // 디버깅용으로 실제 type도 보고 싶으면 아래처럼 찍어봐도 됨
      // sampleTypes: places.flatMap(p => p.types || []).slice(0, 5),
    };

    const ratio = Math.min(count / cfg.cap, 1);
    normalizedSum += ratio * cfg.weight;
  }

  const score = Math.round(60 + normalizedSum * 40);
  const totalCount = Object.values(facilities).reduce(
    (sum, f) => sum + f.count,
    0
  );

  return {
    score,
    totalCount,
    facilities,
  };
}

/* -------------------------------------------------------
 * 4) 대중교통: 가장 가까운 "지하철역" 찾기 (subway_station)
 *    - New Places API v1 사용
 *    - 거리 + 도보시간(직선거리 기준 80m/분)
 * -----------------------------------------------------*/
async function getNearestSubway(lat, lng) {
  // 넉넉하게 3km 반경에서 검색
  const places = await searchNearbyPlaces(lat, lng, ["subway_station"], 3000, 20);

  if (!places.length) {
    return {
      station: null,
      score: 40,
    };
  }

  // 가장 가까운 역 찾기
  let nearest = null;
  let minDist = Infinity;

  for (const p of places) {
    const loc = p.location;
    if (!loc) continue;

    const sLat = loc.latitude;
    const sLng = loc.longitude;

    const d = distanceMeters(lat, lng, sLat, sLng);
    if (d < minDist) {
      minDist = d;
      nearest = p;
    }
  }

  if (!nearest || !nearest.location) {
    return {
      station: null,
      score: 40,
    };
  }

  const distanceM = Math.round(minDist);
  const walkMinutes = Math.max(1, Math.round(distanceM / 80)); // 80m/분 가정

  // NEW Places 응답 구조: displayName.text
  const name =
    (nearest.displayName && nearest.displayName.text) ||
    (nearest.displayName && nearest.displayName.languageCode) ||
    "지하철역";

  let score;
  if (distanceM <= 300) score = 100;
  else if (distanceM <= 600) score = 90;
  else if (distanceM <= 900) score = 80;
  else if (distanceM <= 1200) score = 70;
  else if (distanceM <= 1500) score = 60;
  else score = 50;

  return {
    score,
    station: {
      name,
      lat: nearest.location.latitude,
      lng: nearest.location.longitude,
      distanceMeters: distanceM,
      distanceText: `${distanceM}m`,
      walkMinutes,
      walkTimeText: `${walkMinutes}분`,
      address: null, // New Places에서 address도 받고 싶으면 FieldMask에 추가하면 됨
    },
  };
}

//  ->>> 추가하기!!!!1
function detectCityByLatLng(lat, lng) {
  if (lat > 41 && lat < 42.5 && lng < -87 && lng > -88.5) return "chicago";
  if (lat > 51 && lat < 52 && lng > -0.6 && lng < 0.4) return "london";
  if (lat > 43.55 && lat < 43.9 && lng > -79.64 && lng < -79.12) return "toronto";
  return null;
}

router.get("/stay-score", async (req, res) => {
  try {
    const { address, region: regionParam } = req.query;
    const latParam = req.query.lat ? parseFloat(req.query.lat) : null;
    const lngParam = req.query.lng ? parseFloat(req.query.lng) : null;

    let base;

    // -----------------------------
    // 1) 위도/경도 직접 입력된 경우
    // -----------------------------
    if (
      latParam !== null &&
      lngParam !== null &&
      !Number.isNaN(latParam) &&
      !Number.isNaN(lngParam)
    ) {
      base = {
        address: address || null,
        lat: latParam,
        lng: lngParam,
      };
    } else {
      // -----------------------------
      // 2) 주소 → Geocode
      // -----------------------------
      if (!address) {
        return res
          .status(400)
          .json({ error: "address 또는 lat,lng 중 하나가 필요합니다." });
      }

      const geo = await geocodeAddress(address);
      if (!geo) {
        return res.status(404).json({ error: "유효하지 않은 주소입니다." });
      }
      base = geo; // 여기서 lat,lng 확정됨
    }

    const { lat, lng } = base;

    // -----------------------------
    // ⭐ 3) 도시 자동 판별 (이제 lat/lng 존재!)
    // -----------------------------
    let region = regionParam;
    if (!region) {
      const detected = detectCityByLatLng(lat, lng);
      region = detected || "chicago";
    }

    // -----------------------------
    // 4) 도심 기준점  ->>> 추가하기!!!!1
    // -----------------------------
    const CITY_CENTERS = {
      chicago: {
        name: "Chicago Downtown",
        lat: 41.8830,
        lng: -87.6320,
      },
      london: {
        name: "London City Centre (Piccadilly Circus)",
        lat: 51.5100,
        lng: -0.1340,
      },
      toronto: {
        name: "Toronto Downtown (Union Station)",
        lat: 43.6450,
        lng: -79.3800,
      },
    };

    if (!CITY_CENTERS[region]) {
      return res.status(400).json({ error: `지원하지 않는 지역: ${region}` });
    }

    const cityCenter = CITY_CENTERS[region];

    // -----------------------------
    // 5) 도심 접근성 계산
    // -----------------------------
    function calcCityAccessibilityScore(distanceMeters) {
      const score = 100 - 0.003 * distanceMeters;
      return Math.max(0, Math.min(100, Math.round(score)));
    }

    const distMeters = distanceMeters(lat, lng, cityCenter.lat, cityCenter.lng);

    const cityAccess = {
      score: calcCityAccessibilityScore(distMeters),
      distanceKm: (distMeters / 1000).toFixed(1),
      landmark: cityCenter.name,
    };

    // -----------------------------
    // 6) 기존 기능: 편의시설 + 지하철
    // -----------------------------
    const [convenience, transit] = await Promise.all([
      getConvenienceInfo(lat, lng),
      getNearestSubway(lat, lng),
    ]);

    // -----------------------------
    // 7) 최종 응답
    // -----------------------------
    return res.json({
      query: base,
      region,
      scores: {
        convenience,
        transit,
        cityAccess,
      },
    });
  } catch (err) {
    console.error("stay-score route error:", err);
    return res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;