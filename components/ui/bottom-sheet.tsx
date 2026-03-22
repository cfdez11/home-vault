import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, Modal, Pressable, ScrollView, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SPRING = { damping: 26, stiffness: 260, mass: 0.8 };
const CLOSE_THRESHOLD = 100;
const CLOSE_VELOCITY = 700;

export interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  // Stable ref so the gesture (created once) always calls the latest onClose
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // useSharedValue instead of useRef — these are read/written inside worklet
  // callbacks (UI thread), so plain refs would trigger a Reanimated warning.
  const closeGen = useSharedValue(0);
  const isModalMounted = useSharedValue(false);

  // Stable wrapper — captured by the gesture on mount, always reads latest onClose
  const callOnClose = useCallback(() => {
    onCloseRef.current();
  }, []);

  const startOpenAnimation = useCallback(() => {
    translateY.value = withSpring(0, SPRING);
    backdropOpacity.value = withTiming(1, { duration: 250 });
  }, [translateY, backdropOpacity]);

  const animateOpen = useCallback(() => {
    closeGen.value++;
    translateY.value = SCREEN_HEIGHT;
    backdropOpacity.value = 0;
    if (isModalMounted.value) {
      // Modal is already mounted — onShow won't fire, so start animation directly
      startOpenAnimation();
    } else {
      setModalVisible(true);
      // Entrance animation starts via Modal's onShow
    }
  }, [translateY, backdropOpacity, closeGen, isModalMounted, startOpenAnimation]);

  const animateClose = useCallback(
    (notifyParent: boolean) => {
      const gen = ++closeGen.value;
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 280 },
        (finished) => {
          if (finished && closeGen.value === gen) {
            // Defer parent notification to here — calling it eagerly would change
            // visible→false which triggers a second animateClose via useEffect,
            // cancelling this animation before its callback can hide the modal.
            isModalMounted.value = false;
            runOnJS(setModalVisible)(false);
            if (notifyParent) runOnJS(callOnClose)();
          }
        },
      );
      backdropOpacity.value = withTiming(0, { duration: 280 });
    },
    [translateY, backdropOpacity, closeGen, isModalMounted, callOnClose],
  );

  useEffect(() => {
    if (visible) {
      animateOpen();
    } else {
      animateClose(false);
    }
  }, [visible, animateOpen, animateClose]);

  // ─── Gesture ──────────────────────────────────────────────────────────────────
  // Created once — all captured values are stable references

  const handleGesture = useRef(
    Gesture.Pan()
      .activeOffsetY([8, Infinity])
      .failOffsetY(-5)
      .onUpdate((e) => {
        if (e.translationY > 0) {
          translateY.value = e.translationY;
          backdropOpacity.value = Math.max(0, 1 - e.translationY / 300);
        }
      })
      .onEnd((e) => {
        const shouldClose =
          e.translationY > CLOSE_THRESHOLD || e.velocityY > CLOSE_VELOCITY;
        if (shouldClose) {
          // Animate out, then notify parent — the useEffect will handle setModalVisible
          translateY.value = withTiming(
            SCREEN_HEIGHT,
            { duration: 280 },
            (finished) => {
              if (finished) runOnJS(callOnClose)();
            },
          );
          backdropOpacity.value = withTiming(0, { duration: 280 });
        } else {
          translateY.value = withSpring(0, SPRING);
          backdropOpacity.value = withTiming(1, { duration: 200 });
        }
      }),
  ).current;

  // ─── Animated styles ──────────────────────────────────────────────────────────

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => animateClose(true)}
      onShow={() => {
        // Start entrance animation once the modal is fully mounted
        isModalMounted.value = true;
        startOpenAnimation();
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.45)",
              },
              backdropStyle,
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={() => animateClose(true)} />
          </Animated.View>

          {/* Sheet */}
          <Animated.View
            className="bg-background rounded-t-[28px] max-h-[90%] overflow-hidden"
            style={[{ paddingBottom: Math.max(insets.bottom, 16) }, sheetStyle]}
          >
            {/* Handle bar — drag to close */}
            <GestureDetector gesture={handleGesture}>
              <View className="items-center py-4 px-16">
                <View className="w-10 h-1 rounded-full bg-border" />
              </View>
            </GestureDetector>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
              {children}
            </ScrollView>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}
