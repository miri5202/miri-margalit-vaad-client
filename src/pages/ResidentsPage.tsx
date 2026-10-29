import { useParams } from "react-router-dom";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createResident, deleteResident, getResidents, updateResident } from "../api/users";
import type { ResidentInput, User } from "../types";
import ResidentForm from "../components/residents/ResidentForm";
import { getErrorMessage } from "../utils/errors";
import { apartmentLabel } from "../utils/format";
import { getBuilding } from "../api/buildings";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/common/EmptyState";
import { btn, card, cn, table, tableWrap, td, th } from "../utils/ui";

function ResidentsPage() {
    const { buildingId } = useParams();
    const id = Number(buildingId);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const queryClient = useQueryClient();
    const { data: building } = useQuery({
        queryKey: ["building", id],
        queryFn: () => getBuilding(id),
    });

    function openNew() {
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(r: User) {
        setEditing(r);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditing(null);
    }

    const { data: residents, isLoading, isError } = useQuery({
        queryKey: ["residents", id],
        queryFn: () => getResidents(id),
    });

    const saveMutation = useMutation({
        mutationFn: (data: ResidentInput) =>
            editing ? updateResident(id, editing.id, data) : createResident(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["residents", id] });
            closeForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (r: User) => deleteResident(id, r.id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["residents", id] }),
    });

    function handleDelete(r: User) {
        if (window.confirm(`למחוק את ${r.fullName}?`)) {
            deleteMutation.mutate(r);
        }
    }

    if (isLoading) return <Loader />;
    if (isError || !residents) return <ErrorMessage message="לא הצלחנו לטעון את העמוד" />;

    return (
        <>
            <PageHeader title="דיירים" subtitle={`${residents.length} דיירים בבניין`}>
                {!showForm && (
                    <button className={btn("primary")} onClick={openNew}>
                        + דייר חדש
                    </button>
                )}
            </PageHeader>

            {showForm && (
                <div className={cn(card, "mb-6")}>
                    <h2 className="mb-4 text-2xl">{editing ? "עריכת דייר" : "דייר חדש"}</h2>
                    <ResidentForm
                        key={editing?.id ?? "new"}
                        isEdit={editing !== null}
                        defaultValues={
                            editing
                                ? {
                                    fullName: editing.fullName,
                                    email: editing.email ?? undefined,
                                    apartment: editing.apartment ?? undefined,
                                    phone: editing.phone ?? undefined,
                                    isUnit: editing.isUnit,
                                }
                                : undefined
                        }
                        onSubmit={(data) => saveMutation.mutate(data)}
                        onCancel={closeForm}
                        isSubmitting={saveMutation.isPending}
                        serverError={saveMutation.error ? getErrorMessage(saveMutation.error) : undefined}
                        unitApartments={building?.unitApartments ?? []}
                    />
                </div>
            )}

            {residents.length === 0 ? (
                <EmptyState icon="🏢">עדיין אין דיירים בבניין</EmptyState>
            ) : (
                <div className={tableWrap}>
                    <table className={table}>
                        <thead>
                            <tr>
                                <th className={th}>דירה</th>
                                <th className={th}>שם</th>
                                <th className={th}>אימייל</th>
                                <th className={th}>טלפון</th>
                                <th className={th}></th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.map((r) => (
                                <tr key={r.id} className="hover:bg-soft">
                                    <td className={cn(td, "whitespace-nowrap")}>
                                        <strong>{apartmentLabel(r.apartment, r.isUnit)}</strong>
                                    </td>
                                    <td className={td}>
                                        {r.fullName}
                                        {!r.email && !r.phone && (
                                            <span
                                                className="ms-2 inline-flex rounded-lg border-2 border-dashed border-ink/60 px-2 py-0.5 text-xs text-muted"
                                                title="אין לדייר אימייל או טלפון, ולכן הוא לא יכול להתחבר לאתר"
                                            >
                                                לא מתחבר
                                            </span>
                                        )}
                                    </td>
                                    <td className={td}>{r.email ?? "–"}</td>
                                    <td className={cn(td, "num text-right")}>{r.phone ?? "–"}</td>
                                    <td className={td}>
                                        <div className="flex flex-nowrap gap-2">
                                            <button className={btn("secondary", "sm")} onClick={() => openEdit(r)}>
                                                עריכה
                                            </button>
                                            <button className={btn("danger", "sm")} onClick={() => handleDelete(r)}>
                                                מחיקה
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    );
}

export default ResidentsPage;