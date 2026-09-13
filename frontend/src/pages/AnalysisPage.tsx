import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Printer,
  Share2,
  Activity,
  Brain,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  CalendarDays,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

type AnalysisResult = {
  result?: string;
  analysis?: string;
  prediction?: string;
  confidence?: number;
  observation?: string;
  findings?: string[];
  recommendations?: string[];
  suggested_specialist?: string;
  summary?: string;
  risk_level?: string;
  [key: string]: any;
};

type UploadedFile = {
  name?: string;
  type?: string;
  url?: string;
};

export function AnalysisPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [file, setFile] = useState<UploadedFile | null>(null);

  useEffect(() => {
    try {
      const storedResult = sessionStorage.getItem(
        "medivision_analysis_result"
      );

      const storedFile = sessionStorage.getItem(
        "medivision_analysis_file"
      );

      if (storedResult) {
        setResult(JSON.parse(storedResult));
      }

      if (storedFile) {
        setFile(JSON.parse(storedFile));
      }
    } catch (error) {
      console.error("Unable to read analysis result:", error);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AI Analysis Report
          </h1>

          <p className="text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse text-blue-500" />
            Loading analysis result...
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="h-[500px] w-full rounded-xl" />

          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <Skeleton className="h-[200px] w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center">
        <Card>
          <CardContent className="pt-10 pb-10">
            <Brain className="h-12 w-12 mx-auto mb-4 text-blue-500" />

            <h2 className="text-2xl font-bold mb-2">
              No Analysis Result
            </h2>

            <p className="text-muted-foreground mb-6">
              Upload a medical report or diagnostic image to start an AI
              analysis.
            </p>

            <Button
              type="button"
              onClick={() => navigate("/dashboard/upload")}
            >
              Upload File
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const prediction =
    result.prediction ||
    result.analysis ||
    result.summary ||
    "Analysis completed";

  const confidence =
    typeof result.confidence === "number"
      ? result.confidence
      : null;

  const observation =
    result.observation ||
    result.result ||
    result.summary ||
    "The AI analysis result was returned successfully.";

  const findings = Array.isArray(result.findings)
    ? result.findings
    : [];

  const recommendations = Array.isArray(result.recommendations)
    ? result.recommendations
    : [];

  const fileName = file?.name || "Uploaded medical file";

  const handleScheduleAppointment = () => {
    console.log("Opening appointment page...");
    navigate("/dashboard/appointments");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            AI Analysis Report
          </h1>

          <p className="text-muted-foreground">
            Generated on {new Date().toLocaleDateString()}
          </p>

          <p className="text-sm text-muted-foreground mt-1">
            File: {fileName}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard?.writeText(
                window.location.href
              );
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4 mr-2" />
            Download / Print
          </Button>

        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Uploaded File */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="overflow-hidden">

            <div className="bg-slate-900 min-h-[400px] flex items-center justify-center p-6">

              {file?.url ? (
                <img
                  src={file.url}
                  alt={fileName}
                  className="max-h-[500px] max-w-full object-contain rounded"
                />
              ) : (
                <div className="text-center text-white">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-70" />

                  <p className="font-medium">
                    {fileName}
                  </p>

                  <p className="text-sm opacity-70 mt-2">
                    Uploaded file
                  </p>
                </div>
              )}

            </div>

            <CardContent className="p-4 bg-slate-50 dark:bg-slate-900 border-t">

              <div className="flex flex-wrap justify-between gap-2 items-center">

                <div className="text-sm font-medium">
                  {file?.type || "Medical File"}
                </div>

                <Badge variant="secondary">
                  {fileName}
                </Badge>

              </div>

            </CardContent>

          </Card>
        </motion.div>

        {/* AI Results */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >

          {/* Primary Result */}
          <Card className="border-blue-200 dark:border-blue-900 relative overflow-hidden">

            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />

            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-500" />
                AI Analysis
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">

              <div>

                <h3 className="text-2xl font-bold mb-4">
                  {prediction}
                </h3>

                {confidence !== null && (
                  <div>

                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        AI Confidence
                      </span>

                      <span className="font-bold">
                        {confidence}%
                      </span>
                    </div>

                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">

                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{
                          width: `${Math.min(
                            Math.max(confidence, 0),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>
                )}

              </div>

              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg text-sm">

                <p className="font-medium mb-2">
                  AI Observation
                </p>

                <p className="text-muted-foreground whitespace-pre-wrap">
                  {observation}
                </p>

              </div>

              {result.risk_level && (
                <div className="text-sm">
                  <span className="font-medium">
                    Risk Level:
                  </span>{" "}
                  <Badge variant="secondary">
                    {result.risk_level}
                  </Badge>
                </div>
              )}

            </CardContent>

          </Card>

          {/* Detailed Findings */}
          <Card>

            <CardHeader>
              <CardTitle>
                Detailed Findings
              </CardTitle>
            </CardHeader>

            <CardContent>

              {findings.length > 0 ? (
                <div className="space-y-4">

                  {findings.map((finding, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />

                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {finding}
                      </p>
                    </div>
                  ))}

                </div>
              ) : (
                <div className="flex items-start gap-3">

                  <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />

                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {observation}
                  </p>

                </div>
              )}

            </CardContent>

          </Card>

          {/* Recommendations */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">

            <CardHeader>
              <CardTitle className="text-lg">
                Recommended Next Steps
              </CardTitle>
            </CardHeader>

            <CardContent>

              {recommendations.length > 0 ? (
                <ul className="space-y-3">

                  {recommendations.map(
                    (recommendation, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <ChevronRight className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />

                        <span>
                          {recommendation}
                        </span>
                      </li>
                    )
                  )}

                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No specific recommendations were returned
                  by the AI.
                </p>
              )}

              {/* Schedule Appointment */}
              <Button
                type="button"
                className="mt-5 w-full"
                variant="outline"
                onClick={handleScheduleAppointment}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                Schedule Appointment
              </Button>

            </CardContent>

          </Card>

          {/* Medical Disclaimer */}
          <p className="text-xs text-muted-foreground text-center px-4">
            AI-generated information is for informational and
            decision-support purposes only and is not a
            substitute for evaluation by a qualified healthcare
            professional.
          </p>

        </motion.div>

      </div>

    </div>
  );
}