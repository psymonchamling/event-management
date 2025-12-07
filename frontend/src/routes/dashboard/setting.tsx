import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/dashboard/setting")({
  component: DashboardSettingPage,
});

function DashboardSettingPage() {
  const [isSaving, setIsSaving] = React.useState(false);
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  const [form, setForm] = React.useState({
    organizationName: "",
    contactEmail: "",
    phoneNumber: "",
    bio: "",
    logoFile: null as File | null,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const onChange =
    (field: keyof typeof form) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      const value =
        field === "logoFile"
          ? (e.target as HTMLInputElement).files?.[0] ?? null
          : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value as any }));
    };

  function validate() {
    const next: Record<string, string> = {};
    if (!form.organizationName.trim())
      next.organizationName = "Organization name is required";
    if (form.contactEmail && !/^\S+@\S+\.\S+$/.test(form.contactEmail)) {
      next.contactEmail = "Enter a valid email";
    }
    if (form.phoneNumber && !/^[+\d][\d\s\-()]{5,}$/.test(form.phoneNumber)) {
      next.phoneNumber = "Enter a valid phone number";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setForm((p) => ({ ...p, logoFile: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    } else {
      if (logoPreview) URL.revokeObjectURL(logoPreview);
      setLogoPreview(null);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    try {
      // TODO: Wire up to backend (multipart/form-data if uploading a file)
      await new Promise((r) => setTimeout(r, 600));
      // keep on page; optionally show a toast
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="px-4 lg:px-6">
      <header className="mb-6 flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold text-foreground">
            Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your organization profile details shown on event pages.
          </p>
        </div>
        <Button form="settings-form" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </header>

      <form
        id="settings-form"
        onSubmit={onSubmit}
        className="grid gap-6 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 rounded-xl border border-border bg-background p-5">
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Basic Information
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                This information appears on your event pages.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="organizationName">
                Organization Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="organizationName"
                placeholder="e.g., EventHub Inc."
                value={form.organizationName}
                onChange={onChange("organizationName")}
                className={errors.organizationName ? "border-red-500" : undefined}
              />
              {errors.organizationName && (
                <p className="text-xs text-red-500">{errors.organizationName}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@yourexample.com"
                  value={form.contactEmail}
                  onChange={onChange("contactEmail")}
                  className={errors.contactEmail ? "border-red-500" : undefined}
                />
                {errors.contactEmail && (
                  <p className="text-xs text-red-500">{errors.contactEmail}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phoneNumber">Phone Number (optional)</Label>
                <Input
                  id="phoneNumber"
                  placeholder="+1 (555) 000-0000"
                  value={form.phoneNumber}
                  onChange={onChange("phoneNumber")}
                  className={errors.phoneNumber ? "border-red-500" : undefined}
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500">{errors.phoneNumber}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="bio">Bio / Description</Label>
              <textarea
                id="bio"
                rows={6}
                placeholder="Describe your organization and what attendees can expect from your events."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                value={form.bio}
                onChange={onChange("bio") as any}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-5 h-fit">
          <h3 className="text-sm font-semibold text-foreground">
            Profile Picture (Logo)
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Upload your organization logo for branding on event pages.
          </p>
          <div className="mt-4 flex items-start gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-md border border-border bg-muted/30">
              {logoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
                  No logo
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  id="logoFile"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileRef.current?.click()}
                >
                  Upload Logo
                </Button>
                {form.logoFile && (
                  <span className="text-xs text-muted-foreground">
                    {form.logoFile.name}
                  </span>
                )}
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                PNG or JPG, up to 2MB. Square images recommended.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default DashboardSettingPage;
