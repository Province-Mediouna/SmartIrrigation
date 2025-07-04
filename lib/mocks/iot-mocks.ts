import { IoTDevice } from "@/types/iot";

export const MOCK_IOT_DEVICES: IoTDevice[] = [
  {
    id: "sensor-01",
    name: "Capteur d'humidité (Parcelle Nord)",
    type: "SENSOR",
    protocol: "MQTT",
    configuration: { topic: "/sensors/humidity/nord" },
    status: "ONLINE",
    lastHeartbeat: new Date().toISOString(),
    firmwareVersion: "1.2.3",
    batteryLevel: 88,
    signalStrength: 75,
    location: { latitude: 33.58, longitude: -7.6 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "actuator-01",
    name: "Vanne d'irrigation (Zone A)",
    type: "ACTUATOR",
    protocol: "LORAWAN",
    configuration: { devEUI: "A8-40-41-00-01-81-9A-0D" },
    status: "OFFLINE",
    lastHeartbeat: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    firmwareVersion: "2.0.1",
    batteryLevel: 45,
    signalStrength: 50,
    location: { latitude: 33.581, longitude: -7.605 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]; 