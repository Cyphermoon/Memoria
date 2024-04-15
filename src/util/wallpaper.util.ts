import { setWallpaper, TYPE_SCREEN } from 'rn-wallpapers';

export async function setAndroidWallpaper(
  imageUrl: string,
  type: TYPE_SCREEN = TYPE_SCREEN.BOTH,
  options?: { [key: string]: string }
) {
  const wallpaper = await setWallpaper(
    {
      uri: imageUrl,
      headers: {
        ...options,
      },
    },
    type // Sets the wallpaper on Lock Screen and Home Screen
  );

  return wallpaper;
}

