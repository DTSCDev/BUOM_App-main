
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  url: string | null;
  size: number;
  created_at: string;
}

export function useDocuments(userId: string | undefined) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // For now, since we don't have the actual database table yet, 
        // we'll use a mock data array
        // This will be replaced with actual Supabase queries once the storage is set up
        // const { data, error } = await supabase
        //   .from('member_documents')
        //   .select('*')
        //   .eq('user_id', userId);
        
        // if (error) throw error;
        
        // Mock data for demonstration
        const mockDocuments = [
          // Mock data to be replaced with actual data from database
        ];
        
        setDocuments([]);
      } catch (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: 'Error',
          description: 'Failed to load documents',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [userId]);

  const uploadDocument = async (file: File, type: string) => {
    if (!userId) return false;
    
    try {
      // This is a placeholder for the actual upload functionality
      // that will be implemented once we have storage set up
      
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
      
      // Mock adding a document to the UI
      const newDocument: Document = {
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        type,
        url: URL.createObjectURL(file),  // This would be the actual URL from Supabase Storage
        size: file.size,
        created_at: new Date().toISOString(),
      };
      
      setDocuments(docs => [newDocument, ...docs]);
      return true;
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteDocument = async (documentId: string) => {
    try {
      // This is a placeholder for the actual delete functionality
      
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      
      // Update UI
      setDocuments(docs => docs.filter(doc => doc.id !== documentId));
      return true;
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { documents, isLoading, uploadDocument, deleteDocument };
}
