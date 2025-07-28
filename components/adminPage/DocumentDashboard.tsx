import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Search, FileText, Archive } from "lucide-react";
import { useToast } from "../customizer/use-toast";

interface Document {
  id: string;
  orderNumber: string;
  username: string;
  fileName: string;
  fileType: "zip" | "pdf" | "doc";
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
  status: "available" | "processing" | "expired";
}

// Mock data - in real app this would come from MongoDB
const mockDocuments: Document[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    username: "john.doe",
    fileName: "project_files.zip",
    fileType: "zip",
    fileSize: "15.2 MB",
    uploadDate: "2024-01-15",
    downloadUrl: "#",
    status: "available",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002", 
    username: "jane.smith",
    fileName: "documentation.pdf",
    fileType: "pdf",
    fileSize: "3.4 MB",
    uploadDate: "2024-01-14",
    downloadUrl: "#",
    status: "available",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    username: "mike.wilson",
    fileName: "reports_archive.zip",
    fileType: "zip",
    fileSize: "28.7 MB",
    uploadDate: "2024-01-13",
    downloadUrl: "#",
    status: "processing",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    username: "sarah.connor",
    fileName: "backup_data.zip",
    fileType: "zip",
    fileSize: "42.1 MB",
    uploadDate: "2024-01-12",
    downloadUrl: "#",
    status: "available",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    username: "alex.turner",
    fileName: "presentation.doc",
    fileType: "doc",
    fileSize: "5.8 MB",
    uploadDate: "2024-01-11",
    downloadUrl: "#",
    status: "expired",
  },
];

export const DocumentDashboard = () => {
  const [documents] = useState<Document[]>(mockDocuments);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (doc: Document) => {
    if (doc.status === "expired") {
      toast({
        title: "Download Failed",
        description: "This file has expired and is no longer available.",
        variant: "destructive",
      });
      return;
    }

    if (doc.status === "processing") {
      toast({
        title: "File Processing",
        description: "This file is still being processed. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Download Started",
      description: `Downloading ${doc.fileName}...`,
    });
    
    // In real app, this would trigger actual download
    console.log("Downloading:", doc.fileName);
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "zip":
        return <Archive className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Available</Badge>;
      case "processing":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Processing</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="bg-primary-gradient bg-clip-text text-transparent">
            <h1 className="text-4xl md:text-5xl font-bold">Document Vault</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access and download your files securely. All documents are organized by order number and username.
          </p>
        </div>

        {/* Search */}
        <Card className="shadow-card hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search Documents
            </CardTitle>
            <CardDescription>
              Search by order number, username, or filename
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2 border-border focus:border-primary transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card className="shadow-card hover:shadow-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Available Documents</span>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {filteredDocuments.length} files
              </Badge>
            </CardTitle>
            <CardDescription>
              Click download to access your files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-semibold">File</th>
                    <th className="text-left py-3 px-2 font-semibold">Order Number</th>
                    <th className="text-left py-3 px-2 font-semibold">Username</th>
                    <th className="text-left py-3 px-2 font-semibold">Size</th>
                    <th className="text-left py-3 px-2 font-semibold">Date</th>
                    <th className="text-left py-3 px-2 font-semibold">Status</th>
                    <th className="text-left py-3 px-2 font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className="border-b border-border hover:bg-accent/50 transition-colors group"
                    >
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getFileIcon(doc.fileType)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground uppercase">{doc.fileType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <code className="bg-accent px-2 py-1 rounded text-sm font-mono">
                          {doc.orderNumber}
                        </code>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {doc.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm">{doc.username}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-sm text-muted-foreground">
                        {doc.fileSize}
                      </td>
                      <td className="py-4 px-2 text-sm text-muted-foreground">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        {getStatusBadge(doc.status)}
                      </td>
                      <td className="py-4 px-2">
                        <Button
                          onClick={() => handleDownload(doc)}
                          disabled={doc.status === "expired"}
                          variant={doc.status === "available" ? "default" : "secondary"}
                          size="sm"
                          className="group-hover:scale-105 transition-transform"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No documents found matching your search.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};