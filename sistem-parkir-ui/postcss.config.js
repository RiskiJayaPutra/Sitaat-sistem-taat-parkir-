// Import plugin-nya
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";

export default {
  plugins: [
    // Gunakan sebagai array, bukan objek
    tailwindcss,
    autoprefixer,
  ],
};
