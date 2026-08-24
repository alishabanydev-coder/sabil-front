// Swiper ships no type declarations for its CSS entry points, and since these
// specifiers don't end in ".css", Next.js's built-in `declare module "*.css"`
// wildcard doesn't cover them (TS 5.9+ checks side-effect imports).
declare module "swiper/css";
declare module "swiper/css/*";
