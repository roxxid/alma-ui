"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "./actions";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, setError } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    const result = await login(undefined, formData);

    if (result?.errors) {
      Object.entries(result.errors).forEach(([field, messages]) => {
        setError(field as keyof LoginFormValues, { message: messages[0] });
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tl from-slate-50 from-80% to-lime-200">
      <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-xl flex-col gap-4">
        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="email">Email</Label>
          <Input id="email" placeholder="Email" {...register("email")} />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="Password" {...register("password")} />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}