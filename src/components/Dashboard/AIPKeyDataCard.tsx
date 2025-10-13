import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type AipKeyData = {
  userId?: string;
  signerName?: string;
  consentAccepted?: boolean;
  signatureDataUrl?: string;
  reportDate?: string;
};

export function AIPKeyDataCard() {
  const { user } = useAuth();
  const [data, setData] = useState<AipKeyData | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("aip-key-data");
      if (!raw) return;
      const parsed = JSON.parse(raw) as AipKeyData;
      // Only show if it belongs to the current user (when present)
      if (!parsed.userId || parsed.userId === user?.id) {
        setData(parsed);
      }
    } catch (e) {
      // Ignore localStorage parsing errors
    }
  }, [user?.id]);

  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold" style={{ color: '#4FF456' }}>AIP Key Data (2025/26)</h3>
        <span className="text-sm text-gray-500">Agreement In Principle</span>
      </div>
      {data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="text-sm text-gray-700">Signer Name</div>
            <div className="font-medium">{data.signerName || '—'}</div>
            <div className="text-sm text-gray-700 mt-4">Consent</div>
            <div className="font-medium">{data.consentAccepted ? 'Accepted' : 'Not accepted'}</div>
            <div className="text-sm text-gray-700 mt-4">Captured</div>
            <div className="font-medium">{data.reportDate ? new Date(data.reportDate).toLocaleString('en-GB') : '—'}</div>
          </div>
          <div className="flex flex-col items-center">
            {data.signatureDataUrl ? (
              <img
                src={data.signatureDataUrl}
                alt="AIP Signature"
                className="border rounded w-full h-[160px] object-contain bg-gray-50"
              />
            ) : (
              <div className="w-full h-[160px] border rounded bg-gray-50 flex items-center justify-center text-gray-500">
                Signature not captured
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="text-gray-600 text-sm">
          No AIP data available. Complete Step 6 to capture your Agreement In Principle.
        </div>
      )}
    </div>
  );
}