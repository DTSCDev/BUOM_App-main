import { supabase } from "@/integrations/supabase/client";
import { isTestingAccount } from "@/utils/testing";

/**
 * Persist AIP Agreement In Principle data to Supabase `reports` table.
 * Stores the signature image as a data URL in `report_url` for now.
 */
export async function createAipReport(
  userId: string | undefined,
  applicationData: Record<string, unknown>,
  signatureDataUrl: string,
  signerName: string,
  consentAccepted: boolean
): Promise<{ id?: string } | null> {
  try {
    const app = applicationData as {
      monthlyFundingCost?: unknown;
      capitalShortfall?: unknown;
      totalAPFFunding?: unknown;
    };

    const payload = {
      report_type: "AIP-2025/26",
      report_date: new Date().toISOString(),
      // Temporarily store signature as a data URL (acts as a URL string)
      report_url: signatureDataUrl || null,
      // Optionally capture coarse metrics if available from applicationData
      total_monthly_funding_cost: typeof app.monthlyFundingCost === 'number' ? app.monthlyFundingCost : null,
      total_shortfall: typeof app.capitalShortfall === 'number' ? app.capitalShortfall : null,
      total_buom_funding_cost: typeof app.totalAPFFunding === 'number' ? app.totalAPFFunding : null,
      // Note: `reports` schema has no member_id; we keep it null for now
      employer_id: null,
    } as const;

    // Always stash minimal AIP key data locally for dashboard display
    try {
      const local = {
        userId,
        signerName,
        consentAccepted,
        signatureDataUrl,
        reportDate: payload.report_date,
      };
      localStorage.setItem("aip-key-data", JSON.stringify(local));
    } catch (e) {
      // Non-fatal: localStorage may be unavailable
      console.debug("createAipReport: localStorage write skipped", e);
    }

    // Skip remote persistence for test/demo accounts
    if (isTestingAccount()) {
      return null;
    }

    const { data, error } = await supabase
      .from("reports")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.warn("createAipReport: Supabase error", error);
      return null;
    }

    return { id: data?.id };
  } catch (e) {
    console.warn("createAipReport: unexpected error", e);
    return null;
  }
}