import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Guest, OccupationCategory, PartyEvent, RsvpStatus } from "@/types/party";
import { categorizeOccupation } from "@/lib/occupationCategories";

interface NewEventInput {
  title: string;
  date: string;
  location?: string;
  notes?: string;
}

interface PartyStore {
  events: PartyEvent[];
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;

  addEvent: (input: NewEventInput) => string;
  updateEvent: (
    eventId: string,
    patch: Partial<Omit<PartyEvent, "id" | "guests" | "createdAt">>
  ) => void;
  deleteEvent: (eventId: string) => void;
  getEvent: (eventId: string) => PartyEvent | undefined;

  addGuest: (eventId: string, name: string, occupation: string) => void;
  updateGuestTags: (
    eventId: string,
    guestId: string,
    tags: OccupationCategory[]
  ) => void;
  setGuestRsvp: (eventId: string, guestId: string, rsvp: RsvpStatus) => void;
  removeGuest: (eventId: string, guestId: string) => void;
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export const usePartyStore = create<PartyStore>()(
  persist(
    (set, get) => ({
      events: [],
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),

      addEvent: (input) => {
        const id = uid();
        const event: PartyEvent = {
          id,
          title: input.title.trim() || "無題のパーティー",
          date: input.date,
          location: input.location?.trim() || undefined,
          notes: input.notes?.trim() || undefined,
          guests: [],
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ events: [event, ...state.events] }));
        return id;
      },

      updateEvent: (eventId, patch) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, ...patch } : e
          ),
        }));
      },

      deleteEvent: (eventId) => {
        set((state) => ({
          events: state.events.filter((e) => e.id !== eventId),
        }));
      },

      getEvent: (eventId) => get().events.find((e) => e.id === eventId),

      addGuest: (eventId, name, occupation) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;
        const tag = categorizeOccupation(occupation);
        const guest: Guest = {
          id: uid(),
          name: trimmedName,
          occupation: occupation.trim(),
          tags: [tag],
          rsvp: "pending",
        };
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, guests: [...e.guests, guest] } : e
          ),
        }));
      },

      updateGuestTags: (eventId, guestId, tags) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  guests: e.guests.map((g) =>
                    g.id === guestId ? { ...g, tags } : g
                  ),
                }
              : e
          ),
        }));
      },

      setGuestRsvp: (eventId, guestId, rsvp) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  guests: e.guests.map((g) =>
                    g.id === guestId ? { ...g, rsvp } : g
                  ),
                }
              : e
          ),
        }));
      },

      removeGuest: (eventId, guestId) => {
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? { ...e, guests: e.guests.filter((g) => g.id !== guestId) }
              : e
          ),
        }));
      },
    }),
    {
      name: "party-events-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
