import { Roboto, Roboto_Mono } from "next/font/google";
import HeroCards from "@/components/HeroCards";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto-mono",
});

export default function Page() {
  return (
    <main
      className={`${roboto.variable} ${robotoMono.variable} bg-black text-white`}
      style={{
        fontFamily: "var(--font-roboto-mono), Courier New, Courier, monospace",
        letterSpacing: "-0.01em",
      }}
    >
      <HeroCards />
    </main>
  );
}
