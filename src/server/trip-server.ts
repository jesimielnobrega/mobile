import { api } from "./api";

export type TripDetails = {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
  owner_name: string;
  owner_email: string;
};

type TripCreate = Omit<TripDetails, "id" | "is_confirmed"> & {
  emails_to_invite: string[];
};

async function getById(id: string) {
  try {
    const { data } = await api.get<{ trip: TripDetails }>(`/trips/${id}`);
    return data.trip;
  } catch (error) {
    throw error;
  }
}

async function create(tripData: TripCreate) {
  try {
    const { data } = await api.post<{
      tripId: string;
    }>("/trips", tripData);
    return data;
  } catch (error) {
    throw error;
  }
}

export const TripServer = {
  getById,
  create,
};
