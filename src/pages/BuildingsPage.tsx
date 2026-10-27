import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBuilding, getBuildings } from "../api/buildings";
import BuildingForm from "../components/Buildings/BuildingForm";
import { getErrorMessage } from "../utils/errors";
import type { BuildingInput } from "../types";
import BuildingCard from "../components/Buildings/BuildingCard";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";

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
      <div className="page-header">
        <div>
          <h1>הבניינים שלי</h1>
          <p>בחרו בניין כדי לנהל אותו</p>
        </div>
      </div>

      {showForm && (
        <div className="card section" style={{ marginBottom: 24 }}>          <h2>בניין חדש</h2>
          <BuildingForm
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowForm(false)}
            isSubmitting={createMutation.isPending}
            serverError={createMutation.error ? getErrorMessage(createMutation.error) : undefined}
          />
        </div>
      )}

      <div className="card-grid">
        {buildings?.map((building) => (
          <BuildingCard key={building.id} building={building} />
        ))}
        {!showForm && (
          <button className="add-card" onClick={() => setShowForm(true)}>
            + הוספת בניין
          </button>
        )}
      </div>
    </>
  );
}

export default BuildingsPage;