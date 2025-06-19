import { useState } from "react";
import { useIrrigationSchedule } from "@/hooks/use-irrigation-schedule";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Edit2, Plus } from "lucide-react";

export function IrrigationScheduleManager({ zoneId }: { zoneId: string }) {
  const {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    fetchSchedules,
  } = useIrrigationSchedule(zoneId);

  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleCreate = async () => {
    setFormError(null);
    if (!newStart || !newEnd) {
      setFormError("Veuillez renseigner les horaires de début et de fin.");
      return;
    }
    setActionLoading(true);
    const ok = await createSchedule({ startTime: newStart, endTime: newEnd });
    if (ok) {
      setNewStart("");
      setNewEnd("");
    }
    setActionLoading(false);
  };

  const handleEdit = async (id: string) => {
    setFormError(null);
    if (!editStart || !editEnd) {
      setFormError("Veuillez renseigner les horaires de début et de fin.");
      return;
    }
    setActionLoading(true);
    const ok = await updateSchedule(id, {
      startTime: editStart,
      endTime: editEnd,
    });
    if (ok) {
      setEditingId(null);
      setEditStart("");
      setEditEnd("");
    }
    setActionLoading(false);
  };

  const handleDelete = async (id: string) => {
    setActionLoading(true);
    await deleteSchedule(id);
    setActionLoading(false);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Plannings d'irrigation</h3>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {formError && <div className="text-red-500 text-sm">{formError}</div>}
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin" /> Chargement...
        </div>
      ) : (
        <ul className="space-y-2">
          {schedules.length === 0 && (
            <li className="text-muted-foreground text-sm">Aucun planning.</li>
          )}
          {schedules.map((s) => (
            <li key={s.id} className="flex items-center gap-2">
              {editingId === s.id ? (
                <>
                  <Input
                    type="time"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    className="w-28"
                  />
                  <span>→</span>
                  <Input
                    type="time"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    className="w-28"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleEdit(s.id)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="animate-spin w-4 h-4" />
                    ) : (
                      "Enregistrer"
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingId(null)}
                  >
                    Annuler
                  </Button>
                </>
              ) : (
                <>
                  <span>
                    {s.startTime} → {s.endTime}
                  </span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setEditingId(s.id);
                      setEditStart(s.startTime);
                      setEditEnd(s.endTime);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(s.id)}
                    disabled={actionLoading}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center gap-2 mt-4">
        <Input
          type="time"
          value={newStart}
          onChange={(e) => setNewStart(e.target.value)}
          className="w-28"
          placeholder="Début"
        />
        <span>→</span>
        <Input
          type="time"
          value={newEnd}
          onChange={(e) => setNewEnd(e.target.value)}
          className="w-28"
          placeholder="Fin"
        />
        <Button onClick={handleCreate} disabled={actionLoading}>
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </div>
    </div>
  );
}
