import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  UserRound,
  Stethoscope,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function AppointmentPage() {
  const navigate = useNavigate();

  const [specialist, setSpecialist] = useState("");
  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  // ---------------------------------------------------------
  // Get specialist suggested by AI analysis
  // ---------------------------------------------------------
  useEffect(() => {
    try {
      const savedResult = sessionStorage.getItem(
        "medivision_analysis_result"
      );

      if (savedResult) {
        const result = JSON.parse(savedResult);

        if (result?.suggested_specialist) {
          setSpecialist(result.suggested_specialist);
        }
      }
    } catch (error) {
      console.error("Could not read analysis result:", error);
    }
  }, []);

  // ---------------------------------------------------------
  // Book appointment
  // ---------------------------------------------------------
  const handleBookAppointment = async () => {
    if (!specialist) {
      toast.error("Please select a specialist.");
      return;
    }

    if (!date) {
      toast.error("Please select an appointment date.");
      return;
    }

    if (!time) {
      toast.error("Please select an appointment time.");
      return;
    }

    if (!reason.trim()) {
      toast.error("Please enter the reason for the appointment.");
      return;
    }

    setLoading(true);

    try {
      const existingAppointments = JSON.parse(
        localStorage.getItem("medivision_appointments") || "[]"
      );

      const appointment = {
        id: `APT-${Date.now()}`,
        specialist: specialist,
        doctor: doctor || "Any available doctor",
        date: date,
        time: time,
        reason: reason,
        createdAt: new Date().toISOString(),
        status: "Scheduled",
      };

      existingAppointments.push(appointment);

      localStorage.setItem(
        "medivision_appointments",
        JSON.stringify(existingAppointments)
      );

      setBooked(true);

      toast.success("Appointment scheduled successfully!");
    } catch (error) {
      console.error("Appointment booking error:", error);
      toast.error("Unable to schedule appointment.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------
  // Appointment confirmation
  // ---------------------------------------------------------
  if (booked) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-6">
        <Card className="w-full max-w-xl shadow-lg">
          <CardContent className="pt-10 pb-10 text-center">

            <CheckCircle2 className="mx-auto h-20 w-20 text-green-500 mb-6" />

            <h1 className="text-3xl font-bold mb-3">
              Appointment Scheduled
            </h1>

            <p className="text-muted-foreground mb-8">
              Your appointment has been successfully scheduled.
            </p>

            <div className="rounded-xl border bg-muted/30 p-6 text-left space-y-4 mb-8">

              <div>
                <p className="text-sm text-muted-foreground">
                  Specialist
                </p>

                <p className="font-semibold">
                  {specialist}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Doctor
                </p>

                <p className="font-semibold">
                  {doctor || "Any available doctor"}
                </p>
              </div>

              <div className="flex gap-8">

                <div>
                  <p className="text-sm text-muted-foreground">
                    Date
                  </p>

                  <p className="font-semibold">
                    {date}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    Time
                  </p>

                  <p className="font-semibold">
                    {time}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Reason
                </p>

                <p className="font-semibold">
                  {reason}
                </p>
              </div>

            </div>

            <div className="flex gap-3 justify-center">

              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Go to Dashboard
              </Button>

              <Button
                onClick={() => navigate("/dashboard/appointments")}
              >
                View Appointment
              </Button>

            </div>

          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------------------------------------------------------
  // Appointment form
  // ---------------------------------------------------------
  return (
    <div className="min-h-[calc(100vh-5rem)] p-6">

      <div className="max-w-3xl mx-auto">

        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-5"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="shadow-lg">

          <CardHeader>

            <div className="flex items-center gap-3">

              <div className="rounded-xl bg-primary/10 p-3">
                <Calendar className="h-7 w-7 text-primary" />
              </div>

              <div>

                <CardTitle className="text-2xl">
                  Schedule Appointment
                </CardTitle>

                <p className="text-sm text-muted-foreground mt-1">
                  Book an appointment with a healthcare specialist.
                </p>

              </div>

            </div>

          </CardHeader>

          <CardContent className="space-y-6">

            {/* Specialist */}
            <div className="space-y-2">

              <Label>
                <Stethoscope className="inline h-4 w-4 mr-1" />
                Specialist
              </Label>

              <select
                value={specialist}
                onChange={(e) => setSpecialist(e.target.value)}
                className="w-full h-10 rounded-md border bg-background px-3 text-sm"
              >

                <option value="">
                  Select specialist
                </option>

                <option value="Radiologist">
                  Radiologist
                </option>

                <option value="Cardiologist">
                  Cardiologist
                </option>

                <option value="Neurologist">
                  Neurologist
                </option>

                <option value="Pulmonologist">
                  Pulmonologist
                </option>

                <option value="Orthopedic Specialist">
                  Orthopedic Specialist
                </option>

                <option value="General Physician">
                  General Physician
                </option>

              </select>

              {specialist && (
                <p className="text-xs text-green-600">
                  Suggested based on your AI analysis.
                </p>
              )}

            </div>

            {/* Doctor */}
            <div className="space-y-2">

              <Label>
                <UserRound className="inline h-4 w-4 mr-1" />
                Doctor
              </Label>

              <Input
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                placeholder="Enter preferred doctor name (optional)"
              />

              <p className="text-xs text-muted-foreground">
                Leave empty if you want any available doctor.
              </p>

            </div>

            {/* Date */}
            <div className="space-y-2">

              <Label>
                <Calendar className="inline h-4 w-4 mr-1" />
                Appointment Date
              </Label>

              <Input
                type="date"
                value={date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setDate(e.target.value)}
              />

            </div>

            {/* Time */}
            <div className="space-y-2">

              <Label>
                <Clock className="inline h-4 w-4 mr-1" />
                Appointment Time
              </Label>

              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

            </div>

            {/* Reason */}
            <div className="space-y-2">

              <Label>
                Reason for Appointment
              </Label>

              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe why you want to consult the doctor..."
                rows={5}
              />

            </div>

            {/* Disclaimer */}
            <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground">
              The suggested specialist is based on AI-assisted analysis and
              should not be considered a medical diagnosis. A qualified
              healthcare professional should make the final clinical decision.
            </div>

            {/* Book button */}
            <Button
              className="w-full"
              size="lg"
              onClick={handleBookAppointment}
              disabled={loading}
            >
              {loading ? "Scheduling..." : "Book Appointment"}
            </Button>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}