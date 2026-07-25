//import 'dotenv/config';

export default {
  expo: {
    name: "frontend",
    slug: "frontend",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: { supportsTablet: true },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
      package: "com.soyabae.frontend",
    },
    web: { favicon: "./assets/favicon.png" },
    extra: {
      //SPOONACULAR_API_KEY: process.env.SPOONACULAR_API_KEY,
      eas: { projectId: "edf188d2-5add-44c5-96a0-43a313ed3199" },
    },
  },
};
