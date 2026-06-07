import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import { signedImage } from "@/lib/queries";

export function ProductImage({ path, className = "" }: { path: string | null; className?: string }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => { let live = true; signedImage(path).then(u => { if (live) setUrl(u); }); return () => { live = false; }; }, [path]);
  if (!url) return (
    <div className={`bg-secondary grid place-items-center text-muted-foreground ${className}`}>
      <Package className="size-6" />
    </div>
  );
  return <img src={url} className={`object-cover ${className}`} alt="" />;
}