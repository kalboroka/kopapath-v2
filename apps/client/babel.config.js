export default function (api) {
  // Cache the config for faster rebuilds
  api.cache(true);

  return {
    presets: [
      "@babel/preset-env"
    ],
    plugins: [
      ["babel-plugin-inferno", { imports: true }],
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@": "./src",
            "@components": "./src/components",
            "@layouts": "./src/layouts",
            "@pages": "./src/pages",
            "@utils": "./src/utils",
            "@styles": "./src/styles",
            "@assets": "./src/assets"
          }
        }
      ]
    ]
  };
}