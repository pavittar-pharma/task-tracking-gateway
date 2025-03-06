
import React from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background pt-16 pb-24 sm:pb-32">
      <Container className="relative">
        <div className="mx-auto max-w-3xl pt-10 pb-16 sm:pt-16 lg:pt-20">
          <div className="animate-slide-up text-center">
            <h1 className="heading-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-500 pb-2">
              Pavittar Pharma CRM
            </h1>
            <p className="subtitle-1 mx-auto mt-6 max-w-2xl text-lg sm:text-xl">
              A complete customer relationship management solution designed 
              specifically for pharmaceutical companies.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              A custom build by Rishul Chanana
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link 
                to="/login" 
                className="group relative inline-flex h-12 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#a5f3fc_0%,#8b5cf6_50%,#a5f3fc_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-2 text-sm font-medium text-white backdrop-blur-3xl">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Container>
      
      {/* Abstract shapes in background */}
      <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10">
        <svg viewBox="0 0 1108 632" aria-hidden="true" className="w-[69.25rem] max-w-none">
          <path
            fill="url(#gradient)"
            d="M353 0 0 632V0h353Zm755 0H472L825 632h283V0Z"
          />
          <defs>
            <linearGradient
              id="gradient"
              x1="1108"
              x2="0"
              y1="0"
              y2="0"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8b5cf6" />
              <stop offset=".5" stopColor="#7c3aed" />
              <stop offset="1" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
