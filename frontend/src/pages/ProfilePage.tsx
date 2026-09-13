import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Activity,
  ShieldAlert,
  HeartPulse,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { toast } from "sonner";

const API_URL = "http://127.0.0.1:8000";

interface Profile {
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  allergies?: string[];
  medical_conditions?: string[];
}

export function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("medivision_access_token");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!token) {
      toast.error("Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to load profile");
      }

      setProfile(data);
      setForm(data);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Profile, value: any) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!token || !form) return;

    setSaving(true);

    try {
      const response = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          phone: form.phone || "",
          address: form.address || "",
          age: form.age || null,
          gender: form.gender || "",
          blood_group: form.blood_group || "",
          allergies: form.allergies || [],
          medical_conditions: form.medical_conditions || [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Failed to update profile");
      }

      setProfile(data);
      setForm(data);
      setEditing(false);

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!profile || !form) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <p className="text-muted-foreground">
          Unable to load your profile.
        </p>
      </div>
    );
  }

  const initials =
    form.full_name
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Patient Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information and medical details.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* LEFT PROFILE CARD */}
        <Card className="md:col-span-1">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Avatar className="h-32 w-32 mb-4 border-4 border-slate-100 dark:border-slate-800">
              <AvatarFallback className="text-4xl">
                {initials}
              </AvatarFallback>
            </Avatar>

            <h2 className="text-2xl font-bold">
              {profile.full_name}
            </h2>

            <p className="text-muted-foreground mb-4">
              {profile.email}
            </p>

            {profile.blood_group && (
              <Badge variant="secondary" className="mb-6">
                {profile.blood_group} Blood Group
              </Badge>
            )}

            {!editing ? (
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setEditing(true)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  className="flex-1"
                  onClick={handleSave}
                  disabled={saving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save"}
                </Button>

                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* RIGHT INFORMATION CARD */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">

            {/* FULL NAME */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </p>

              {editing ? (
                <input
                  className="w-full rounded-md border px-3 py-2 bg-background"
                  value={form.full_name || ""}
                  onChange={(e) =>
                    handleChange("full_name", e.target.value)
                  }
                />
              ) : (
                <p className="font-medium">
                  {profile.full_name}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </p>

              <p className="font-medium">
                {profile.email}
              </p>

              {editing && (
                <p className="text-xs text-muted-foreground">
                  Email cannot be changed here.
                </p>
              )}
            </div>

            {/* AGE / GENDER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Age
                </p>

                {editing ? (
                  <input
                    type="number"
                    className="w-full rounded-md border px-3 py-2 bg-background"
                    value={form.age ?? ""}
                    onChange={(e) =>
                      handleChange(
                        "age",
                        e.target.value
                          ? Number(e.target.value)
                          : undefined
                      )
                    }
                  />
                ) : (
                  <p className="font-medium">
                    {profile.age ? `${profile.age} Years` : "Not provided"}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Gender
                </p>

                {editing ? (
                  <input
                    className="w-full rounded-md border px-3 py-2 bg-background"
                    value={form.gender || ""}
                    onChange={(e) =>
                      handleChange("gender", e.target.value)
                    }
                  />
                ) : (
                  <p className="font-medium">
                    {profile.gender || "Not provided"}
                  </p>
                )}
              </div>

            </div>

            {/* PHONE */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </p>

              {editing ? (
                <input
                  className="w-full rounded-md border px-3 py-2 bg-background"
                  value={form.phone || ""}
                  onChange={(e) =>
                    handleChange("phone", e.target.value)
                  }
                />
              ) : (
                <p className="font-medium">
                  {profile.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* ADDRESS */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Address
              </p>

              {editing ? (
                <textarea
                  className="w-full rounded-md border px-3 py-2 bg-background"
                  rows={3}
                  value={form.address || ""}
                  onChange={(e) =>
                    handleChange("address", e.target.value)
                  }
                />
              ) : (
                <p className="font-medium">
                  {profile.address || "Not provided"}
                </p>
              )}
            </div>

            {/* MEDICAL INFORMATION */}
            <div className="border-t pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2 text-rose-500">
                  <ShieldAlert className="h-4 w-4" />
                  Allergies
                </p>

                {profile.allergies?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    None provided
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold flex items-center gap-2 text-blue-500">
                  <HeartPulse className="h-4 w-4" />
                  Medical Conditions
                </p>

                {profile.medical_conditions?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.medical_conditions.map(
                      (condition, index) => (
                        <Badge key={index} variant="outline">
                          {condition}
                        </Badge>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    None provided
                  </p>
                )}
              </div>

            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}