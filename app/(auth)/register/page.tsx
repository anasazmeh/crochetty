"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signUp.email({ name, email, password });
    if (error) {
      setError(error.message ?? "Registration failed");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  const handleOAuth = (provider: "google" | "facebook" | "apple") =>
    signIn.social({ provider, callbackURL: "/dashboard" });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-serif text-2xl text-primary text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary-light text-white" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" type="button" onClick={() => handleOAuth("google")}>Google</Button>
          <Button variant="outline" type="button" onClick={() => handleOAuth("facebook")}>Facebook</Button>
          <Button variant="outline" type="button" onClick={() => handleOAuth("apple")}>Apple</Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <span className="text-muted-foreground">Have an account?&nbsp;</span>
        <Link href="/login" className="text-primary hover:underline font-medium">Sign in</Link>
      </CardFooter>
    </Card>
  );
}
