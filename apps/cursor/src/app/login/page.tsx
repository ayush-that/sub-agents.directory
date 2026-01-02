import { Login } from "@/components/login";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 w-full max-w-sm mx-auto">
      <div className="max-w-md w-full text-center -mt-32">
        <Suspense fallback={null}>
          <Login />
        </Suspense>
      </div>
    </div>
  );
}
