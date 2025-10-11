import { useState, useRef, useEffect } from "react";
import { isTestingAccount } from "@/utils/testing";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface APFStep6TermsProps {
  applicationData: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
}

export function APFStep6Terms({ applicationData, onComplete }: APFStep6TermsProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nonContributoryTerms: "",
    allInclusiveTerms: "",
    acceptance: ""
  });
  
  const [signature, setSignature] = useState<string>("");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [completed, setCompleted] = useState(false);

  // Check if all required fields are completed
  const allFieldsCompleted = 
    isTestingAccount() || (
      formData.nonContributoryTerms === "yes" && 
      formData.allInclusiveTerms === "yes" && 
      formData.acceptance === "yes" && 
      signature.length > 0
    );

  // Handle radio button changes
  const handleRadioChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Canvas drawing functions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  // Touch event handlers
  const startDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
      }
    }
  };

  const drawTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (canvas && e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineTo(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        ctx.stroke();
      }
    }
  };

  const stopDrawingTouch = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignature(canvas.toDataURL());
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        setSignature(canvas.toDataURL());
      }
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setSignature("");
      }
    }
  };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
      }
    }
  }, []);

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
        signatureDate: new Date().toISOString(),
        completedAt: new Date().toISOString()
      });
      
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
      <div className="py-6 border-b flex items-center justify-center gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#4FF456', color: '#1f2937' }}>6</div>
        <h1 id="step6-header" className="text-2xl font-bold" style={{ color: '#4FF456' }}>Terms & Conditions</h1>
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
            onValueChange={(value) => handleRadioChange('nonContributoryTerms', value)}
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
            onValueChange={(value) => handleRadioChange('allInclusiveTerms', value)}
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
            onValueChange={(value) => handleRadioChange('acceptance', value)}
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
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-blue-600">Digital Signature</h2>
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Please sign below:</span>
              <Button 
                onClick={clearSignature} 
                variant="outline" 
                size="sm"
                type="button"
              >
                Clear
              </Button>
            </div>
            <canvas
              ref={canvasRef}
              width={400}
              height={150}
              className="border border-gray-300 bg-white w-full rounded cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawingTouch}
              onTouchMove={drawTouch}
              onTouchEnd={stopDrawingTouch}
              style={{ touchAction: 'none' }}
            />
            <div className="mt-2 text-right">
              <span className="text-sm text-gray-600">Date: {currentDate}</span>
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
