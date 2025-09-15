const { MochOptions } = require("../moch/moch.js");
const { Providers } = require("./filter.js");
const { showDebridCatalog } = require("../moch/options.js");
const { getManifestOverride } = require("./configuration.js");
const { Type } = require("./types.js");

const DefaultProviders = Providers.options.map((provider) => provider.key);
const MochProviders = Object.values(MochOptions);

function manifest(config = {}) {
  const overrideManifest = getManifestOverride(config);
  const baseManifest = {
    id: "com.stremio.torrentio.addon",
    version: "0.0.15",
    name: getName(overrideManifest, config),
    description: getDescription(config),
    catalogs: getCatalogs(config),
    resources: getResources(config),
    types: [Type.MOVIE, Type.SERIES, Type.ANIME, Type.OTHER],
    background: `${config.host}/images/background_v1.jpg`,
    logo: `${config.host}/images/logo_v1.png`,
    behaviorHints: {
      configurable: true,
      configurationRequired: false,
    },
  };
  return Object.assign(baseManifest, overrideManifest);
}

function dummyManifest() {
  const manifestDefault = manifest();
  manifestDefault.catalogs = [{ id: "dummy", type: Type.OTHER }];
  manifestDefault.resources = ["stream", "meta"];
  return manifestDefault;
}

function getName(manifest, config) {
  const rootName = (manifest && manifest.name) || "Torrentio";
  const mochSuffix = MochProviders.filter((moch) => config[moch.key])
    .map((moch) => moch.shortName)
    .join("/");
  return [rootName, mochSuffix].filter((v) => v).join(" ");
}

function getDescription(config) {
  const providersList = config[Providers.key] || DefaultProviders;
  const enabledProvidersDesc = Providers.options
    .map(
      (provider) =>
        `${provider.label}${
          providersList.includes(provider.key) ? "(+)" : "(-)"
        }`
    )
    .join(", ");
  const enabledMochs = MochProviders.filter((moch) => config[moch.key])
    .map((moch) => moch.name)
    .join(" & ");
  const possibleMochs = Moch