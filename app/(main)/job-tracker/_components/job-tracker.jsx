"use client";

import { useMemo, useState } from "react";
import { Briefcase, Building2, Link as LinkIcon, MapPin, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createJobApplication,
  deleteJobApplication,
  updateJobApplicationStatus,
} from "@/actions/job-tracker";
import { DeleteConfirmButton } from "@/components/delete-confirm-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const STATUSES = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
  { value: "archived", label: "Archived" },
];

const emptyForm = {
  companyName: "",
  jobTitle: "",
  status: "saved",
  location: "",
  jobUrl: "",
  notes: "",
  resumeVersionId: "",
  coverLetterId: "",
};

export default function JobTracker({ initialApplications, resumeVersions, coverLetters }) {
  const [applications, setApplications] = useState(initialApplications || []);
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  const counts = useMemo(
    () =>
      applications.reduce((acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      }, {}),
    [applications]
  );
  const resumeVersionMap = useMemo(
    () => new Map(resumeVersions.map((version) => [version.id, version])),
    [resumeVersions]
  );
  const coverLetterMap = useMemo(
    () => new Map(coverLetters.map((letter) => [letter.id, letter])),
    [coverLetters]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const created = await createJobApplication(form);
      setApplications((prev) => [created, ...prev]);
      setForm(emptyForm);
      toast.success("Job added to tracker");
    } catch (error) {
      toast.error(error.message || "Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    const previous = applications;
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );

    try {
      await updateJobApplicationStatus(id, status);
    } catch {
      setApplications(previous);
      toast.error("Could not update status");
    }
  };

  const handleDelete = async (id) => {
    const previous = applications;
    setApplications((prev) => prev.filter((app) => app.id !== id));

    try {
      await deleteJobApplication(id);
      toast.success("Job removed");
    } catch {
      setApplications(previous);
      toast.error("Could not remove job");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card/80 p-6 shadow-sm  ">
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Job Tracker</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track applications, attach generated assets, and keep your pipeline moving.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {STATUSES.map((status) => (
          <Card key={status.value}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{status.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{counts[status.value] || 0}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Job
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(event) => setForm({ ...form, companyName: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Role</Label>
                <Input
                  id="jobTitle"
                  value={form.jobTitle}
                  onChange={(event) => setForm({ ...form, jobTitle: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm  "
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                >
                  {STATUSES.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(event) => setForm({ ...form, location: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  value={form.jobUrl}
                  onChange={(event) => setForm({ ...form, jobUrl: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resumeVersionId">Resume Version</Label>
                <select
                  id="resumeVersionId"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm  "
                  value={form.resumeVersionId}
                  onChange={(event) => setForm({ ...form, resumeVersionId: event.target.value })}
                >
                  <option value="">No resume attached</option>
                  {resumeVersions.map((version) => (
                    <option key={version.id} value={version.id}>
                      {version.title} ({version.atsScore ?? "N/A"} ATS)
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverLetterId">Cover Letter</Label>
                <select
                  id="coverLetterId"
                  className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm shadow-sm  "
                  value={form.coverLetterId}
                  onChange={(event) => setForm({ ...form, coverLetterId: event.target.value })}
                >
                  <option value="">No cover letter attached</option>
                  {coverLetters.map((letter) => (
                    <option key={letter.id} value={letter.id}>
                      {letter.companyName} - {letter.jobTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={(event) => setForm({ ...form, notes: event.target.value })}
                  rows={4}
                />
              </div>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? "Saving..." : "Save Job"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid auto-rows-max content-start gap-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No jobs tracked yet. Add the first opportunity from the form.
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-teal-500" />
                          <h2 className="text-xl font-semibold">{application.jobTitle}</h2>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            {application.companyName}
                          </span>
                          {application.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {application.location}
                            </span>
                          )}
                          {application.jobUrl && (
                            <a
                              href={application.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-primary hover:text-primary"
                            >
                              <LinkIcon className="h-4 w-4" />
                              Job post
                            </a>
                          )}
                        </div>
                      </div>
                      {application.notes && (
                        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                          {application.notes}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2">
                        {application.resumeVersionId && (
                          <Badge variant="secondary">
                            Resume: {resumeVersionMap.get(application.resumeVersionId)?.title || "Attached version"}
                          </Badge>
                        )}
                        {application.coverLetterId && (
                          <Badge variant="outline">
                            Cover letter: {
                              coverLetterMap.get(application.coverLetterId)
                                ? `${coverLetterMap.get(application.coverLetterId).companyName} - ${coverLetterMap.get(application.coverLetterId).jobTitle}`
                                : "Attached letter"
                            }
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-lg border border-border bg-card px-3 py-2 text-sm capitalize shadow-sm  "
                        value={application.status}
                        onChange={(event) =>
                          handleStatusChange(application.id, event.target.value)
                        }
                      >
                        {STATUSES.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <DeleteConfirmButton
                        title="Are you sure you want to delete this job?"
                        description="This job application will be permanently removed from your tracker."
                        onConfirm={() => handleDelete(application.id)}
                        buttonProps={{
                          variant: "ghost",
                          size: "icon",
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </DeleteConfirmButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
