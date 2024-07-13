import { Input } from "@/components/input";
import { View, Text, Image, Keyboard } from "react-native";
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
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { DateData } from "react-native-calendars";

export default function Index() {
  enum StepForm {
    TRIP_DETAILS = 1,
    ADD_EMAIL = 2,
  }
  enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    GUESTS = 2,
  }

  const [selectedDate, seSelectedDate] = useState({} as DatesSelected);
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);

  function handleSelectedDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDate.startsAt,
      endsAt: selectedDate.endsAt,
      selectedDay,
    });
  }

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
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={() =>
              stepForm === StepForm.TRIP_DETAILS && setShowModal(MODAL.CALENDAR)
            }
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
      <Modal
        title="Seleccionar datas"
        subtitle="Seleccione a data de ida e volta da viagem"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar />
          <Button onPress={() => setShowModal(MODAL.NONE)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
