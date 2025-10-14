import { useState, useRef, useEffect } from "react";
import { isTestingAccount } from "@/utils/testing";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { useAuth } from "@/hooks/useAuth";
import { createAipReport } from "@/services/aipReportService";

interface APFStep6TermsProps {
  applicationData: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
}

type YesNo = "yes" | "no" | "";
interface APFStep6FormData {
  nonContributoryTerms: YesNo;
  allInclusiveTerms: YesNo;
  acceptance: YesNo;
}
type APFStep6FormField = keyof APFStep6FormData;

export function APFStep6Terms({ applicationData, onComplete }: APFStep6TermsProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState<APFStep6FormData>({
    nonContributoryTerms: "",
    allInclusiveTerms: "",
    acceptance: ""
  });
  
  const [signature, setSignature] = useState<string>("");
  const sigRef = useRef<SignatureCanvas | null>(null);
  const [signerName, setSignerName] = useState<string>("");
  const [consentAccepted, setConsentAccepted] = useState<boolean>(false);
  const [completed, setCompleted] = useState(false);

  // Check if all required fields are completed
  const allFieldsCompleted = 
    isTestingAccount() || (
      formData.nonContributoryTerms === "yes" && 
      formData.allInclusiveTerms === "yes" && 
      formData.acceptance === "yes" && 
      signerName.trim().length > 0 &&
      consentAccepted &&
      signature.length > 0
    );

  // Handle radio button changes
  const handleRadioChange = (field: APFStep6FormField, value: YesNo) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Signature drawing handled via react-signature-canvas

  

  // Touch event handlers
  

  

  

  

  const clearSignature = () => {
    if (sigRef.current) {
      sigRef.current.clear();
      setSignature("");
    }
  };

  

  const handleSubmit = () => {
    if (allFieldsCompleted) {
      setCompleted(true);
      onComplete({
        termsAccepted: {
          nonContributoryTerms: formData.nonContributoryTerms === "yes",
          allInclusiveTerms: formData.allInclusiveTerms === "yes",
          acceptance: formData.acceptance === "yes"
        },
        signature,
        signerName,
        consentAccepted,
        signatureDate: new Date().toISOString(),
        completedAt: new Date().toISOString()
      });
      createAipReport(user?.id, applicationData, signature, signerName, consentAccepted)
        .catch((e) => console.warn('AIP report creation failed', e));
      
      // Auto-redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto bg-white">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Check className="h-8 w-8 text-green-600" />
            <h2 className="text-2xl font-bold text-green-900">Terms Accepted Successfully</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Your application has been completed and is now being processed.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white">
      {/* Header */}
      <div className="py-6 border-b flex items-center justify-start gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>6</div>
        <h1 id="step6-header" className="text-2xl font-semibold leading-tight" style={{ color: '#4FF456' }}>Terms & Conditions</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Non Contributory Terms */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: '#4FF456' }}>Non Contributory Terms</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            I confirm that I have not been asked to invest any of my own savings or income to participate in Advanced Pension Funding (APF) via BUOM.
          </p>
          <RadioGroup 
            value={formData.nonContributoryTerms} 
            onValueChange={(value) => handleRadioChange('nonContributoryTerms', value as YesNo)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="nct-yes" />
              <Label htmlFor="nct-yes" className="text-sm">Yes I agree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="nct-no" />
              <Label htmlFor="nct-no" className="text-sm">No I disagree</Label>
            </div>
          </RadioGroup>
        </div>

        {/* All Inclusive Terms */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-blue-600">All Inclusive Terms</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            I understand that funds advanced to me via Invest Now, Buy Later ("INBL") Loan terms will be used to ensure that I am able to participate in BUOM's All Inclusive Terms. The amount that I am asked to save regularly via my ISA Repayment Plan covers Initial costs and defers all AMCs until maturity. APF Inclusive Terms guarantee that I shall only pay for a successful outcome.
          </p>
          <RadioGroup 
            value={formData.allInclusiveTerms} 
            onValueChange={(value) => handleRadioChange('allInclusiveTerms', value as YesNo)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="ait-yes" />
              <Label htmlFor="ait-yes" className="text-sm">Yes I agree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="ait-no" />
              <Label htmlFor="ait-no" className="text-sm">No I disagree</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Acceptance */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold" style={{ color: '#4FF456' }}>Acceptance</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            I wish to apply for INBL Loan terms at 0% and APF using using the most Effective, Efficient and Relevant steps that have met FSMA, COBS and [R]PSM.
          </p>
          <RadioGroup 
            value={formData.acceptance} 
            onValueChange={(value) => handleRadioChange('acceptance', value as YesNo)}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="acc-yes" />
              <Label htmlFor="acc-yes" className="text-sm">Yes I agree</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="acc-no" />
              <Label htmlFor="acc-no" className="text-sm">No I disagree</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Digital Signature */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold" style={{ color: '#4FF456' }}>Digital Signature</h2>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Please sign below:</span>
              <Button 
                onClick={clearSignature} 
                variant="outline" 
                size="sm"
                type="button"
              >
                Clear
              </Button>
            </div>
            {/* SignatureCanvas types missing in package; usage is safe */}
            <SignatureCanvas
              ref={(ref) => (sigRef.current = ref)}
              onEnd={() => setSignature(sigRef.current?.getTrimmedCanvas().toDataURL('image/png') || '')}
              penColor="#111827"
              backgroundColor="#ffffff"
              canvasProps={{ width: 600, height: 220, className: 'border bg-white w-full rounded' }}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-600">Date: {currentDate}</span>
              <span className="text-sm text-gray-600">Name: {signerName || '—'}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signer-name">Typed Name</Label>
              <input
                id="signer-name"
                className="w-full border rounded px-3 py-2"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                placeholder="Type your full legal name"
              />
            </div>
            <div className="flex items-center space-x-2 md:mt-6">
              <input
                id="consent"
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
              />
              <Label htmlFor="consent" className="text-sm">I consent to use of electronic signature (AIP stage).</Label>
            </div>
          </div>
        </div>

        {/* Claim Funds Button */}
        <div className="pt-6">
          <Button
            onClick={handleSubmit}
            disabled={!allFieldsCompleted}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg"
          >
            CLAIM YOUR FUNDS
          </Button>
        </div>

        {/* Terms Link */}
        <div className="text-center pt-4">
          <button className="text-blue-600 underline text-sm hover:text-blue-800">
            Click here for full Terms and Conditions
          </button>
        </div>
      </div>
    </div>
  );
}
