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

async function update({
  destination,
  starts_at,
  id,
  ends_at,
}: Omit<TripDetails, "is_confirmed" | "owner_email" | "owner_name">) {
  try {
    await api.put<TripDetails>(`/trips/${id}`, {
      destination,
      starts_at,
      ends_at,
    });
  } catch (error) {
    throw error;
  }
}

export const TripServer = {
  getById,
  create,
  update,
};
