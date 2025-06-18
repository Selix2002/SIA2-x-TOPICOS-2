import { useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export default function MuscleOverlayMap({ onMusclePress }) {
  const { width: screenW } = Dimensions.get("window");
  const imgWidth = screenW * 0.9;
  const imgHeight = (imgWidth * 1400) / 1000;

  // 2) Definimos las coordenadas "originales" de cada músculo en la imagen 1000×1400:
  //    Lado derecho (coordenadas existentes):
  const rectAbdomen_original = { x: 395, y: 448, w: 163, h: 269 };
  const rectCuadDerecho_original = { x: 337, y: 721, w: 108, h: 241 };
  const rectBicesDerecho_original = { x: 605, y: 374, w: 92, h: 206 };

  // Lado izquierdo (coordenadas calculadas simétricamente):
  // Para el cuádriceps izquierdo: si el derecho está en x=337, el izquierdo estaría aproximadamente en x=555
  // Para el bíceps izquierdo: si el derecho está en x=605, el izquierdo estaría aproximadamente en x=303
  const rectCuadIzquierdo_original = { x: 555, y: 721, w: 108, h: 241 };
  const rectBicesIzquierdo_original = { x: 303, y: 374, w: 92, h: 206 };

  //  Conversión pixeles por pantalla
  // Abdomen (centro)
  const leftAbdomen = (rectAbdomen_original.x / 1000) * imgWidth;
  const topAbdomen = (rectAbdomen_original.y / 1400) * imgHeight;
  const widthAbdomen = (rectAbdomen_original.w / 1000) * imgWidth;
  const heightAbdomen = (rectAbdomen_original.h / 1400) * imgHeight;

  // Cuádriceps derecho
  const leftCuadDer = (rectCuadDerecho_original.x / 1000) * imgWidth;
  const topCuadDer = (rectCuadDerecho_original.y / 1400) * imgHeight;
  const widthCuadDer = (rectCuadDerecho_original.w / 1000) * imgWidth;
  const heightCuadDer = (rectCuadDerecho_original.h / 1400) * imgHeight;

  // Cuádriceps izquierdo
  const leftCuadIzq = (rectCuadIzquierdo_original.x / 1000) * imgWidth;
  const topCuadIzq = (rectCuadIzquierdo_original.y / 1400) * imgHeight;
  const widthCuadIzq = (rectCuadIzquierdo_original.w / 1000) * imgWidth;
  const heightCuadIzq = (rectCuadIzquierdo_original.h / 1400) * imgHeight;

  // Bíceps derecho
  const leftBiceDer = (rectBicesDerecho_original.x / 1000) * imgWidth;
  const topBiceDer = (rectBicesDerecho_original.y / 1400) * imgHeight;
  const widthBiceDer = (rectBicesDerecho_original.w / 1000) * imgWidth;
  const heightBiceDer = (rectBicesDerecho_original.h / 1400) * imgHeight;

  // Bíceps izquierdo
  const leftBiceIzq = (rectBicesIzquierdo_original.x / 1000) * imgWidth;
  const topBiceIzq = (rectBicesIzquierdo_original.y / 1400) * imgHeight;
  const widthBiceIzq = (rectBicesIzquierdo_original.w / 1000) * imgWidth;
  const heightBiceIzq = (rectBicesIzquierdo_original.h / 1400) * imgHeight;

  // Estado para resaltar la última área tocada (opcional)
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
          AREA 1: Abdomen (centro)
        */}
        <TouchableOpacity
          onPress={() => handlePress("abdominales")}
          style={{
            position: "absolute",
            left: leftAbdomen,
            top: topAbdomen,
            width: widthAbdomen,
            height: heightAbdomen,
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
            left: leftCuadDer,
            top: topCuadDer,
            width: widthCuadDer,
            height: heightCuadDer,
            backgroundColor:
              selected === "cuadriceps" ? "rgba(0, 255, 0, 0.2)" : "transparent",
            borderWidth: selected === "cuadriceps" ? 1 : 0,
            borderColor: "rgba(0, 255, 0, 0.5)",
          }}
        />

        {/*
          AREA 3: Cuádriceps izquierdo
        */}
        <TouchableOpacity
          onPress={() => handlePress("cuadriceps")}
          style={{
            position: "absolute",
            left: leftCuadIzq,
            top: topCuadIzq,
            width: widthCuadIzq,
            height: heightCuadIzq,
            backgroundColor:
              selected === "cuadriceps" ? "rgba(0, 255, 0, 0.2)" : "transparent",
            borderWidth: selected === "cuadriceps" ? 1 : 0,
            borderColor: "rgba(0, 255, 0, 0.5)",
          }}
        />

        {/*
          AREA 4: Bíceps derecho
        */}
        <TouchableOpacity
          onPress={() => handlePress("biceps")}
          style={{
            position: "absolute",
            left: leftBiceDer,
            top: topBiceDer,
            width: widthBiceDer,
            height: heightBiceDer,
            backgroundColor:
              selected === "biceps" ? "rgba(255, 0, 0, 0.2)" : "transparent",
            borderWidth: selected === "biceps" ? 1 : 0,
            borderColor: "rgba(255, 0, 0, 0.5)",
          }}
        />

        {/*
          AREA 5: Bíceps izquierdo
        */}
        <TouchableOpacity
          onPress={() => handlePress("biceps")}
          style={{
            position: "absolute",
            left: leftBiceIzq,
            top: topBiceIzq,
            width: widthBiceIzq,
            height: heightBiceIzq,
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