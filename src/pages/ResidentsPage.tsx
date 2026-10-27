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

function ResidentsPage() {
    const { buildingId } = useParams();
    const id = Number(buildingId);

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<User | null>(null);
    const queryClient = useQueryClient();

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
            <div className="page-header">
                <div>
                    <h1>דיירים</h1>
                    <p>{residents.length} דיירים בבניין</p>
                </div>
            </div>
            {!showForm && (
                <button className="btn btn--accent" onClick={openNew}>
                    + דייר חדש
                </button>
            )}
            {residents.length === 0 && (
                <div className="card empty-state">
                    <div className="empty-state__icon">🏢</div>
                    עדיין אין דיירים בבניין                </div>
            )}
            {showForm && (
                <div className="card" style={{ marginBottom: 24 }}>
                    <h2>{editing ? "עריכת דייר" : "דייר חדש"}</h2>
                    <ResidentForm
                        key={editing?.id ?? "new"}
                        isEdit={editing !== null}
                        defaultValues={
                            editing
                                ? {
                                    fullName: editing.fullName, email: editing.email,
                                    apartment: editing.apartment ?? undefined, phone: editing.phone ?? undefined
                                }
                                : undefined
                        }
                        onSubmit={(data) => saveMutation.mutate(data)}
                        onCancel={closeForm}
                        isSubmitting={saveMutation.isPending}
                        serverError={saveMutation.error ? getErrorMessage(saveMutation.error) : undefined}
                    />
                </div>
            )}
            {residents.length > 0 && (
                <div className="table-wrap">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>דירה</th>
                                <th>שם</th>
                                <th>אימייל</th>
                                <th>טלפון</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.map((r) => (
                                <tr key={r.id}>
                                    <td><strong>{apartmentLabel(r.apartment, r.isUnit)}</strong></td>                                    <td>{r.fullName}</td>
                                    <td>{r.email}</td>
                                    <td className="num">{r.phone ?? "–"}</td>
                                    <td className="actions">
                                        <button className="btn btn--sm btn--secondary" onClick={() => openEdit(r)}>
                                            עריכה
                                        </button>
                                        <button className="btn btn--sm btn--danger" onClick={() => handleDelete(r)}>
                                            מחיקה
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </>
    )
}

export default ResidentsPage;