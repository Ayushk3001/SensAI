"use client";

import { useMemo, useState } from "react";
import { Briefcase, Building2, Link as LinkIcon, MapPin, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="glass-panel p-6 fade-up">
        <Badge variant="outline" className="mb-3 border-primary/25 bg-primary/10 text-primary">
          Pipeline workspace
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">Job Tracker</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Track applications, attach generated assets, and keep your pipeline moving.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {STATUSES.map((status, index) => (
          <Card key={status.value} className={`soft-card-hover fade-up stagger-${Math.min(index + 1, 4)}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{status.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-2">
                <div className="text-3xl font-bold">{counts[status.value] || 0}</div>
                <Badge variant="outline" className={`status-${status.value}`}>{status.label}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="sticky top-24 soft-card-hover">
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
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm({ ...form, status: value })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  value={form.resumeVersionId || "none"}
                  onValueChange={(value) => setForm({ ...form, resumeVersionId: value === "none" ? "" : value })}
                >
                  <SelectTrigger id="resumeVersionId">
                    <SelectValue placeholder="No resume attached" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No resume attached</SelectItem>
                    {resumeVersions.map((version) => (
                      <SelectItem key={version.id} value={version.id}>
                        {version.title} ({version.atsScore ?? "N/A"} ATS)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="coverLetterId">Cover Letter</Label>
                <Select
                  value={form.coverLetterId || "none"}
                  onValueChange={(value) => setForm({ ...form, coverLetterId: value === "none" ? "" : value })}
                >
                  <SelectTrigger id="coverLetterId">
                    <SelectValue placeholder="No cover letter attached" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No cover letter attached</SelectItem>
                    {coverLetters.map((letter) => (
                      <SelectItem key={letter.id} value={letter.id}>
                        {letter.companyName} - {letter.jobTitle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <CardContent className="py-14 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="h-6 w-6" />
                </div>
                <p className="font-semibold text-foreground">No jobs tracked yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Add the first opportunity from the form.</p>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id} className="soft-card-hover">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-teal-500" />
                          <h2 className="text-xl font-semibold">{application.jobTitle}</h2>
                          <Badge variant="outline" className={`status-${application.status}`}>
                            {application.status}
                          </Badge>
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
                      <Select
                        value={application.status}
                        onValueChange={(value) => handleStatusChange(application.id, value)}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUSES.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {application.jobUrl && (
                            <DropdownMenuItem asChild>
                              <a href={application.jobUrl} target="_blank" rel="noreferrer">
                                <LinkIcon className="mr-2 h-4 w-4" />
                                Open job post
                              </a>
                            </DropdownMenuItem>
                          )}
                          <div className="p-1">
                          <DeleteConfirmButton
                            title="Are you sure you want to delete this job?"
                            description="This job application will be permanently removed from your tracker."
                            onConfirm={() => handleDelete(application.id)}
                            buttonProps={{
                              variant: "ghost",
                              className: "w-full justify-start px-2 text-destructive hover:text-destructive",
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete job
                          </DeleteConfirmButton>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
