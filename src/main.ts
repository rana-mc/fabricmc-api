import {
  getGameVersions,
  getInstallerVersions,
  getLoaderVersions,
} from "./Api.js";

let gameVersion: string | undefined;
let loaderVersion: string | undefined;
let installerVersion: string | undefined;

const serverJarUrl = `https://meta.fabricmc.net/v2/versions/loader/${gameVersion}/${loaderVersion}/${installerVersion}/server/jar`;
const serverJarFilename = `fabric-server-mc.${gameVersion}-loader.${loaderVersion}-launcher.${installerVersion}.jar`;
const installerJarUrl = `https://maven.fabricmc.net/net/fabricmc/fabric-installer/${installerVersion}/fabric-installer-${installerVersion}.jar`;

export const main = async () => {
  await Promise.all([
    getGameVersions(),
    getLoaderVersions(),
    getInstallerVersions(),
  ]).then(([gameVersions, loaderVersions, installerVersions]) => {
    const versions = {
      game: gameVersions,
      loader: loaderVersions.filter((v) => {
        const split = v.version.split(".");
        return parseInt(split[0]) > 0 || parseInt(split[1]) >= 12; // 0.12.0 loader or newer
      }),
      installer: installerVersions.filter((v) => {
        const split = v.version.split(".");
        return parseInt(split[0]) > 0 || parseInt(split[1]) >= 8; // 0.8.0 installer or newer
      }),
    };

    // Populates the default version with the latest stable, or latest if none are stable.
    gameVersion = (versions.game.find((v) => v.stable) || versions.game[0])
      .version;
    loaderVersion = (
      versions.loader.find((v) => v.stable) || versions.loader[0]
    ).version;
    installerVersion = (
      versions.installer.find((v) => v.stable) || versions.installer[0]
    ).version;

    console.log(versions);

    return versions;
  });
};

main();