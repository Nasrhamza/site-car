"use client";

import { create } from "zustand";

type GarageCar = {
  _id?: string;
  id?: string;
  slug?: string;
  brand?: string;
  model?: string;
  title?: string;
  year?: number;
  price?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  location?: string;
  images?: { url: string }[];
};

type GarageStore = {
  garage: GarageCar[];
  addToGarage: (car: GarageCar) => void;
  removeFromGarage: (carId: string) => void;
  isInGarage: (carId: string) => boolean;
  clearGarage: () => void;
};

export const useGarageStore = create<GarageStore>((set, get) => ({
  garage: [],

  addToGarage: (car) =>
    set((state) => {
      const id = car._id || car.id || car.slug;
      const exists = state.garage.some(
        (item) => (item._id || item.id || item.slug) === id
      );

      if (exists) return state;

      return {
        garage: [...state.garage, car],
      };
    }),

  removeFromGarage: (carId) =>
    set((state) => ({
      garage: state.garage.filter(
        (item) => (item._id || item.id || item.slug) !== carId
      ),
    })),

  isInGarage: (carId) =>
    get().garage.some(
      (item) => (item._id || item.id || item.slug) === carId
    ),

  clearGarage: () => set({ garage: [] }),
}));