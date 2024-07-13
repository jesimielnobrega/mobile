import clsx from "clsx";
import { createContext, useContext } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

type Variants = "primary" | "secondary";

type ButtonProps = TouchableOpacityProps & {
  variant?: Variants;
  isLoading?: boolean;
};

const ThemeContext = createContext<{ variant?: Variants }>({});

function Button({
  variant = "primary",
  children,
  isLoading,
  style,
  ...rest
}: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === "primary" ? styles.primary : styles.secondary,
        style,
      ]}
      activeOpacity={0.7}
      disabled={isLoading}
      {...rest}
    >
      <ThemeContext.Provider value={{ variant }}>
        {isLoading ? <ActivityIndicator className="text-lime-950" /> : children}
      </ThemeContext.Provider>
    </TouchableOpacity>
  );
}

function Title({ children }: TextProps) {
  const { variant } = useContext(ThemeContext);
  return (
    <Text
      className={clsx("text-base font-semibold ", {
        " text-lime-950": variant === "primary",
        " text-zinc-200": variant === "secondary",
      })}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingHorizontal: 8,
    gap: 8,
  },
  primary: {
    backgroundColor: "#bff266",
  },
  secondary: {
    backgroundColor: "#28272a",
  },
});
Button.Title = Title;

export { Button };
