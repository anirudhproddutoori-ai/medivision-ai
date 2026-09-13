import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  FileText,
  Image as ImageIcon,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

interface HistoryItem {
  id: string;
  type?: string;
  created_at?: string;

  risk_level?: string | null;
  summary?: string;
  file_name?: string;
  suggested_specialist?: string | null;
}

interface ActivityData {
  name: string;
  reports: number;
}

export function PatientDashboard() {
  const navigate = useNavigate();

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("medivision_access_token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        "http://127.0.0.1:8000/api/history",
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
        throw new Error("Failed to load dashboard data");
      }

      const data = await response.json();

      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Dashboard loading error:", err);
      setError("Unable to load your dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const reportsCount = useMemo(() => {
    return history.filter(
      (item) => item.type?.toLowerCase() === "report"
    ).length;
  }, [history]);

  const imagesCount = useMemo(() => {
    return history.filter(
      (item) => item.type?.toLowerCase() === "image"
    ).length;
  }, [history]);

  const analysesCount = history.length;

  /*
   * Health score calculation.
   *
   * This is an application-level score based on the risk levels
   * returned by the AI analyses. It is NOT a medical diagnosis.
   */
  const healthScore = useMemo(() => {
    if (history.length === 0) {
      return null;
    }

    const scoredRecords = history
      .map((item) => {
        const risk = item.risk_level?.toLowerCase();

        if (risk === "low") return 100;
        if (risk === "moderate" || risk === "medium") return 70;
        if (risk === "high") return 40;

        return null;
      })
      .filter((score): score is number => score !== null);

    if (scoredRecords.length === 0) {
      return null;
    }

    const total = scoredRecords.reduce(
      (sum, score) => sum + score,
      0
    );

    return Math.round(total / scoredRecords.length);
  }, [history]);

  /*
   * Create the last 6 months dynamically.
   * The graph is based on actual records from MongoDB.
   */
  const activityData = useMemo(() => {
    const now = new Date();

    const months: ActivityData[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - i,
        1
      );

      months.push({
        name: date.toLocaleString("en-IN", {
          month: "short",
        }),
        reports: 0,
      });
    }

    history.forEach((item) => {
      if (!item.created_at) return;

      const created = new Date(item.created_at);

      if (Number.isNaN(created.getTime())) return;

      const monthDifference =
        (now.getFullYear() - created.getFullYear()) * 12 +
        (now.getMonth() - created.getMonth());

      if (monthDifference >= 0 && monthDifference <= 5) {
        const index = 5 - monthDifference;

        if (months[index]) {
          months[index].reports += 1;
        }
      }
    });

    return months;
  }, [history]);

  const healthScoreText =
    healthScore === null
      ? "N/A"
      : `${healthScore}/100`;

  const healthScoreTrend =
    history.length === 0
      ? "No analyses yet"
      : healthScore === null
      ? "No risk data available"
      : "Based on your AI analysis results";

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8">
            <div className="flex flex-col items-center text-center gap-4">
              <AlertCircle className="h-10 w-10 text-destructive" />

              <div>
                <h2 className="text-xl font-semibold">
                  Unable to load dashboard
                </h2>

                <p className="text-muted-foreground mt-1">
                  {error}
                </p>
              </div>

              <Button
                type="button"
                onClick={loadDashboardData}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="text-muted-foreground">
          Welcome back. Here's an overview of your health profile.
        </p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        {/* Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Reports Uploaded
              </CardTitle>

              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {reportsCount}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Real uploaded medical reports
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Medical Images
              </CardTitle>

              <ImageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {imagesCount}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Real X-rays, MRI and image analyses
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                AI Analyses
              </CardTitle>

              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {analysesCount}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Total completed analyses
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Health Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Health Score
              </CardTitle>

              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {healthScoreText}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                {healthScoreTrend}
              </p>
            </CardContent>
          </Card>
        </motion.div>

      </div>

      {/* GRAPH + QUICK ACTIONS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

        {/* REAL ACTIVITY GRAPH */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>
              Activity Overview
            </CardTitle>
          </CardHeader>

          <CardContent className="pl-0">
            <div className="h-[300px]">

              {history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  No medical activity yet.
                </div>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >
                  <AreaChart
                    data={activityData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <defs>
                      <linearGradient
                        id="colorReports"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#2563EB"
                          stopOpacity={0.3}
                        />

                        <stop
                          offset="95%"
                          stopColor="#2563EB"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <XAxis
                      dataKey="name"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip />

                    <Area
                      type="monotone"
                      dataKey="reports"
                      stroke="#2563EB"
                      fillOpacity={1}
                      fill="url(#colorReports)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}

            </div>
          </CardContent>
        </Card>

        {/* QUICK ACTIONS */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>
              Quick Actions
            </CardTitle>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">

            <Link
              to="/dashboard/upload"
              className={buttonVariants({
                variant: "outline",
                className:
                  "w-full justify-start h-12",
              })}
            >
              <FileText className="mr-2 h-5 w-5 text-blue-500" />
              Upload New Report
            </Link>

            <Link
              to="/dashboard/upload"
              className={buttonVariants({
                variant: "outline",
                className:
                  "w-full justify-start h-12",
              })}
            >
              <ImageIcon className="mr-2 h-5 w-5 text-emerald-500" />
              Upload X-ray / MRI
            </Link>

            <Link
              to="/dashboard/chat"
              className={buttonVariants({
                variant: "outline",
                className:
                  "w-full justify-start h-12",
              })}
            >
              <Activity className="mr-2 h-5 w-5 text-purple-500" />
              Consult AI Assistant
            </Link>

            <Link
              to="/dashboard/history"
              className={buttonVariants({
                variant: "outline",
                className:
                  "w-full justify-start h-12",
              })}
            >
              <TrendingUp className="mr-2 h-5 w-5 text-orange-500" />
              View Patient History
            </Link>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}