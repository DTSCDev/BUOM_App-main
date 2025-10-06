import { useMemo } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { SFMResolver } from "@/utils/systemFields/sfmResolver";

export function useSFMResolver() {
  const { profile } = useProfile();
  const { assets } = useNetAssetValue();

  const resolver = useMemo(() => {
    if (!profile || !assets) return null;
    const profileRecord = profile as unknown as Record<string, unknown>;
    const assetsRecord = assets.map(a => a as unknown as Record<string, unknown>);
    return new SFMResolver(profileRecord, assetsRecord);
  }, [profile, assets]);

  const resolveSFM = (sfmCode: string, forceRefresh = false): number => {
    if (!resolver) return 0;
    try {
      return resolver.resolveSFM(sfmCode, forceRefresh);
    } catch (e) {
      console.error(`Error resolving ${sfmCode}:`, e);
      return 0;
    }
  };

  return {
    resolveSFM,
    ready: !!resolver,
  };
}