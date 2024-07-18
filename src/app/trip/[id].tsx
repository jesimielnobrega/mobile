import { Button } from "@/components/button";
import { Input } from "@/components/input";
import Loading from "@/components/loading";
import { TripDetails, tripServer } from "@/server/trip-server";
import { colors } from "@/styles/colors";
import dayjs from "dayjs";
import { router, useLocalSearchParams } from "expo-router";
import {
  CalendarIcon,
  CalendarRange,
  Info,
  MapPin,
  Settings2,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { Activities } from "./activities";
import { Details } from "./details";
import { Modal } from "@/components/modal";
import { Calendar } from "@/components/calendar";
import { calendarUtils, DatesSelected } from "@/utils/calendarUtils";
import { DateData } from "react-native-calendars";

export type TripData = TripDetails & {
  when: string;
};
export default function Trip() {
  enum MODAL {
    NONE = 0,
    UPDATE_TRIP = 1,
    CALENDAR = 2,
  }

  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false);
  const [showModal, setShowModal] = useState<MODAL>(MODAL.NONE);
  const [selectedDate, setSelectedDate] = useState({} as DatesSelected);
  const [destination, setDestination] = useState("");
  const [option, setOption] = useState<"activity" | "details">("activity");
  const [tripDetails, setTripDetails] = useState({} as TripData);

  const tripId = useLocalSearchParams<{ id: string }>().id;

  async function getTripDetails() {
    try {
      setIsLoadingTrip(true);
      if (!tripId) {
        return router.back();
      }

      const trip = await tripServer.getById(tripId);

      const maxLenghtDestination = 14;

      const destination =
        trip.destination.length > maxLenghtDestination
          ? trip.destination.slice(0, maxLenghtDestination) + "..."
          : trip.destination;

      const starts_at = dayjs(trip.starts_at).format("DD");
      const ends_at = dayjs(trip.ends_at).format("DD");
      const month = dayjs(trip.starts_at).format("MMM");

      setDestination(trip.destination);
      setTripDetails({
        ...trip,
        when: `${destination} de ${starts_at} à ${ends_at} de ${month.toUpperCase()}.`,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTrip(false);
    }
  }

  async function handleUpdateTrip() {
    try {
      if (!tripId) {
        return;
      }

      if (!destination || !selectedDate.startsAt || !selectedDate.endsAt) {
        return Alert.alert(
          "Atualizar viagem",
          "Lembre-se de preencher todos os dados da viagem"
        );
      }

      setIsUpdatingTrip(true);
      await tripServer.update({
        id: tripId,
        destination,
        starts_at: dayjs(selectedDate.startsAt.dateString).toString(),
        ends_at: dayjs(selectedDate.endsAt.dateString).toString(),
      });

      Alert.alert("Atualizar viagem", "Viagem actualizada com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            setShowModal(MODAL.NONE);
            getTripDetails();
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatingTrip(false);
    }
  }

  function handleSelectedDate(selectedDay: DateData) {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDate.startsAt,
      endsAt: selectedDate.endsAt,
      selectedDay,
    });
    setSelectedDate(dates);
  }

  useEffect(() => {
    getTripDetails();
  }, []);

  if (isLoadingTrip) {
    return <Loading />;
  }
  return (
    <View className="flex-1 px-5 pt-16">
      <Input variant="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />
        <Input.Field value={tripDetails.when}></Input.Field>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            borderWidth: 1,
            borderRadius: 5,
            backgroundColor: colors.zinc[800],
            height: 36,
            width: 36,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setShowModal(MODAL.UPDATE_TRIP)}
        >
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>
      {option === "activity" ? (
        <Activities tripDetails={tripDetails} />
      ) : (
        <Details tripId={tripDetails.id} />
      )}
      <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
        <View className="w-full flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2">
          <Button
            style={{ flex: 1 }}
            variant={option === "activity" ? "primary" : "secondary"}
            onPress={() => setOption("activity")}
          >
            <CalendarRange
              color={
                option === "activity" ? colors.lime[950] : colors.zinc[200]
              }
              size={20}
            />
            <Button.Title>Actividades</Button.Title>
          </Button>
          <Button
            style={{ flex: 1 }}
            variant={option === "details" ? "primary" : "secondary"}
            onPress={() => setOption("details")}
          >
            <Info
              color={option === "details" ? colors.lime[950] : colors.zinc[200]}
              size={20}
            />
            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Actualizar viagem"
        subtitle="Somente quem criou a viagem pode editar"
        visible={showModal === MODAL.UPDATE_TRIP}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-2 my-4">
          <Input variant="secondary">
            <MapPin color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Para onde?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>

          <Input variant="secondary">
            <CalendarIcon color={colors.zinc[400]} size={20} />
            <Input.Field
              value={selectedDate.formatDatesInText}
              placeholder="Quando?"
              onPressIn={() => setShowModal(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
            />
          </Input>

          <Button onPress={handleUpdateTrip} isLoading={isUpdatingTrip}>
            <Button.Title>Actualizar</Button.Title>
          </Button>
        </View>
      </Modal>

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
          <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
