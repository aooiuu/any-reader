import { uniqBy } from 'lodash-es';

export type FontData = {
  family: string;
  fullName: string;
  postscriptName: string;
  style: string;
};

export async function getFontList() {
  const list = await window.queryLocalFonts();
  return uniqBy(
    list.filter((e) => e.style === 'Regular'),
    (e) => e.family
  );
}
