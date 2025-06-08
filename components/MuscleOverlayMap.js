import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function MuscleOverlayMap({ onMusclePress }) {
  // 1) Obtenemos anchura de pantalla y calculamos proporción de la imagen
  const { width: screenW } = Dimensions.get("window");

  // Queremos que nuestra imagen ocupe el 90% del ancho de pantalla:
  const imgWidth = screenW * 0.9;

  // Si la imagen original mide 1000×1400 px, el alto en pantalla debe ser:
  const imgHeight = (imgWidth * 1400) / 1000;

  // 2) Definimos las coordenadas “originales” de cada músculo en la imagen 1000×1400:
  //    Ya vimos que:
  //    - Abdomen:     [x=395, y=448, w=163, h=269]
  //    - Cuádriceps:  [x=337, y=721, w=108, h=241]
  //    - Bíceps:      [x=605, y=374, w= 92, h=206]

  const rectAbdomen_original = { x: 395, y: 448, w: 163, h: 269 };
  const rectCuad_original   = { x: 337, y: 721, w: 108, h: 241 };
  const rectBiceps_original = { x: 605, y: 374, w:  92, h: 206 };

  // 3) Convertimos cada uno a “pixeles en pantalla”:
  const leftAbdomen = (rectAbdomen_original.x / 1000) * imgWidth;
  const topAbdomen  = (rectAbdomen_original.y / 1400) * imgHeight;
  const widthAbdomen  = (rectAbdomen_original.w / 1000) * imgWidth;
  const heightAbdomen = (rectAbdomen_original.h / 1400) * imgHeight;

  const leftCuad = (rectCuad_original.x / 1000) * imgWidth;
  const topCuad  = (rectCuad_original.y / 1400) * imgHeight;
  const widthCuad  = (rectCuad_original.w / 1000) * imgWidth;
  const heightCuad = (rectCuad_original.h / 1400) * imgHeight;

  const leftBice = (rectBiceps_original.x / 1000) * imgWidth;
  const topBice  = (rectBiceps_original.y / 1400) * imgHeight;
  const widthBice  = (rectBiceps_original.w / 1000) * imgWidth;
  const heightBice = (rectBiceps_original.h / 1400) * imgHeight;

  // 4) Estado para resaltar la última área tocada (opcional)
  const [selected, setSelected] = useState(null);

  const handlePress = (id) => {
    console.log("Músculo seleccionado:", id);
    setSelected(id);
    if (typeof onMusclePress === "function") {
      onMusclePress(id);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("../assets/body-muscles.png")}
        style={{ width: imgWidth, height: imgHeight }}
        resizeMode="contain"
      >
        {/*
          AREA 1: Abdomen
        */}
        <TouchableOpacity
          onPress={() => handlePress("abdominales")}
          style={{
            position: "absolute",
            left: leftAbdomen,
            top: topAbdomen,
            width: widthAbdomen,
            height: heightAbdomen,
            // Durante calibración, puedes ver el área con un fondo semitransparente:
            backgroundColor:
              selected === "abdominales" ? "rgba(0, 0, 255, 0.2)" : "transparent",
            borderWidth: selected === "abdominales" ? 1 : 0,
            borderColor: "rgba(0, 0, 255, 0.5)",
          }}
        />

        {/*
          AREA 2: Cuádriceps derecho
        */}
        <TouchableOpacity
          onPress={() => handlePress("cuadriceps")}
          style={{
            position: "absolute",
            left: leftCuad,
            top: topCuad,
            width: widthCuad,
            height: heightCuad,
            backgroundColor:
              selected === "cuadriceps" ? "rgba(0, 255, 0, 0.2)" : "transparent",
            borderWidth: selected === "cuadriceps" ? 1 : 0,
            borderColor: "rgba(0, 255, 0, 0.5)",
          }}
        />

        {/*
          AREA 3: Bíceps derecho (o izquierdo, según prefieras)
        */}
        <TouchableOpacity
          onPress={() => handlePress("biceps")}
          style={{
            position: "absolute",
            left: leftBice,
            top: topBice,
            width: widthBice,
            height: heightBice,
            backgroundColor:
              selected === "biceps" ? "rgba(255, 0, 0, 0.2)" : "transparent",
            borderWidth: selected === "biceps" ? 1 : 0,
            borderColor: "rgba(255, 0, 0, 0.5)",
          }}
        />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "flex-start",
    marginTop: 20,
  },
});
