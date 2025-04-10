// lib/types.ts

// Тип для водителя
export type Driver = {
  id: number;
  name: string;
  email: string;
  image: string;      // путь к изображению (например, "uploads/no-image.png")
  status: number;     // 0 - свободен, 1 - занят, 2 - оффлайн
};

// Тип для машины
export type Car = {
  id: number;
  brand: string;
  model: string;
  image: string;      // путь к изображению автомобиля
};

// Тип для точки маршрута (GPS)
export type LocationPoint = {
  lat: number;
  lng: number;
  recordedAt?: string; // время записи, например, в формате ISO
};

// Тип входящего сообщения по WebSocket для обновления координат
export type IncomingWSMessage = {
  driver_id: number;
  latitude: number;
  longitude: number;
  // Можно добавить дополнительные поля, например:
  status?: number;   // статус водителя, если передается
  name?: string;
  image?: string;
  car?: string;
};

// Тип для поездки
export type Trip = {
  id: number;
  user_id: number;
  start_time: string;
  end_time?: string;
  status: 'active' | 'completed';
  rating?: number;
  // Если требуется можно добавить поле маршрута:
  route?: LocationPoint[];
};
export type TripRoutePoint = {
  latitude: number
  longitude: number
  recorded_at: string
}

export type EndTripRequest = {
  trip_id: number
  duration: number
  distance: number
}

export type EndTripResponse =
  | { message: string }
  | { error: string }
