import { Checkbox, Stack, Typography } from "@mui/material";
import type { MainPageLayoutItem, MainPageLayoutSection } from "@/types/admin";

type SectionItemCardProps = {
  item: MainPageLayoutItem;
  section: MainPageLayoutSection | null;
  isSelected: boolean;
  isUnpublished: boolean;
  selectedOrder: number | null;
  isSaving: boolean;
  onToggle: (itemId: string) => void;
};

const SectionItemCard = ({
  item,
  section,
  isSelected,
  isUnpublished,
  selectedOrder,
  isSaving,
  onToggle,
}: SectionItemCardProps) => {
  return (
    <Stack
      onClick={() => {
        if (!isUnpublished) {
          onToggle(item._id);
        }
      }}
      sx={{
        position: "relative",
        width: 250,
        height: 180,
        p: 1,
        border: (theme) =>
          `1px solid ${
            isSelected ? theme.palette.primary.main : theme.palette.divider
          }`,
        borderRadius: 1,
        cursor: isUnpublished ? "not-allowed" : "pointer",
        bgcolor: isSelected ? "action.selected" : "transparent",
        filter: isUnpublished ? "grayscale(100%)" : "none",
        opacity: isUnpublished ? 0.55 : 1,
        overflow: "hidden",
        gap: 0.5,
      }}
    >
      {section?.header ? (
        <img
          src={String(item[section.header] ?? "")}
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            objectFit: "contain",
            borderRadius: 8,
            filter: isUnpublished ? "blur(1px)" : "none",
          }}
        />
      ) : (
        <Stack
          sx={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1,
            px: 1,
            py: 0.5,
            overflow: "hidden",
          }}
        >
          <Typography
            color="text.secondary"
            variant="body2"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 5,
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordBreak: "break-word",
              lineHeight: 1.6,
            }}
          >
            {item.text || "No text"}
          </Typography>
        </Stack>
      )}
      <Stack
        direction="row"
        sx={{
          justifyContent: "start",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Checkbox
          checked={isSelected}
          onClick={(event) => event.stopPropagation()}
          onChange={() => onToggle(item._id)}
          disabled={isSaving || isUnpublished}
        />
        <Typography
          sx={{
            fontWeight: 600,
            width: 120,
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {String(item[section?.text || "title"] || item._id)}
        </Typography>
        {selectedOrder ? (
          <Typography
            variant="caption"
            sx={{ color: "primary.main", fontWeight: 700 }}
          >
            #{selectedOrder}
          </Typography>
        ) : null}
      </Stack>
      {isUnpublished ? (
        <Stack
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            pointerEvents: "none",
          }}
        >
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", fontWeight: 700 }}
          >
            Hidden from public
          </Typography>
        </Stack>
      ) : null}
    </Stack>
  );
};

export default SectionItemCard;
