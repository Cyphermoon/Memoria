import { setWallpaper, TYPE_SCREEN } from 'rn-wallpapers';


async function setAndroidWallpaper(imageUrl: string, type: TYPE_SCREEN = TYPE_SCREEN.HOME, options?:{[key: string]: string}){

        const wallpaper =  await setWallpaper(
             {
               uri: imageUrl,
               headers: {
                 ...options
               }
             },
             type // Sets the wallpaper on Lock Screen only
           )
            
           return wallpaper;
}