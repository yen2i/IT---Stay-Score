import { Globe2 } from 'lucide-react';
import { Card } from './ui/card';

const supportedRegions = [
  { code: 'chicago', country: '미국', city: '시카고', flag: '🇺🇸' },
  { code: 'london', country: '영국', city: '런던', flag: '🇬🇧' },
  { code: 'toronto', country: '캐나다', city: '토론토', flag: '🇨🇦' },
];

export function RegionSelector({ region, onChange }) {
  return (
    <Card className="p-4 bg-white border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Globe2 className="w-5 h-5 text-purple-600" />
        <h3 className="text-gray-900 text-lg">지역 선택</h3>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {supportedRegions.map((r) => (
          <button
            key={r.code}
            onClick={() => onChange(r.code)}
            className={`p-3 rounded-lg border text-center transition 
              ${
                region === r.code
                  ? 'border-purple-600 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:bg-gray-50'
              }
            `}
          >
            <div className="text-2xl">{r.flag}</div>
            <div className="text-gray-900">{r.city}</div>
            <div className="text-gray-500 text-sm">{r.country}</div>
          </button>
        ))}
      </div>
    </Card>
  );
}
