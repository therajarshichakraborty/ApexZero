import { LoginForm } from "@/components/auth/login-form";
import { SiteHeader } from "@/components/site-header";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-screen flex-col bg-background antialiased overflow-hidden">
      <style>{`
        @keyframes login-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0px); }
        }
        .login-in {
          animation: login-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .login-in-delay {
          animation: login-fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.07s both;
        }
      `}</style>

      {/* Ambient background — same vars as globals.css */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(60rem 40rem at 15% -10%, var(--ambient-1), transparent 60%),
            radial-gradient(50rem 35rem at 100% 100%, var(--ambient-2), transparent 65%)
          `,
        }}
      />

      {/* Shared navbar — nav links hidden since this isn't the landing page */}
      <div className="login-in relative z-10">
        <SiteHeader showNav={false} minimal />
      </div>

      {/* Centered form */}
      <div className="login-in-delay relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[340px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
