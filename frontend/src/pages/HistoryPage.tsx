import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  FileText,
  Activity,
  Trash2,
  Download,
  Eye,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL;

interface HistoryItem {
  id: string;
  file_name?: string;
  file_url?: string;
  type?: string;
  created_at?: string;

  patient_name?: string | null;
  age?: number | string | null;
  gender?: string | null;
  test_type?: string | null;
  hospital?: string | null;
  doctor?: string | null;
  date?: string | null;

  summary?: string;
  findings?: string[];
  risk_level?: string;
  recommendations?: string[];
  lifestyle_advice?: string[];
  suggested_specialist?: string | null;
}

export function HistoryPage() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ---------------------------------------------------------
  // Load real patient history from backend
  // ---------------------------------------------------------
  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("medivision_access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("medivision_access_token");
        localStorage.removeItem("medivision_token_type");
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load patient history");
      }

      const data = await response.json();

      setHistory(data);
      setFilteredHistory(data);
    } catch (err) {
      console.error("History loading error:", err);
      setError("Unable to load your medical history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  // ---------------------------------------------------------
  // Search
  // ---------------------------------------------------------
  useEffect(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      setFilteredHistory(history);
      return;
    }

    const filtered = history.filter((item) => {
      return (
        item.file_name?.toLowerCase().includes(search) ||
        item.test_type?.toLowerCase().includes(search) ||
        item.summary?.toLowerCase().includes(search) ||
        item.risk_level?.toLowerCase().includes(search) ||
        item.suggested_specialist
          ?.toLowerCase()
          .includes(search) ||
        item.doctor?.toLowerCase().includes(search) ||
        item.hospital?.toLowerCase().includes(search)
      );
    });

    setFilteredHistory(filtered);
  }, [searchTerm, history]);

  // ---------------------------------------------------------
  // Delete report
  // ---------------------------------------------------------
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical record?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const token = localStorage.getItem(
        "medivision_access_token"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/history/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "medivision_access_token"
        );
        localStorage.removeItem(
          "medivision_token_type"
        );
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      setHistory((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete this medical record.");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------------------------------------------------
  // View details
  // ---------------------------------------------------------
  const handleViewDetails = (item: HistoryItem) => {
    sessionStorage.setItem(
      "medivision_analysis_result",
      JSON.stringify(item)
    );

    navigate("/dashboard/analysis");
  };

  // ---------------------------------------------------------
  // Download PDF
  // ---------------------------------------------------------
  const handleDownload = async (id: string) => {
    try {
      const token = localStorage.getItem(
        "medivision_access_token"
      );

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/history/${id}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem(
          "medivision_access_token"
        );
        localStorage.removeItem(
          "medivision_token_type"
        );
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const data = await response.json();

      if (data.download_url) {
        window.open(
          `${API_URL}${data.download_url}`,
          "_blank"
        );
      }
    } catch (err) {
      console.error("Download error:", err);
      alert("Unable to download the report.");
    }
  };

  // ---------------------------------------------------------
  // Format date
  // ---------------------------------------------------------
  const formatDate = (date?: string) => {
    if (!date) return "Date not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // ---------------------------------------------------------
  // Risk badge
  // ---------------------------------------------------------
  const getRiskVariant = (
    risk?: string
  ): "default" | "secondary" | "destructive" | "outline" => {
    const value = risk?.toLowerCase();

    if (value === "high") return "destructive";
    if (
      value === "moderate" ||
      value === "medium"
    ) {
      return "secondary";
    }
    if (value === "low") return "default";

    return "outline";
  };

  // ---------------------------------------------------------
  // Loading
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading your medical history...</p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Error
  // ---------------------------------------------------------
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <AlertCircle className="h-10 w-10 text-destructive" />

              <div>
                <h2 className="text-xl font-semibold">
                  Unable to load history
                </h2>

                <p className="text-muted-foreground mt-1">
                  {error}
                </p>
              </div>

              <Button onClick={loadHistory}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Patient History
          </h1>

          <p className="text-muted-foreground">
            Your real medical reports and AI analysis history.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />

            <Input
              placeholder="Search history..."
              className="pl-8"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            type="button"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* No records */}
      {filteredHistory.length === 0 && (
        <Card>
          <CardContent className="p-10">
            <div className="flex flex-col items-center text-center gap-4">
              <FileText className="h-12 w-12 text-muted-foreground" />

              <div>
                <h2 className="text-xl font-semibold">
                  {history.length === 0
                    ? "No medical history yet"
                    : "No matching records"}
                </h2>

                <p className="text-muted-foreground mt-1">
                  {history.length === 0
                    ? "Upload a medical report or scan to see your analysis here."
                    : "Try a different search term."}
                </p>
              </div>

              {history.length === 0 && (
                <Button
                  type="button"
                  onClick={() =>
                    navigate("/dashboard/upload")
                  }
                >
                  Upload Medical Report
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      {filteredHistory.length > 0 && (
        <div className="relative border-l ml-4 md:ml-6 space-y-8 pb-4">

          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="relative pl-6 md:pl-8"
            >

              {/* Timeline icon */}
              <div className="absolute -left-3.5 top-1 h-7 w-7 rounded-full flex items-center justify-center border-4 border-background bg-blue-100 dark:bg-blue-900/50">
                {item.type === "image" ? (
                  <Activity className="h-3.5 w-3.5 text-blue-500" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-blue-500" />
                )}
              </div>

              <Card>
                <CardContent className="p-4 sm:p-6">

                  {/* Date + type */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />

                      {formatDate(item.created_at)}
                    </div>

                    <div className="flex gap-2">
                      <Badge variant="outline">
                        {item.type === "image"
                          ? "Medical Image"
                          : "Medical Report"}
                      </Badge>

                      {item.risk_level && (
                        <Badge
                          variant={getRiskVariant(
                            item.risk_level
                          )}
                        >
                          Risk: {item.risk_level}
                        </Badge>
                      )}
                    </div>

                  </div>

                  {/* File name */}
                  <h3 className="text-lg font-semibold mb-2">
                    {item.file_name ||
                      item.test_type ||
                      "Medical Analysis"}
                  </h3>

                  {/* Real data */}
                  <div className="text-sm text-muted-foreground space-y-2">

                    {item.test_type && (
                      <p>
                        <span className="font-medium text-foreground">
                          Test:
                        </span>{" "}
                        {item.test_type}
                      </p>
                    )}

                    {item.patient_name && (
                      <p>
                        <span className="font-medium text-foreground">
                          Patient:
                        </span>{" "}
                        {item.patient_name}
                      </p>
                    )}

                    {item.doctor && (
                      <p>
                        <span className="font-medium text-foreground">
                          Doctor:
                        </span>{" "}
                        {item.doctor}
                      </p>
                    )}

                    {item.hospital && (
                      <p>
                        <span className="font-medium text-foreground">
                          Hospital:
                        </span>{" "}
                        {item.hospital}
                      </p>
                    )}

                    {item.summary && (
                      <div className="pt-2">
                        <span className="font-medium text-foreground">
                          AI Summary:
                        </span>

                        <p className="mt-1 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>
                    )}

                    {item.suggested_specialist && (
                      <p>
                        <span className="font-medium text-foreground">
                          Suggested Specialist:
                        </span>{" "}
                        {item.suggested_specialist}
                      </p>
                    )}

                  </div>

                  {/* Findings */}
                  {item.findings &&
                    item.findings.length > 0 && (
                      <div className="mt-4">
                        <p className="font-medium text-sm mb-2">
                          Findings
                        </p>

                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                          {item.findings
                            .slice(0, 3)
                            .map((finding, index) => (
                              <li key={index}>
                                {finding}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}

                  {/* Actions */}
                  <div className="mt-5 pt-4 border-t flex flex-wrap gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        handleViewDetails(item)
                      }
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() =>
                        handleDownload(item.id)
                      }
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="text-destructive hover:text-destructive"
                      disabled={deletingId === item.id}
                      onClick={() =>
                        handleDelete(item.id)
                      }
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}

                      Delete
                    </Button>

                  </div>

                </CardContent>
              </Card>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}