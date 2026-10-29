import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBuilding, getBuildings } from "../api/buildings";
import BuildingForm from "../components/Buildings/BuildingForm";
import { getErrorMessage } from "../utils/errors";
import type { BuildingInput } from "../types";
import BuildingCard from "../components/Buildings/BuildingCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import PageHeader from "../components/ui/PageHeader";
import { card } from "../utils/ui";

function BuildingsPage() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: buildings, isLoading, isError } = useQuery({
    queryKey: ["buildings"],
    queryFn: getBuildings,
  });

  const createMutation = useMutation({
    mutationFn: (data: BuildingInput) => createBuilding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      setShowForm(false);
    },
  });

  if (isLoading) return <Loader />;
  if (isError) return <ErrorMessage message="לא הצלחנו לטעון את הבניינים" />;

  return (
    <>
      <PageHeader title="הבניינים שלי" subtitle="בחרו בניין כדי לנהל אותו" />

      {showForm && (
        <div className={`${card} mb-6`}>
          <h2 className="mb-4 text-2xl">בניין חדש</h2>
          <BuildingForm
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
            isSubmitting={createMutation.isPending}
            serverError={createMutation.error ? getErrorMessage(createMutation.error) : undefined}
          />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {buildings?.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="grid min-h-48 cursor-pointer place-items-center rounded-3xl border-[2.5px] border-dashed border-ink/50 bg-transparent font-hand text-lg font-semibold text-muted transition-colors hover:border-ink hover:bg-sun/30 hover:text-ink"
          >
            + הוספת בניין
          </button>
        )}
      </div>
    </>
  );
}

export default BuildingsPage;
