"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn.email({ email, password });
    if (error) {
      setError(error.message ?? "Login failed");
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
        <CardTitle className="font-serif text-2xl text-primary text-center">Sign In</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" className="w-full bg-primary hover:bg-primary-light text-white" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs text-muted-foreground">
            <span className="bg-card px-2">or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" type="button" onClick={() => handleOAuth("google")}>Google</Button>
          <Button variant="outline" type="button" onClick={() => handleOAuth("facebook")}>Facebook</Button>
          <Button variant="outline" type="button" onClick={() => handleOAuth("apple")}>Apple</Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center text-sm">
        <span className="text-muted-foreground">No account?&nbsp;</span>
        <Link href="/register" className="text-primary hover:underline font-medium">Create one</Link>
      </CardFooter>
    </Card>
  );
}
