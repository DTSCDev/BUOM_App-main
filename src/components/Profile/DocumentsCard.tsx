
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { ActionWarning } from "@/components/ui/action-warning";
import { useDocuments } from "@/hooks/useDocuments";

interface DocumentsCardProps {
  userId?: string;
}

export function DocumentsCard({ userId }: DocumentsCardProps) {
  const { documents, isLoading, uploadDocument } = useDocuments(userId || "");
  const [isUploading, setIsUploading] = useState(false);

  const requiredDocuments = [
    { type: "payslip", label: "Recent Payslip", required: true },
    { type: "id", label: "Photo ID", required: true },
    { type: "proof_of_address", label: "Proof of Address", required: true },
    { type: "pension_statement", label: "Pension Statement", required: false },
    { type: "bank_statement", label: "Bank Statement", required: false }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadDocument(file, docType);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getDocumentStatus = (docType: string) => {
    return documents?.some(doc => (doc as any).document_type === docType);
  };

  const requiredDocsUploaded = requiredDocuments
    .filter(doc => doc.required)
    .every(doc => getDocumentStatus(doc.type));

  // Check if required documents are missing
  const isIncomplete = !requiredDocsUploaded;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-[#030227]">Documents</CardTitle>
          <ActionWarning message="Upload Documents" show={isIncomplete} />
        </div>
      </CardHeader>
      <CardContent className="py-6">
        <div className="space-y-4">
          {requiredDocuments.map((docInfo) => {
            const isUploaded = getDocumentStatus(docInfo.type);
            return (
              <div key={docInfo.type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {isUploaded ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : docInfo.required ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <FileText className="h-5 w-5 text-gray-400" />
                  )}
                  <div>
                    <p className="text-base font-medium">{docInfo.label}</p>
                    <p className="text-sm text-muted-foreground">
                      {docInfo.required ? "Required" : "Optional"} • {isUploaded ? "Uploaded" : "Not uploaded"}
                    </p>
                  </div>
                </div>
                {!isUploaded && (
                  <div>
                    <input
                      type="file"
                      id={`upload-${docInfo.type}`}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e, docInfo.type)}
                      disabled={isUploading}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => document.getElementById(`upload-${docInfo.type}`)?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
          
          {!requiredDocsUploaded && (
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                Please upload all required documents to complete your APF registration.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
