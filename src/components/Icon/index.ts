import Export from "./Export";
import Preview from "./Preview";
import Loading from "./Loading";

export const ClayMateIcons = {
  Export,
  Preview,
  Loading,
};

export type ClayMateIconsType = keyof typeof ClayMateIcons;
export type ClayMateIconProps = {
  fontSize?: number;
};
