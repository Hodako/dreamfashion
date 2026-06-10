import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { fmtMoney } from "@/lib/format";
import type { Product } from "@/lib/queries";
import { useT } from "@/lib/i18n";

interface ProductSearchProps {
  products: Product[];
  value: string;
  onChange: (id: string) => void;
  showPrice?: boolean;
  placeholder?: string;
}

/** Searchable product picker for buy/sell dialogs. */
export function ProductSearchSelect({ products, value, onChange, showPrice, placeholder }: ProductSearchProps) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const selected = products.find(p => p.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal h-9">
          {selected
            ? showPrice ? `${selected.name} · ${fmtMoney(selected.sell_price)}` : selected.name
            : placeholder ?? t("select_product")}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("search") + "…"} />
          <CommandList>
            <CommandEmpty>{t("no_products")}</CommandEmpty>
            <CommandGroup>
              {products.map(p => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.id}`.toLowerCase()}
                  onSelect={() => { onChange(p.id); setOpen(false); }}
                >
                  <Check className={cn("mr-2 size-4", value === p.id ? "opacity-100" : "opacity-0")} />
                  <span className="flex-1 truncate">{p.name}</span>
                  {showPrice && <span className="text-muted-foreground text-xs ml-2">{fmtMoney(p.sell_price)}</span>}
                  <span className="text-muted-foreground text-xs ml-2">({p.stock})</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
