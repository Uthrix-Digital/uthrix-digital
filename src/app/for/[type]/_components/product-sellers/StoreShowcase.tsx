"use client";

import { motion, useReducedMotion, useTransform } from "framer-motion";
import {
  Check,
  Heart,
  Lock,
  RotateCw,
  Search,
  ShoppingBag,
  Shirt,
  Star,
  TrendingUp,
  Truck,
  Watch,
  type LucideIcon,
} from "lucide-react";
import {
  Floating,
  usePointerParallax,
} from "@/app/for/[type]/_components/hospitality/HeroShowcase";

/*
 * Hero illustration for /for/product-sellers. A fictional store's website,
 * with the page's promises around it as real-looking UI: a "price?" comment
 * answered automatically, a WhatsApp order, a confirmed COD order and a weekly
 * orders report. The "site" keeps its own light palette in both themes.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const PRODUCTS: {
  name: string;
  price: string;
  icon: LucideIcon;
  bg: string;
  fg: string;
  tag?: string;
}[] = [
  { name: "Linen Wrap Dress", price: "4,450", icon: Shirt, bg: "#f6e3d7", fg: "#b4593a", tag: "New" },
  { name: "Woven Tote", price: "3,200", icon: ShoppingBag, bg: "#e4ecdf", fg: "#4f7a45" },
  { name: "Classic Watch", price: "8,900", icon: Watch, bg: "#e2e6f2", fg: "#3f5596", tag: "-15%" },
];

function StoreSite() {
  return (
    <div className="@container overflow-hidden rounded-[1.1rem] bg-white text-[#16161a] shadow-[0_40px_90px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/10">
      {/* Browser chrome */}
      <div className="flex items-center gap-3 border-b border-black/5 bg-[#f3f3f5] px-3.5 py-2.5">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
        </span>
        <span className="mx-auto flex w-full max-w-[16rem] items-center justify-center gap-1.5 rounded-md bg-white px-3 py-1 text-[0.62rem] text-[#55555c] ring-1 ring-black/5">
          <Lock className="size-2.5" />
          yourstore.lk
        </span>
        <RotateCw className="size-3 text-[#8a8a90]" />
      </div>

      {/* Site nav */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-[0.95rem] font-black tracking-[-0.04em]">
          LUMI<span className="text-[#c40202]">&amp;</span>CO
        </span>
        <span className="hidden gap-4 text-[0.6rem] font-medium text-[#55555c] sm:flex">
          <span className="text-[#16161a]">New in</span>
          <span>Women</span>
          <span>Home</span>
          <span>Gifts</span>
        </span>
        <span className="flex items-center gap-2.5 text-[#55555c]">
          <Search className="size-3" />
          <Heart className="size-3" />
          <span className="relative">
            <ShoppingBag className="size-3.5 text-[#16161a]" />
            <span className="absolute -right-1.5 -top-1.5 flex size-3 items-center justify-center rounded-full bg-[#c40202] text-[0.42rem] font-bold text-white">
              2
            </span>
          </span>
        </span>
      </div>

      {/* Drop banner */}
      <div className="relative mx-2 overflow-hidden rounded-xl bg-[linear-gradient(120deg,#2a1d18_0%,#5b3326_55%,#b4593a_100%)] px-5 py-6 text-white sm:px-7 sm:py-8">
        <div
          aria-hidden="true"
          className="absolute -right-6 -top-10 size-40 rounded-full bg-[radial-gradient(closest-side,rgba(255,214,170,0.55),transparent)]"
        />
        <Shirt
          aria-hidden="true"
          strokeWidth={1}
          className="absolute -bottom-6 right-4 size-32 text-white/15 sm:right-10 sm:size-40"
        />
        <p className="relative text-[0.52rem] font-semibold uppercase tracking-[0.2em] text-white/70">
          New drop · Linen season
        </p>
        <p className="relative mt-1.5 max-w-[14rem] text-[1.35rem] font-black leading-[1] tracking-[-0.04em] sm:text-[1.7rem]">
          Light, breathable, made for the heat.
        </p>
        <span className="relative mt-3 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[0.58rem] font-bold text-[#16161a]">
          Shop the drop →
        </span>
      </div>

      {/* Trust strip */}
      <div className="mx-2 mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-lg bg-[#f6f6f7] px-3 py-1.5 text-[0.5rem] font-semibold text-[#55555c]">
        <span className="flex items-center gap-1">
          <Check className="size-2.5 text-[#1f8a4c]" /> Cash on delivery islandwide
        </span>
        <span className="flex items-center gap-1">
          <Truck className="size-2.5 text-[#1f8a4c]" /> 2–3 day delivery
        </span>
        <span className="hidden items-center gap-1 @[28rem]:flex">
          <RotateCw className="size-2.5 text-[#1f8a4c]" /> Easy exchange
        </span>
      </div>

      {/* Products */}
      <div className="grid grid-cols-3 gap-2 px-2 pb-3 pt-2.5">
        {PRODUCTS.map(({ name, price, icon: Icon, bg, fg, tag }) => (
          <div key={name} className="overflow-hidden rounded-lg ring-1 ring-black/5">
            <div
              className="relative flex h-16 items-center justify-center sm:h-20"
              style={{ backgroundColor: bg }}
            >
              <Icon strokeWidth={1.25} className="size-9 sm:size-11" style={{ color: fg }} />
              {tag && (
                <span className="absolute left-1 top-1 rounded-full bg-[#16161a] px-1.5 py-px text-[0.45rem] font-bold text-white">
                  {tag}
                </span>
              )}
            </div>
            <div className="px-2 py-1.5">
              <p className="truncate text-[0.58rem] font-semibold">{name}</p>
              <div className="flex items-center justify-between gap-1">
                <p className="text-[0.55rem] font-bold">Rs. {price}</p>
                <span className="flex items-center gap-0.5 text-[0.45rem] text-[#8a8a90]">
                  <Star className="size-2 fill-[#fbbc05] text-[#fbbc05]" />
                  4.9
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Things around the store ─────────────────────────────────────────── */

function CommentReplyCard() {
  return (
    <div className="w-[13.5rem] rounded-2xl bg-white p-3 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-[15rem]">
      <div className="flex items-start gap-2">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(45deg,#f9ce34,#ee2a7b,#6228d7)] p-[1.5px]">
          <span className="flex size-full items-center justify-center rounded-full bg-white text-[0.5rem] font-bold">
            N
          </span>
        </span>
        <p className="text-[0.6rem] leading-snug">
          <span className="font-semibold">nethmi.s</span> price? 😍
          <span className="block text-[0.48rem] text-[#8a8a90]">2m · Reply</span>
        </p>
      </div>
      <div className="ml-5 mt-2 flex items-start gap-2 border-l-2 border-[#ececef] pl-2.5">
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#16161a] text-[0.42rem] font-black text-white">
          L&amp;
        </span>
        <p className="text-[0.58rem] leading-snug">
          <span className="font-semibold">lumi.co</span> Sent you the price and order link in DM 💌
          <span className="mt-0.5 flex items-center gap-1 text-[0.48rem] font-semibold text-[#1f8a4c]">
            <Check className="size-2.5" strokeWidth={3} />
            Auto-replied in 2 seconds
          </span>
        </p>
      </div>
    </div>
  );
}

function WhatsAppOrderPhone() {
  return (
    <div className="w-[8.25rem] rounded-[1.6rem] bg-[#0d0d10] p-[5px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 sm:w-[10.5rem]">
      <div className="relative overflow-hidden rounded-[1.3rem] bg-[#efeae2]">
        <span className="absolute left-1/2 top-1.5 z-10 h-3 w-10 -translate-x-1/2 rounded-full bg-black" />
        <div className="flex items-center gap-1.5 bg-[#075e54] px-2.5 pb-2 pt-6 text-white">
          <span className="flex size-5 items-center justify-center rounded-full bg-white text-[0.42rem] font-black text-[#16161a]">
            L&amp;
          </span>
          <span className="leading-tight">
            <span className="block text-[0.58rem] font-semibold">Lumi &amp; Co</span>
            <span className="block text-[0.46rem] text-white/70">business account</span>
          </span>
        </div>
        <div className="flex flex-col gap-1.5 px-2 py-2.5 text-[0.55rem] leading-snug text-[#111b21] sm:text-[0.6rem]">
          <span className="max-w-[85%] self-end rounded-lg rounded-tr-none bg-[#d9fdd3] px-2 py-1.5 shadow-sm">
            Hi! Linen dress in M?
            <span className="mt-0.5 block text-right text-[0.42rem] text-[#667781]">21:14 ✓✓</span>
          </span>
          <span className="max-w-[90%] rounded-lg rounded-tl-none bg-white px-2 py-1.5 shadow-sm">
            M is in stock 🎉 Rs. 4,450, COD available.
            <span className="mt-1 block rounded-md bg-[#f0f2f5] px-1.5 py-1 text-center text-[0.5rem] font-semibold text-[#027eb5]">
              Confirm my order
            </span>
            <span className="mt-0.5 block text-right text-[0.42rem] text-[#667781]">21:14</span>
          </span>
          <span className="self-center rounded-full bg-[#d1f4cc] px-2 py-0.5 text-[0.48rem] font-semibold text-[#1f6b3a]">
            ✓ Order #1049 placed
          </span>
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Ordered", "Confirmed", "Shipped"];

function CodConfirmCard() {
  return (
    <div className="w-[13.5rem] rounded-2xl bg-white p-3 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5 sm:w-[14.5rem]">
      <div className="flex items-center justify-between">
        <span className="text-[0.62rem] font-semibold">Order #1048</span>
        <span className="rounded-full bg-[#e7f6ec] px-1.5 py-0.5 text-[0.48rem] font-semibold text-[#1f8a4c]">
          COD confirmed
        </span>
      </div>
      <p className="mt-0.5 text-[0.55rem] text-[#55555c]">2 items · Rs. 8,900 · Kandy</p>
      <div className="mt-2.5 flex items-center">
        {STEPS.map((step, i) => (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <span className="flex flex-col items-center gap-1">
              <span
                className={`flex size-4 items-center justify-center rounded-full ${
                  i < 2 ? "bg-[#c40202] text-white" : "bg-[#ececef] text-[#8a8a90]"
                }`}
              >
                {i < 2 ? (
                  <Check className="size-2.5" strokeWidth={3} />
                ) : (
                  <Truck className="size-2.5" />
                )}
              </span>
              <span className="text-[0.45rem] font-medium text-[#55555c]">{step}</span>
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`mx-1 mb-3 h-0.5 flex-1 rounded-full ${
                  i === 0 ? "bg-[#c40202]" : "bg-[#ececef]"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const BARS = [38, 42, 35, 51, 58, 66, 82];

function OrdersCard() {
  const reduce = useReducedMotion();

  return (
    <div className="w-[10.5rem] rounded-2xl bg-white p-3 text-[#16161a] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <span className="text-[0.55rem] uppercase tracking-[0.14em] text-[#8a8a90]">Orders this week</span>
        <span className="flex size-4 items-center justify-center rounded-full bg-[#e7f6ec]">
          <TrendingUp className="size-2.5 text-[#1f8a4c]" />
        </span>
      </div>
      <p className="mt-1 text-lg font-bold leading-none">
        184 <span className="text-[0.6rem] font-semibold text-[#1f8a4c]">▲ 32%</span>
      </p>
      <div className="mt-2.5 flex h-10 items-end gap-1 border-b border-black/5">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className={`flex-1 origin-bottom rounded-t-[3px] ${
              i === BARS.length - 1 ? "bg-[#c40202]" : "bg-[#e4e4e9]"
            }`}
            style={{ height: `${h}%` }}
            initial={reduce ? false : { scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.6, ease: EASE, delay: 1.4 + i * 0.06 }}
          />
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[0.45rem] text-[#8a8a90]">
        <span>Mon</span>
        <span>Sun</span>
      </div>
    </div>
  );
}

/** The full composition. Decorative: the page text says the same things. */
export function StoreShowcase() {
  const pointer = usePointerParallax();
  const rotateY = useTransform(pointer.x, (v) => v * 7);
  const rotateX = useTransform(pointer.y, (v) => v * -5);
  const siteX = useTransform(pointer.x, (v) => v * -10);
  const siteY = useTransform(pointer.y, (v) => v * -8);
  const glowX = useTransform(pointer.x, (v) => v * -40);

  return (
    // `isolate` keeps the cards' z-index local, so they never cover the fixed header.
    <div
      aria-hidden="true"
      className="relative isolate mx-auto w-full max-w-[40rem] select-none pb-16 pt-14 [perspective:1400px] sm:pb-20 sm:pl-10 sm:pt-16"
    >
      <motion.div
        style={{ x: glowX }}
        className="pointer-events-none absolute inset-x-[10%] top-[15%] h-[70%] rounded-full bg-[radial-gradient(closest-side,rgba(196,2,2,0.28),transparent)] blur-2xl"
      />

      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 32, rotateX: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
        style={{ transformPerspective: 1400 }}
      >
        <motion.div
          style={{ rotateX, rotateY, x: siteX, y: siteY, transformPerspective: 1400 }}
          className="will-change-transform"
        >
          <StoreSite />
        </motion.div>
      </motion.div>

      <Floating
        pointer={pointer}
        depth={26}
        delay={0.7}
        duration={6.5}
        drift={-7}
        tilt={-0.6}
        className="absolute left-0 top-0 z-20 sm:-left-2 lg:-left-10"
      >
        <CommentReplyCard />
      </Floating>

      <Floating
        pointer={pointer}
        depth={34}
        delay={1.05}
        duration={8}
        drift={-9}
        tilt={0.8}
        phase={2.4}
        className="absolute -right-2 top-[16%] z-20 hidden sm:block lg:-right-10"
      >
        <OrdersCard />
      </Floating>

      <Floating
        pointer={pointer}
        depth={22}
        delay={1.35}
        duration={9}
        drift={-6}
        tilt={0.5}
        phase={4.1}
        className="absolute bottom-0 left-0 z-20 hidden sm:block lg:-left-12"
      >
        <CodConfirmCard />
      </Floating>

      <Floating
        pointer={pointer}
        depth={44}
        delay={0.9}
        duration={7.5}
        drift={-10}
        tilt={-0.8}
        phase={1.2}
        className="absolute -bottom-2 -right-1 z-30 sm:-right-4 lg:-right-12"
      >
        <WhatsAppOrderPhone />
      </Floating>
    </div>
  );
}
