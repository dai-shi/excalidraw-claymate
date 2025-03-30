import Export from "./Export";
import Preview from "./Preview";

export const ClayMateIcons = {
  Export,
  Preview,
};

export type ClayMateIconsType = keyof typeof ClayMateIcons;
export type ClayMateIconProps = {
  fontSize?: number;
};
