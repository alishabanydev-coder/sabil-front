// Shared backdrop override for donation secondary modals (Sections / Updates / FAQs).
// These open ON TOP of the main DonationModal, which already paints the animated
// particle backdrop. Without this, each nested modal would stack another particle
// layer, doubling the particles and darkening the screen too much. We disable the
// particle image/animation and use a lighter dim instead. `!important` is required
// to beat the theme's descendant selector specificity for `.MuiBackdrop-root`.
export const secondaryModalSlotProps = {
  backdrop: {
    sx: {
      backgroundColor: "rgba(8, 12, 24, 0.32) !important",
      backdropFilter: "blur(2px) !important",
      backgroundImage: "none !important",
      backgroundSize: "auto !important",
      animation: "none !important",
      "&::before": {
        display: "none !important",
      },
    },
  },
} as const;
