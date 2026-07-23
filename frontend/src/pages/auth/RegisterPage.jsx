import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormSelect from "@/components/FormSelect";

import { useState } from "react";
import useAuthStore from "@/store/authStore";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [membershipType, setMembershipType] = useState("ON_CAMPUS");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, phone, membershipType);
      navigate("/pending-approval");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>Create a new member account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error && <div className="text-destructive text-sm font-medium">{error}</div>}
          <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="membershipType">Membership Type</Label>
            <FormSelect
              triggerId="membershipType"
              value={membershipType}
              onValueChange={(value) => setMembershipType(value)}
              options={[
                { value: "ON_CAMPUS", label: "On Campus" },
                { value: "OFF_CAMPUS", label: "Off Campus" },
              ]}
              placeholder="Select Membership Type"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
