import Link from "next/link";
import Image from "next/image";
import brandLogo from "@/images/zagreb berlin logo.png";

export function Logo() {
  return (
    <Link href="/" className="focus-ring inline-flex rounded-lg" aria-label="Berlin Zagreb prijevoz home">
      <Image
        src={brandLogo}
        alt="Zagreb Berlin prijevoz"
        priority
        className="h-14 w-auto rounded-md object-contain"
      />
    </Link>
  );
}
