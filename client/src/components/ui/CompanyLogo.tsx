import { useState } from "react";

interface CompanyLogoProps {
  company: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// Map company names to their logo files and display names
const logoMap: Record<string, { file: string; displayName: string }> = {
  // Investors
  "catalio": { file: "catalio.svg", displayName: "Catalio Capital" },
  "catalio capital": { file: "catalio.svg", displayName: "Catalio Capital" },
  "general catalyst": { file: "general-catalyst.svg", displayName: "General Catalyst" },
  "tusk": { file: "tusk.svg", displayName: "Tusk Ventures" },
  "tusk ventures": { file: "tusk.svg", displayName: "Tusk Ventures" },

  // Companies
  "somethings": { file: "somethings.svg", displayName: "Somethings" },
  "ibm": { file: "ibm.svg", displayName: "IBM" },
  "wells fargo": { file: "wells-fargo.svg", displayName: "Wells Fargo" },

  // Press
  "mobihealthnews": { file: "mobihealthnews.svg", displayName: "MobiHealthNews" },
  "yahoo finance": { file: "yahoo-finance.svg", displayName: "Yahoo Finance" },
  "behavioral health business": { file: "bhb.svg", displayName: "Behavioral Health Business" },
  "alleywatch": { file: "alleywatch.svg", displayName: "AlleyWatch" },
  "pr newswire": { file: "pr-newswire.svg", displayName: "PR Newswire" },
};

const sizeClasses = {
  sm: "h-4",
  md: "h-6",
  lg: "h-8",
};

export default function CompanyLogo({
  company,
  className = "",
  size = "md",
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);
  const normalizedCompany = company.toLowerCase();
  const logoInfo = logoMap[normalizedCompany];

  if (!logoInfo || hasError) {
    // Fallback to text
    return (
      <span className={`text-slate-300 font-medium ${className}`}>
        {logoInfo?.displayName || company}
      </span>
    );
  }

  return (
    <img
      src={`/logos/${logoInfo.file}`}
      alt={logoInfo.displayName}
      className={`${sizeClasses[size]} w-auto object-contain ${className}`}
      onError={() => setHasError(true)}
    />
  );
}

// Export a simple inline logo component for tighter integration
export function InlineLogo({
  company,
  className = "",
}: {
  company: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);
  const normalizedCompany = company.toLowerCase();
  const logoInfo = logoMap[normalizedCompany];

  if (!logoInfo || hasError) {
    return <span className={className}>{logoInfo?.displayName || company}</span>;
  }

  return (
    <img
      src={`/logos/${logoInfo.file}`}
      alt={logoInfo.displayName}
      className={`h-5 w-auto object-contain inline-block ${className}`}
      onError={() => setHasError(true)}
    />
  );
}
