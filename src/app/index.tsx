import { Input } from "@/components/input";
import { View, Text, Image, Keyboard, Alert } from "react-native";
import {
  MapPin,
  Calendar as CalendarIcon,
  Settings2,
  UserRoundPlus,
  ArrowRight,
  AtSign,
} from "lucide-react-native";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";
import { useState } from "react";
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { DateData } from "react-native-calendars";
import dayjs from "dayjs";
import { GuestEmail } from "@/components/email";
import { validateInput } from "@/utils/validateInput";

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

  const [destination, setDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState({} as DatesSelected);
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [emailToInvite, setEmailToInvite] = useState("");
  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);

  function handleSelectedDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDate.startsAt,
      endsAt: selectedDate.endsAt,
      selectedDay,
    });
    setSelectedDate(dates);
  }

  function handleNextStepForm() {
    if (
      destination.trim().length === 0 ||
      !selectedDate.startsAt ||
      !selectedDate.endsAt
    ) {
      return Alert.alert(
        "Detalhes da viagem",
        "Preencha todas as informações da viagem para seguir"
      );
    }
    if (destination.trim().length < 4) {
      return Alert.alert(
        "Detalhes da viagem",
        "O destino deve ter no mínimo 4 caracteres"
      );
    }
    if (stepForm === StepForm.TRIP_DETAILS) {
      return setStepForm(StepForm.ADD_EMAIL);
    }
  }

  function handleRemoveEmail(emailToRemove: string) {
    setEmailsToInvite((prevEmails) =>
      prevEmails.filter((email) => email !== emailToRemove)
    );
  }

  function handleAddEmail() {
    if (!validateInput.email(emailToInvite)) {
      return Alert.alert("Convidado", "Email inválido");
    }
    const emailAlreadyExists = emailsToInvite.find(
      (email) => email === emailToInvite
    );
    if (emailAlreadyExists) {
      return Alert.alert("Convidado", "O email já foi adicionado");
    }
    setEmailsToInvite((prevEmails) => [...prevEmails, emailToInvite]);
    setEmailToInvite("");
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
            value={destination}
            onChangeText={setDestination}
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
            value={selectedDate.formatDatesInText}
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
              <Input.Field
                placeholder="Quem estará na viagem?"
                autoCorrect={false}
                value={
                  emailsToInvite.length > 0
                    ? `${emailsToInvite.length} pessoas(a) convidada(s)`
                    : ""
                }
                onPressIn={() => {
                  Keyboard.dismiss();
                  setShowModal(MODAL.GUESTS);
                }}
                showSoftInputOnFocus={false}
              />
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
          <Calendar
            onDayPress={handleSelectedDate}
            markedDates={selectedDate.dates}
            minDate={dayjs().toISOString()}
          />
          <Button onPress={() => setShowModal(MODAL.NONE)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Seelccionar convidados"
        subtitle="Os convidados irão receber emails para confirmar a participação na viagem"
        visible={showModal === MODAL.GUESTS}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items start">
          {emailsToInvite.length > 0 ? (
            emailsToInvite.map((email) => (
              <GuestEmail
                key={email}
                email={email}
                onRemove={() => handleRemoveEmail(email)}
              />
            ))
          ) : (
            <Text className="text-zinc-600 text-base font-regular">
              Nenhum email adicionado
            </Text>
          )}
        </View>
        <View className="gap-4 mt-4">
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />
            <Input.Field
              value={emailToInvite}
              onChangeText={(text) =>
                setEmailToInvite(text.toLocaleLowerCase())
              }
              placeholder="Digite o email do convidado"
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
            />
          </Input>
          <Button onPress={handleAddEmail}>
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
