import { Input } from "@/components/input";
import { View, Text, Image } from "react-native";
import {
  MapPin,
  Calendar as CalendarIcon,
  Settings2,
  UserRoundPlus,
  ArrowRight,
} from "lucide-react-native";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { useState } from "react";

export default function Index() {
  enum StepForm {
    TRIP_DETAILS = 1,
    ADD_EMAIL = 2,
  }

  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);

  function handleNextStepForm() {
    if (stepForm === StepForm.TRIP_DETAILS) {
      return setStepForm(StepForm.ADD_EMAIL);
    }
  }

  return (
    <View>
      <Image
        source={require("@/assets/logo.png")}
        className="h-9"
        resizeMode="contain"
      />
      <Image source={require("@/assets/bg.png")} className="absolute" />
      <Text className="text-zinc-400 text-center font-regular text-lg mt-3">
        Convide seus amigos e planeje a sua {"\n"} próxima viagem!
      </Text>
      <View className="bg-zinc-900 p-4 rounded-lg my-8 border border-zinc-800 px-5">
        <Input>
          <MapPin color={colors.zinc[400]} size={20} />
          <Input.Field
            editable={stepForm === StepForm.TRIP_DETAILS}
            placeholder="Para onde?"
          />
        </Input>
        <Input>
          <CalendarIcon color={colors.zinc[400]} size={20} />
          <Input.Field
            editable={stepForm === StepForm.TRIP_DETAILS}
            placeholder="Quando?"
          />
        </Input>

        {stepForm === StepForm.ADD_EMAIL && (
          <>
            <View className="border-b py-3 border-zinc-800">
              <Button
                onPress={() => setStepForm(StepForm.TRIP_DETAILS)}
                variant="secondary"
              >
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} />
              </Button>
            </View>
            <Input>
              <UserRoundPlus color={colors.zinc[400]} size={20} />
              <Input.Field placeholder="Quem estará na viagem?" />
            </Input>
          </>
        )}
        <Button onPress={handleNextStepForm} variant="primary">
          <Button.Title>
            {stepForm === StepForm.TRIP_DETAILS
              ? "Continuar"
              : "Confirmar viagem"}
          </Button.Title>
          <ArrowRight color={colors.lime[950]} size={20} />
        </Button>
      </View>
      <Text className="text-zinc-500 font-regular text-center text-base">
        Ao planejar sua viagem pela plann.er, você automaticamente concorda com
        os nossos{" "}
        <Text className="text-zinc-300 underline">
          termos de uso e plíticas de privacidade
        </Text>
      </Text>
    </View>
  );
}
