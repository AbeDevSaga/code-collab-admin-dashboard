
import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="whitespace-nowrap items-center">
      <Image
        src="/images/Logo.png"
        alt="Logo"
        width={90}
        height={30}
      />
    </Link>
  );
}
