import { ReactNode } from "react";
import Container from "@/components/layout/Container";
import AuthBackground from "./AuthBackground";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#09090B] via-[#111827] to-[#09090B] pt-24 text-white">

      <AuthBackground />

      <Container>
        <div className="grid min-h-screen lg:grid-cols-2">

          {/* Left */}
          <div className="hidden lg:flex flex-col justify-center pr-16 -translate-y-16">

            <span className="mb-4 text-sm uppercase tracking-[0.35em] text-purple-500">
              Premium Anime Streetwear
            </span>

            <h1 className="text-6xl font-black leading-tight">
              {title}
            </h1>

            <p className="mt-6 max-w-md text-lg text-zinc-400">
              {subtitle}
            </p>

          </div>

          {/* Right */}
          <div className="flex items-center justify-center py-20">
            {children}
          </div>

        </div>
      </Container>

    </main>
  );
}