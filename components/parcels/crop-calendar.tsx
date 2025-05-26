"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Crop } from "@/types/crop";
import {
  addMonths,
  format,
  isSameMonth,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";

interface CropCalendarProps {
  crops: Crop[];
}

export function CropCalendar({ crops }: CropCalendarProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "year">("month");

  const getMonthCrops = (date: Date) => {
    return crops.filter((crop) => {
      const plantingDate = parseISO(crop.plantingDate);
      const harvestDate = parseISO(crop.harvestDate);

      return (
        isWithinInterval(date, { start: plantingDate, end: harvestDate }) ||
        isSameMonth(date, plantingDate) ||
        isSameMonth(date, harvestDate)
      );
    });
  };

  const getDayStyle = (date: Date) => {
    const dayCrops = crops.filter((crop) => {
      const plantingDate = parseISO(crop.plantingDate);
      const harvestDate = parseISO(crop.harvestDate);

      return isWithinInterval(date, { start: plantingDate, end: harvestDate });
    });

    if (dayCrops.length > 0) {
      return "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100";
    }

    return "";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Calendrier cultural</CardTitle>
            <CardDescription>
              Planification des cultures sur l'année
            </CardDescription>
          </div>
          <Select
            value={view}
            onValueChange={(value) => setView(value as "month" | "year")}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois</SelectItem>
              <SelectItem value="year">Année</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-[1fr,300px]">
          <Calendar
            mode="single"
            selected={selectedMonth}
            onSelect={(date) => date && setSelectedMonth(date)}
            locale={fr}
            showOutsideDays
            modifiers={{
              booked: (date) =>
                crops.some((crop) => {
                  const plantingDate = parseISO(crop.plantingDate);
                  const harvestDate = parseISO(crop.harvestDate);
                  return isWithinInterval(date, {
                    start: plantingDate,
                    end: harvestDate,
                  });
                }),
            }}
            modifiersStyles={{
              booked: {
                backgroundColor: "var(--green-100)",
                color: "var(--green-900)",
              },
            }}
          />

          <div className="space-y-4">
            <h3 className="font-medium">
              Cultures - {format(selectedMonth, "MMMM yyyy", { locale: fr })}
            </h3>
            <div className="space-y-2">
              {getMonthCrops(selectedMonth).map((crop) => (
                <div key={crop.id} className="rounded-lg border p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{crop.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {crop.variety}
                      </p>
                    </div>
                    <Badge
                      variant={
                        crop.status === "active"
                          ? "default"
                          : crop.status === "planned"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {crop.status === "active"
                        ? "Active"
                        : crop.status === "planned"
                        ? "Planifiée"
                        : "Récoltée"}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p>
                      Plantation:{" "}
                      {format(parseISO(crop.plantingDate), "dd/MM/yyyy")}
                    </p>
                    <p>
                      Récolte prévue:{" "}
                      {format(parseISO(crop.harvestDate), "dd/MM/yyyy")}
                    </p>
                    <p>Surface: {crop.area} ha</p>
                  </div>
                </div>
              ))}
              {getMonthCrops(selectedMonth).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Aucune culture pour ce mois
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
