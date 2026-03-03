"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function CustomOrderPage() {
  const [form, setForm] = useState({ name: "", email: "", description: "", budget: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/custom-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-6">
          <p className="text-5xl mb-6">🧶</p>
          <h2 className="font-serif text-3xl text-primary mb-4">Request Received</h2>
          <p className="text-muted-foreground">
            Thank you! We'll review your request and get back to you within 2–3 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-xl">
        <h1 className="font-serif text-4xl text-primary mb-4 text-center">Custom Order</h1>
        <p className="text-muted-foreground text-center mb-12">
          Tell us what you have in mind and we'll craft it just for you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm">
          <div className="space-y-1">
            <Label htmlFor="name">Your Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="description">Describe Your Request</Label>
            <Textarea
              id="description"
              rows={5}
              placeholder="What would you like made? Include details like colors, size, occasion…"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="budget">Budget (optional)</Label>
            <Input id="budget" placeholder="e.g. €50–€100" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-primary hover:bg-primary-light h-12">
            {loading ? "Sending…" : "Submit Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
