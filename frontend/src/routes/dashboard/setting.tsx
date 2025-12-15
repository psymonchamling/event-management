import { createFileRoute, useNavigate } from "@tanstack/react-router";
import React from "react";
import { Mail, User, Globe2, MapPin, Bell, Shield, Trash2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import authAxios from "@/services/authAxios";
import useGetCurrentUser from "@/hooks/useGetCurrentUser.hook";

export const Route = createFileRoute("/dashboard/setting")({
  component: DashboardSettingPage,
});

function DashboardSettingPage() {
  const navigate = useNavigate();
  const { userData, refetchUserData, isFetchingUserData } = useGetCurrentUser();

  const [profile, setProfile] = React.useState({
    name: "",
    email: "",
    bio: "",
    organization: "",
    website: "",
    location: "",
    timezone: "",
  });

  const [notifications, setNotifications] = React.useState({
    newRegistration: true,
    eventReminder: true,
    lowCapacity: false,
  });

  const [defaults, setDefaults] = React.useState({
    venueType: "Online" as "Online" | "In-person" | "",
    defaultPrice: "",
    defaultCapacity: "",
    defaultDuration: "",
  });

  const [isSavingProfile, setIsSavingProfile] = React.useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Fetch current user details on mount
    refetchUserData();
  }, [refetchUserData]);

  React.useEffect(() => {
    if (userData?.user) {
      setProfile((prev) => ({
        ...prev,
        name: userData?.user?.name ?? "",
        email: userData?.user?.email ?? "",
        bio: userData?.user?.bio ?? "",
        organization: userData?.user?.organization ?? "",
        website: userData?.user?.website ?? "",
        location: userData?.user?.location ?? "",
        timezone: userData?.user?.timezone ?? "",
      }));
    }
  }, [userData]);

  const handleProfileChange =
    (field: keyof typeof profile) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setProfile((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleDefaultsChange =
    (field: keyof typeof defaults) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setDefaults((prev) => ({
        ...prev,
        [field]:
          field === "venueType"
            ? (e.target.value as "Online" | "In-person" | "")
            : e.target.value,
      }));
    };

  async function handleSaveProfile() {
    try {
      setIsSavingProfile(true);
      setStatusMessage(null);
      setErrorMessage(null);

      await authAxios.patch("/api/userdetail", {
        name: profile.name,
        bio: profile.bio,
        organization: profile.organization,
        website: profile.website,
        location: profile.location,
        timezone: profile.timezone,
      });

      await refetchUserData();
      setStatusMessage("Profile updated successfully.");
    } catch (err) {
      console.error("Failed to update profile", err);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handleDeleteAccount() {
    try {
      setIsDeletingAccount(true);
      setErrorMessage(null);

      await authAxios.delete("/api/userdetail");

      // Navigate to homepage after successful deletion
      navigate({ to: "/" });
    } catch (err) {
      console.error("Failed to delete account", err);
      setErrorMessage("Failed to delete account. Please try again.");
    } finally {
      setIsDeletingAccount(false);
    }
  }

  return (
    <div className="px-4 lg:px-6 py-4 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-foreground">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your profile, notifications, and default event preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {statusMessage && (
            <span className="text-xs text-emerald-600">{statusMessage}</span>
          )}
          {errorMessage && (
            <span className="text-xs text-red-500">{errorMessage}</span>
          )}
          <Button
            size="sm"
            onClick={handleSaveProfile}
            disabled={isSavingProfile || isFetchingUserData}
          >
            {isSavingProfile ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: profile & organizer info */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={profile.name}
                    onChange={handleProfileChange("name")}
                    disabled={isFetchingUserData}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      value={profile.email}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Email is used for login and important notifications.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="bio">Short bio</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  placeholder="Tell attendees a bit about yourself and your events..."
                  value={profile.bio}
                  onChange={handleProfileChange("bio")}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe2 className="h-4 w-4" />
                Organizer details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="org">Organization / Brand</Label>
                  <Input
                    id="org"
                    placeholder="Your organization or brand name"
                    value={profile.organization}
                    onChange={handleProfileChange("organization")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourcompany.com"
                    value={profile.website}
                    onChange={handleProfileChange("website")}
                  />
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="location">Default location</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <Input
                      id="location"
                      placeholder="City, Country"
                      className="pl-9"
                      value={profile.location}
                      onChange={handleProfileChange("location")}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    placeholder="e.g., UTC+5:45 (Asia/Kathmandu)"
                    value={profile.timezone}
                    onChange={handleProfileChange("timezone")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: notifications & defaults */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications <br />
                (Non functional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    New registrations
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get an email whenever someone registers for your events.
                  </p>
                </div>
                <Switch
                  checked={notifications.newRegistration}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      newRegistration: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Event reminders
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Receive reminders before your events go live.
                  </p>
                </div>
                <Switch
                  checked={notifications.eventReminder}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      eventReminder: checked,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Low capacity alerts
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Get notified when an event is close to selling out.
                  </p>
                </div>
                <Switch
                  checked={notifications.lowCapacity}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({
                      ...prev,
                      lowCapacity: checked,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Event defaults
                <br /> (Non-functional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y=1.5">
                <Label htmlFor="default-venue">Default venue type</Label>
                <select
                  id="default-venue"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={defaults.venueType}
                  onChange={handleDefaultsChange("venueType")}
                >
                  <option value="">No default</option>
                  <option value="Online">Online</option>
                  <option value="In-person">In-person</option>
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="default-price">Default ticket price</Label>
                  <Input
                    id="default-price"
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="e.g., 20.00"
                    value={defaults.defaultPrice}
                    onChange={handleDefaultsChange("defaultPrice")}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="default-capacity">Default capacity</Label>
                  <Input
                    id="default-capacity"
                    type="number"
                    min={0}
                    placeholder="e.g., 100"
                    value={defaults.defaultCapacity}
                    onChange={handleDefaultsChange("defaultCapacity")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="default-duration">Default event duration</Label>
                <Input
                  id="default-duration"
                  type="number"
                  min={15}
                  step={15}
                  placeholder="e.g., 60 (minutes)"
                  value={defaults.defaultDuration}
                  onChange={handleDefaultsChange("defaultDuration")}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="h-4 w-4" />
                Danger zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                Deleting your account will remove your profile and access to the
                dashboard. Existing events and registrations may be affected.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full"
                    disabled={isDeletingAccount}
                  >
                    {isDeletingAccount ? "Deleting..." : "Delete my account"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete your account?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your access to the dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeletingAccount}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDeleteAccount}
                      disabled={isDeletingAccount}
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardSettingPage;
