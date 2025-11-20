import { MapPin, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';

const supportedRegions = [
  { country: '미국', city: '시카고', isNew: true, flag: '🇺🇸' },
  { country: '영국', city: '런던', isNew: true, flag: '🇬🇧' },
  { country: '캐나다', city: '토론토', flag: '🇨🇦' },
];
//{ country: '프랑스', city: '파리', flag: '🇫🇷' },
//{ country: '독일', city: '베를린', flag: '🇩🇪' },
//{ country: '스페인', city: '바르셀로나', flag: '🇪🇸' },
//{ country: '이탈리아', city: '로마', flag: '🇮🇹' },
//{ country: '캐나다', city: '토론토', flag: '🇨🇦' },

export function UpdatedRegions() {
  return (
    <div className="mt-16 w-full max-w-4xl">
      <div className="flex flex-wrap justify-center gap-3">
        {supportedRegions.map((region, index) => (
          <div
            key={index}
            className="group relative px-4 py-2.5 bg-white/70 backdrop-blur-sm rounded-full border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-default"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{region.flag}</span>
              <span className="text-gray-900">{region.country}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-700">{region.city}</span>
              {region.isNew && (
                <Badge
                  variant="secondary"
                  className="ml-1 bg-purple-100 text-purple-700 hover:bg-purple-100"
                >
                  NEW
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
