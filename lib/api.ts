import { getBaseUrl } from './config'
console.log('🛰 Используем базу:', getBaseUrl()) // лог с адресом
import {
  Car,
  Driver,
  TripRoutePoint,
  EndTripRequest,
  EndTripResponse,
} from './types'

// ▶️ Старт поездки
export async function startTrip(userId: number): Promise<number> {
  const res = await fetch(`${getBaseUrl()}/api/trip/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId }),
  })

  const json = await res.json()
  return json.trip_id
}

// 🛑 Завершение поездки
export async function endTrip(
  tripId: number,
  duration: number,
  distance: number
): Promise<EndTripResponse> {
  const res = await fetch(`${getBaseUrl()}/api/trip/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ trip_id: tripId, duration, distance } as EndTripRequest),
  })

  return await res.json()
}

// 📍 Отправка координат
export async function sendLocation(
  userId: number,
  tripId: number,
  latitude: number,
  longitude: number
): Promise<void> {
  await fetch(`${getBaseUrl()}/api/location`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, trip_id: tripId, latitude, longitude }),
  })
}

// 🛣 Получение маршрута
export async function getTripRoute(tripId: number): Promise<TripRoutePoint[]> {
  const res = await fetch(`${getBaseUrl()}/api/trip/${tripId}/route`)
  const json = await res.json()
  return json.route
}

// 👥 Получение водителей
export async function getDrivers(): Promise<Driver[]> {
  const res = await fetch(`${getBaseUrl()}/api/drivers`)
  const json = await res.json()
  return json.drivers
}

// 🚗 Получение машин
export async function getCars(): Promise<Car[]> {
  const res = await fetch(`${getBaseUrl()}/api/cars`)
  const json = await res.json()
  return json.cars
}

// ➕ Добавление машины
export async function createCar(form: FormData): Promise<void> {
  await fetch(`${getBaseUrl()}/api/car`, {
    method: 'POST',
    body: form,
  })
}

// ✏️ Обновление машины
export async function updateCar(id: number, form: FormData): Promise<void> {
  await fetch(`${getBaseUrl()}/api/car/${id}`, {
    method: 'PUT',
    body: form,
  })
}

// ➕ Добавление водителя
export async function createDriver(form: FormData): Promise<void> {
  await fetch(`${getBaseUrl()}/api/driver`, {
    method: 'POST',
    body: form,
  })
}

// ❌ Удаление машины
export async function deleteCar(id: number): Promise<void> {
  await fetch(`${getBaseUrl()}/api/car/${id}`, {
    method: 'DELETE',
  })
}

// ❌ Удаление водителя
export async function deleteDriver(id: number): Promise<void> {
  await fetch(`${getBaseUrl()}/api/driver/${id}`, {
    method: 'DELETE',
  })
}

// 🔗 Назначить машины водителю
export async function assignCarsToDriver(driverId: number, carIds: number[]): Promise<void> {
  await fetch(`${getBaseUrl()}/api/assign-car`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ driver_id: driverId, car_ids: carIds }),
  })
}

// 📍 Активные водители (для карты)
export async function getActiveDrivers(): Promise<Driver[]> {
  const res = await fetch(`${getBaseUrl()}/api/active-drivers`)
  const json = await res.json()
  return json.drivers
}
