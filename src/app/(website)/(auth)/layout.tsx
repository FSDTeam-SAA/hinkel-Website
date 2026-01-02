import type { Metadata } from "next";
// import "../../../styles/globals.css";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Welcome!",
  description:
    "Manage your orders, track shipments, and configure products easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex flex-col-reverse md:flex-row items-center justify-center  p-4 md:p-0 my-20 md:my-0">
      {/* Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src={"/images/login.jpg"}
          width={1024}
          height={1024}
          alt="Man Diving"
          className="w-full h-auto max-h-[300px] md:max-h-full object-cover "
          priority
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-start pl-4 md:pl-2 lg:p-32">
        {children}
      </div>
    </div>
  );
}
