"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthFormSchema, AuthForm, SigninResponse } from "@/types";
import { apiClient } from "@/lib/AxiosHandling";
import { useAuthStore } from "@/stores/authStore";

function SigninComponent() {
  const form = useForm<AuthForm>({
    resolver: zodResolver(AuthFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const router = useRouter();
  const { setAuth } = useAuthStore();

  async function onSubmit(data: AuthForm) {
    try {
      const res = await apiClient.post<SigninResponse>("user/signin", data);
      
      // Save token to localStorage and auth store
      localStorage.setItem("authorization", res.data.jwt);
      localStorage.setItem("user", JSON.stringify({ name: data.username }));
      
      setAuth(res.data.jwt, { name: data.username });
      
      toast.success("Login successful!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sign In</CardTitle>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                {...form.register("username")}
                placeholder="Enter username"
              />
              {form.formState.errors.username && (
                <FieldError>{form.formState.errors.username.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...form.register("password")}
                type="password"
                placeholder="Enter password"
              />
              {form.formState.errors.password && (
                <FieldError>{form.formState.errors.password.message}</FieldError>
              )}
            </Field>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button 
              type="submit" 
              className="w-full mt-8"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="link"
              onClick={() => router.push("/signup")}
            >
              Don&apos;t have an account? Sign Up
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default SigninComponent;
