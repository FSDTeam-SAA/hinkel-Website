"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { getPasswordRuleChecks } from "../lib/password-rules";

type PasswordRequirementsProps = {
  password: string;
};

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const checks = getPasswordRuleChecks(password);

  return (
    <div className="rounded-2xl border border-[#f2e3d4] bg-[#fffaf5] px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8f6a54]">
        Password requirements
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        {checks.map((check) => (
          <div
            key={check.label}
            className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
              check.met
                ? "bg-emerald-50 text-emerald-700"
                : "bg-white text-[#7d6553]"
            }`}
          >
            {check.met ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 shrink-0" />
            )}
            <span>{check.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordRequirements;
