import React from "react";

export default function HeaderTitle({
  title,
}: {
  title: string;
  className?: string;
}) {
  return (
    <h2 className="text-4xl md:text-5xl text-center font-bold text-primary-foreground tracking-tight leading-tight ">
      {title}
    </h2>
  );
}
