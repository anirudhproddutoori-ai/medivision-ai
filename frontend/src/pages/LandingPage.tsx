import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Brain,
  FileText,
  HeartPulse,
  ShieldCheck,
  Zap,
  MessageSquare,
  X,
  Upload,
  ScanLine,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export function LandingPage() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 lg:py-32 overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-slate-100/[0.04] bg-[size:20px_20px]" />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-50/50" />

          <div className="container relative z-10 px-4 text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-800 mb-6">
                ✨ Introducing Next-Gen Medical AI
              </div>

              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-slate-50">
                AI-Powered{" "}
                <span className="text-primary">Medical Report</span>{" "}
                & Diagnostic Image Analysis
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                Instantly upload medical reports, X-rays, and MRIs. Our
                hospital-grade AI provides accurate disease predictions,
                detailed summaries, and actionable insights.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/dashboard"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "w-full sm:w-auto h-14 px-8 text-base shadow-lg shadow-primary/25 rounded-xl",
                  })}
                >
                  Start Free Analysis
                </Link>

                {/* WORKING WATCH DEMO BUTTON */}
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-8 text-base rounded-xl"
                  onClick={() => setShowDemo(true)}
                >
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 bg-slate-50 dark:bg-slate-950/50"
        >
          <div className="container px-4 max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Enterprise-Grade AI Capabilities
              </h2>

              <p className="text-muted-foreground max-w-2xl mx-auto">
                Built with state-of-the-art machine learning models to assist
                healthcare professionals and patients with rapid, accurate
                insights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "AI Image Analysis",
                  desc: "Upload X-rays, MRIs, and CT scans for instant abnormality detection and highlighted regions.",
                },
                {
                  icon: FileText,
                  title: "Report Summarization",
                  desc: "Turn complex medical jargon into easy-to-understand summaries with recommended next steps.",
                },
                {
                  icon: MessageSquare,
                  title: "Medical Chatbot",
                  desc: "Interact directly with our trained AI to ask questions about your health records and symptoms.",
                },
                {
                  icon: Zap,
                  title: "Instant Results",
                  desc: "Get comprehensive analysis reports in seconds, not days, speeding up the diagnostic process.",
                },
                {
                  icon: ShieldCheck,
                  title: "Secure & Private",
                  desc: "Bank-level encryption ensures your sensitive health data remains completely confidential.",
                },
                {
                  icon: HeartPulse,
                  title: "Health Tracking",
                  desc: "Monitor your health score and history over time with intuitive charts and timelines.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-background border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                        <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>

                      <h3 className="font-bold text-xl mb-2">
                        {feature.title}
                      </h3>

                      <p className="text-muted-foreground">
                        {feature.desc}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="container max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-500" />
            <span className="font-bold text-xl text-slate-100 tracking-tight">
              MediVision AI
            </span>
          </div>

          <p>© 2026 MediVision AI. All rights reserved.</p>
        </div>
      </footer>

      {/* ================= DEMO MODAL ================= */}
      {showDemo && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowDemo(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl border"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowDemo(false)}
              className="absolute right-4 top-4 z-10 rounded-full p-2 hover:bg-muted transition-colors"
              aria-label="Close demo"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Demo Header */}
            <div className="p-6 md:p-8 border-b bg-slate-50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-11 w-11 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold">
                    MediVision AI Demo
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    See how your medical analysis works
                  </p>
                </div>
              </div>
            </div>

            {/* Demo Content */}
            <div className="p-6 md:p-8 space-y-6">

              {/* STEP 1 */}
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <Upload className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    1. Upload your medical file
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    Upload a medical report, X-ray, MRI or supported
                    diagnostic image.
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <ScanLine className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    2. AI analyzes the file
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    MediVision AI processes the uploaded information and
                    identifies relevant findings.
                  </p>
                </div>
              </div>

              {/* DEMO RESULT */}
              <Card className="border-blue-200 dark:border-blue-900">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-blue-600" />

                      <h3 className="font-semibold">
                        Sample AI Analysis
                      </h3>
                    </div>

                    <span className="text-xs rounded-full bg-emerald-100 text-emerald-700 px-3 py-1">
                      Demo Result
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">

                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Summary
                      </p>

                      <p className="text-sm font-medium">
                        AI-generated summary of the uploaded medical
                        information.
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Risk Level
                      </p>

                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                        <span className="text-sm font-medium">
                          Low / Moderate / High
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Findings
                      </p>

                      <p className="text-sm font-medium">
                        Relevant findings are presented in simple,
                        understandable language.
                      </p>
                    </div>

                    <div className="rounded-lg bg-muted/50 p-4">
                      <p className="text-xs text-muted-foreground mb-1">
                        Specialist
                      </p>

                      <p className="text-sm font-medium">
                        A suggested specialist can be provided when
                        appropriate.
                      </p>
                    </div>

                  </div>
                </CardContent>
              </Card>

              {/* STEP 3 */}
              <div className="flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">
                    3. Get understandable results
                  </h3>

                  <p className="text-sm text-muted-foreground mt-1">
                    Review the AI summary, findings, risk level,
                    recommendations and suggested specialist.
                  </p>
                </div>
              </div>

              {/* START BUTTON */}
              <div className="pt-2 flex justify-end">
                <Link
                  to="/dashboard/upload"
                  onClick={() => setShowDemo(false)}
                  className={buttonVariants({
                    size: "lg",
                    className: "rounded-xl",
                  })}
                >
                  Try MediVision AI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                Demo information is illustrative and does not represent
                an actual medical diagnosis.
              </p>

            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}