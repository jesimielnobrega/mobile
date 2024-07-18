import { Alert, Keyboard, SectionList, Text, View } from "react-native";
import { TripData } from "./[id]";
import { Button } from "@/components/button";
import {
  Calendar as CalendarIcon,
  Clock,
  PlusIcon,
  Tag,
} from "lucide-react-native";
import { colors } from "@/styles/colors";
import { Modal } from "@/components/modal";
import { useEffect, useState } from "react";
import { Input } from "@/components/input";
import dayjs from "dayjs";
import { Calendar } from "@/components/calendar";
import { activitiesServer } from "@/server/activities-server";
import { Activity, ActivityProps } from "@/components/activity";

type Props = {
  tripDetails: TripData;
};

type TripActivities = {
  title: {
    dayNumber: number;
    dayName: string;
  };
  data: ActivityProps[];
};

export function Activities({ tripDetails }: Props) {
  enum MODAL {
    NONE = 0,
    CALENDAR = 1,
    NEW_ACTIVITY = 2,
  }

  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [tripActivities, setTripActivities] = useState<TripActivities[]>([]);
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityHour, setActivityhour] = useState("");
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  function resetNewActivityFields() {
    setActivityDate("");
    setActivityTitle("");
    setActivityhour("");
    setShowModal(MODAL.NONE);
  }

  async function handleCreateTripActivity() {
    try {
      if (!activityTitle || !activityDate || !activityHour) {
        return Alert.alert("Cadastrar actividade", "Preencha todos os campos ");
      }

      setIsCreatingActivity(true);

      await activitiesServer.create({
        tripId: tripDetails.id,
        occurs_at: dayjs(activityDate)
          .add(Number(activityHour), "h")
          .toString(),
        title: activityTitle,
      });

      Alert.alert("Nova actividade", "Nova actividade cadastrada com sucesso!");

      await getTripActivities();
      resetNewActivityFields();
    } catch (error) {
      console.log(error);
    } finally {
      setIsCreatingActivity(false);
    }
  }

  async function getTripActivities() {
    try {
      const activities = await activitiesServer.getActivitiesByTripId(
        tripDetails.id
      );

      const activitiesToSectionList = activities.map((dayActivity) => ({
        title: {
          dayNumber: dayjs(dayActivity.date).date(),
          dayName: dayjs(dayActivity.date).format("dddd").replace("-feira", ""),
        },
        data: dayActivity.activities.map((activity) => ({
          id: activity.id,
          title: activity.title,
          hour: dayjs(activity.occurs_at).format("hh[:]mm[h]"),
          isBefore: dayjs(activity.occurs_at).isBefore(dayjs()),
        })),
      }));

      setTripActivities(activitiesToSectionList);
      console.log(activitiesToSectionList);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingActivities(false);
    }
  }

  useEffect(() => {
    getTripActivities();
  }, []);
  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-6 items-center">
        <Text className="text-zinc-50 text-2xl font-semi flex-1">
          Actividades
        </Text>
        <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
          <PlusIcon color={colors.lime[950]} />
          <Button.Title>Nova actividade</Button.Title>
        </Button>
      </View>
      <SectionList
        keyExtractor={(item) => item.id}
        sections={tripActivities}
        renderItem={({ item }) => <Activity data={item} />}
        renderSectionHeader={({ section }) => (
          <View className="w-full">
            <Text className="text-zinc-50 text-2xl font-2xl font-semiboldpy-2">
              Dia {section.title.dayNumber + " "}
              <Text className="text-zinc-500 text-base font-regular capitalize">
                {section.title.dayName}
              </Text>
            </Text>
            {section.data.length === 0 && (
              <Text className="text-zinc-500 font-regular text-sm mb-8">
                Nenhuma actividade cadastrada neste dia
              </Text>
            )}
          </View>
        )}

        contentContainerClassName="gap-3"
      />
      <Modal
        title="Cadastrar Actividade"
        subtitle="Todos os convidados podem visualizar as actividades"
        visible={showModal === MODAL.NEW_ACTIVITY}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="mb-3 mt-4">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />
            <Input.Field
              placeholder="Qual actividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className="w-full mt-2 flex-row gap-2">
            <Input variant="secondary" className="flex-1">
              <CalendarIcon color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Data"
                value={
                  activityDate ? dayjs(activityDate).format("DD [de] MMM") : ""
                }
                onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
                onPressIn={() => setShowModal(MODAL.CALENDAR)}
              />
            </Input>

            <Input variant="secondary" className="flex-1">
              <Clock color={colors.zinc[400]} size={20} />
              <Input.Field
                placeholder="Horário?"
                onChangeText={(text) =>
                  setActivityhour(text.replace(".", "").replace(",", ""))
                }
                value={activityHour}
                keyboardType="numeric"
                maxLength={2}
              />
            </Input>
          </View>
        </View>
        <Button
          onPress={handleCreateTripActivity}
          isLoading={isCreatingActivity}
        >
          <Button.Title>Salvar actividade</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Seleccionar data"
        subtitle="Seleccione a data da actividade"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={(day) => setActivityDate(day.dateString)}
            markedDates={{ [activityDate]: { selected: true } }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />
          <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
}
