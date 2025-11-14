import { GraduationCap } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: { icon: "h-6 w-6", text: "text-lg" },
    md: { icon: "h-8 w-8", text: "text-2xl" },
    lg: { icon: "h-12 w-12", text: "text-3xl" }
  };

  const { icon, text } = sizeClasses[size];

  return (
    <div className="flex items-center gap-2">
      <GraduationCap className={`${icon} text-blue-600`} />
      {showText && (
        <span className={`${text} font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent`}>
          StudyMatch
        </span>
      )}
    </div>
  );
}
