import Image from 'next/image';

interface LogoProps {
  className?: string;
  logoUrl?: string; // Optional Sanity override
}

export function Logo({ className = "h-10 w-auto", logoUrl }: LogoProps) {
  return (
    <div className={`relative ${className} flex items-center`}>
      <Image
        src={logoUrl || "/LogoPNG-e1590165207190-600x316.png"}
        alt="Portland Fresh Logo"
        width={600}
        height={316}
        className="object-contain h-full w-auto"
        priority
      />
    </div>
  );
}
