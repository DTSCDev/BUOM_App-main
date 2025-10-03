import { useState, useEffect } from 'react';

export function useGospelValues() {
  const [gospelMap, setGospelMap] = useState<{ [sfmCode: string]: number }>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sfm-audit-data');
      if (saved) {
        const items = JSON.parse(saved);
        const map: { [sfmCode: string]: number } = {};
        items.forEach((item: any) => {
          if (item.gospelValue !== undefined && item.gospelValue !== null && item.gospelValue !== '') {
            map[item.sfmCode] = isNaN(Number(item.gospelValue)) ? item.gospelValue : Number(item.gospelValue);
          }
        });
        setGospelMap(map);
      }
    } catch (e) {
      setGospelMap({});
    }
  }, []);

  return gospelMap;
}