"use client";

import { useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";

export function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-subtle"
    >
      {copied ? (
        <FiCheck className="h-4 w-4 text-accent" aria-hidden />
      ) : (
        <FiCopy className="h-4 w-4" aria-hidden />
      )}
      <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
    </button>
  );
}
