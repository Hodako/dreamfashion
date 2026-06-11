import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { signedImage } from "@/lib/queries";

export function ProductImage({ path, className = "" }: { path: string | null; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { let live = true; signedImage(path).then(u => { if (live) setUrl(u); }); return () => { live = false; }; }, [path]);
  if (!url) return (
    <div className={`bg-secondary/40 grid place-items-center p-1.5 ${className}`}>
      <img
        src="https://img.icons8.com/clouds/100/product.png"
        className="w-2/3 h-2/3 max-w-[48px] object-contain"
        alt="product"
      />
    </div>
  );
  return <img src={url} className={`object-cover ${className}`} alt="" />;
}