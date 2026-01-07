import Image from 'next/image';

interface LogoProps {
  className?: string;
  logoUrl?: string; // Optional Sanity override
}

export function Logo({ className = "w-8 h-8", logoUrl }: LogoProps) {
  return (
    <div className={`relative ${className} flex items-center`}>
      <Image
        src={logoUrl || "/portland-fresh-logo.svg"}
        alt="Portland Fresh Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
