import { useState, DragEvent, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUp, File, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...Array.from(e.dataTransfer.files),
      ]);
    }
  };

  const handleFileSelect = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [
        ...prev,
        ...Array.from(e.target.files!),
      ]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select a file first.");
      return;
    }

    // Backend currently analyzes one file per request.
    const file = files[0];

    // Get authentication token saved during login.
    const token = localStorage.getItem(
      "medivision_access_token"
    );

    if (!token) {
      toast.error(
        "You are not logged in. Please login again."
      );
      navigate("/login");
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      const formData = new FormData();

      // Backend expects the field name "file".
      formData.append("file", file);

      // PDF → report analysis
      // JPG/PNG/JPEG/DICOM → image analysis
      const isReport =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");

      const endpoint = isReport
        ? `${API_URL}/api/analysis/report`
        : `${API_URL}/api/analysis/image`;

      setProgress(30);

      // IMPORTANT:
      // Send the JWT token to FastAPI.
      //
      // DO NOT manually set Content-Type here.
      // The browser automatically creates the correct
      // multipart/form-data boundary for FormData.
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      setProgress(70);

      if (!response.ok) {
        let errorMessage = "AI analysis failed.";

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            errorMessage =
              typeof errorData.detail === "string"
                ? errorData.detail
                : JSON.stringify(errorData.detail);
          }

          // Token may have expired or become invalid.
          if (response.status === 401) {
            localStorage.removeItem(
              "medivision_access_token"
            );

            localStorage.removeItem(
              "medivision_token_type"
            );

            errorMessage =
              "Your login session has expired. Please login again.";
          }
        } catch {
          // Ignore JSON parsing errors.
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      console.log(
        "REAL AI ANALYSIS RESULT:",
        result
      );

      setProgress(100);

      // Store actual backend AI result temporarily.
      sessionStorage.setItem(
        "medivision_analysis_result",
        JSON.stringify(result)
      );

      // Store actual uploaded file information.
      sessionStorage.setItem(
        "medivision_analysis_file",
        JSON.stringify({
          name: file.name,
          type: file.type,
          size: file.size,
        })
      );

      toast.success(
        "AI analysis completed successfully!"
      );

      setTimeout(() => {
        navigate("/dashboard/analysis");
      }, 500);

    } catch (error) {
      console.error(
        "Upload/analysis error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to connect to the AI analysis server."
      );

      setProgress(0);

    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Upload Documents
        </h1>

        <p className="text-muted-foreground">
          Upload your medical reports, X-rays, MRIs,
          or CT scans for AI-assisted analysis.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">

          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() =>
              document
                .getElementById("file-upload")
                ?.click()
            }
          >

            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
              <FileUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>

            <h3 className="text-xl font-semibold mb-2">
              Click or drag files here
            </h3>

            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Support for DICOM, PDF, JPG, PNG,
              JPEG, and TIFF formats up to 50MB per file.
            </p>

            <Button
              variant="outline"
              className="pointer-events-none"
            >
              Select Files
            </Button>

            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.jpg,.jpeg,.png,.dicom,.dcm,.tiff"
            />

          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
          >

            <Card>

              <CardHeader>
                <CardTitle className="text-lg">
                  Selected Files ({files.length})
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">

                <div className="space-y-3">

                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{
                        opacity: 0,
                        x: -20,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 dark:bg-slate-900/50"
                    >

                      <div className="flex items-center gap-3 overflow-hidden">

                        <div className="h-10 w-10 shrink-0 rounded bg-white dark:bg-slate-800 border flex items-center justify-center">
                          <File className="h-5 w-5 text-slate-400" />
                        </div>

                        <div className="truncate">

                          <p className="text-sm font-medium truncate">
                            {file.name}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {(
                              file.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          removeFile(index)
                        }
                        disabled={uploading}
                        className="text-slate-400 hover:text-destructive shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>

                    </motion.div>
                  ))}

                </div>

                {/* Progress */}
                {uploading && (
                  <div className="space-y-2 pt-4 border-t">

                    <div className="flex items-center justify-between text-sm">

                      <span>
                        Uploading and Analyzing...
                      </span>

                      <span className="font-medium">
                        {progress}%
                      </span>

                    </div>

                    <Progress
                      value={progress}
                      className="h-2"
                    />

                  </div>
                )}

                {/* Start Analysis */}
                <div className="pt-4 flex justify-end">

                  <Button
                    onClick={handleUpload}
                    disabled={
                      uploading ||
                      files.length === 0
                    }
                    className="w-full sm:w-auto"
                  >
                    {uploading
                      ? "Processing..."
                      : "Start AI Analysis"}
                  </Button>

                </div>

              </CardContent>

            </Card>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}