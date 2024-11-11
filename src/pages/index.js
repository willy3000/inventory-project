import Image from "next/image";
import localFont from "next/font/local";
import { useEffect } from "react";
import { useRouter } from "next/router";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/authentication");
  }, [router]);

  return (
    <>
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
          overflow: hidden;
        }
      `}</style>
      <style jsx global>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
          80% {
            opacity: 1;
            transform: scale(0.89);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.87, 0, 0.13, 1);
        }
      `}</style>
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        @keyframes goldShine {
          0% {
            background-position: 200% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 200% 200%;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .group:hover i {
          animation: float 2s ease-in-out infinite;
        }
        .group:hover .gold-shine {
          background: linear-gradient(90deg, #ffd700, #ffa500, #ffd700);
          background-size: 200% auto;
          animation: goldShine 6s linear infinite;
        }
      `}</style>
       <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
            max-height: 0;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            max-height: 500px;
          }
        }
        @keyframes ring {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-15deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(5deg); }
          60% { transform: rotate(-5deg); }
          70% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes success-pop {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-circle {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes success-check {
          0% { transform: scale(0); }
          50% { opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
          overflow: hidden;
        }
        .animate-ring {
          animation: ring 2s ease-in-out infinite;
          transform-origin: 50% 0;
        }
        .animate-success-pop {
          animation: success-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-success-circle {
          animation: success-circle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-success-check {
          animation: success-check 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
          opacity: 0;
        }
      `}</style>
      <style jsx global>{`
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.1);
          }
          80% {
            opacity: 1;
            transform: scale(0.89);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-bounceIn {
          animation: bounceIn 0.6s cubic-bezier(0.87, 0, 0.13, 1);
        }
      `}</style>
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes goldShine {
          0% { background-position: 200% 50%; }
          100% { background-position: -200% 50%; }
        }
        .animate-gradient {
          animation: gradient 15s ease infinite;
          background-size: 200% 200%;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .group:hover i {
          animation: float 2s ease-in-out infinite;
        }
        .group:hover .gold-shine {
          background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
          background-size: 200% auto;
          animation: goldShine 6s linear infinite;
        }
      `}</style>
    </>
  );
}
