import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";

const BackgroundShapes = () => {
  const shapes = Array.from({ length: 15 });
  const shapeRefs = useRef([]);

  useEffect(() => {
    const moveShapes = () => {
      shapeRefs.current.forEach((shape) => {
        const duration = Math.random() * 3000 + 2000;
        const moveAnimation = Animated.loop(
          Animated.sequence([
            Animated.timing(shape, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(shape, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ])
        );
        moveAnimation.start();
      });
    };

    moveShapes();
  }, []);

  const getRandomShape = () => {
    const shapes = ['circle', 'square'];
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  const renderShape = (shape, size) => {
    switch (shape) {
      case 'circle':
        return { borderRadius: size / 2 }; // Círculo
      case 'square':
        return { borderRadius: 0 }; // Cuadrado
      default:
        return {};
    }
  };

  return (
    <View style={styles.backgroundContainer}>
      {shapes.map((_, index) => {
        const shapeAnimation = useRef(new Animated.Value(0)).current;
        shapeRefs.current[index] = shapeAnimation;

        const size = Math.random() * 50 + 50;
        const opacity = Math.random() * 0.5 + 0.3;
        const color = `rgba(7, 32, 64, ${opacity})`;

        const shape = getRandomShape();

        return (
          <Animated.View
            key={index}
            style={[
              styles.shape,
              {
                width: size,
                height: size,
                backgroundColor: color,
                borderColor: "#ffffff",
                borderWidth: 2,
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                top: Math.random() * 100 + "%",
                left: Math.random() * 100 + "%",
                opacity: shapeAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.7],
                }),
                transform: [
                  {
                    translateX: shapeAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.random() * 100 * (Math.random() < 0.5 ? 1 : -1)],
                    }),
                  },
                  {
                    translateY: shapeAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.random() * 100 * (Math.random() < 0.5 ? 1 : -1)],
                    }),
                  },
                  {
                    rotate: shapeAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: ["0deg", `${Math.random() * 360}deg`],
                    }),
                  },
                ],
                ...renderShape(shape, size),
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  shape: {
    position: "absolute",
    borderRadius: 50,
  },
});

export default BackgroundShapes;
