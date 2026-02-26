import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { Plus, Car, Calendar, Trash2 } from "lucide-react";

const VehicleManagement = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    vehicleNumber: "",
    model: "",
    brand: "",
    year: new Date().getFullYear(),
    purchaseDate: "",
  });

  useEffect(() => {
    if (user) {
      fetchVehicles();
    }
  }, [user]);

  const fetchVehicles = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("vehicles")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (data) setVehicles(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const purchaseDate = new Date(formData.purchaseDate);
    const warrantyExpiryDate = new Date(purchaseDate);
    warrantyExpiryDate.setFullYear(
      warrantyExpiryDate.getFullYear() + 2
    );

    const { error } = await supabase.from("vehicles").insert({
      user_id: user?.id,
      vehicle_number: formData.vehicleNumber,
      model: formData.model,
      brand: formData.brand,
      year: formData.year,
      purchase_date: formData.purchaseDate,
      warranty_expiry_date: warrantyExpiryDate
        .toISOString()
        .split("T")[0],
    });

    if (!error) {
      setShowForm(false);
      setFormData({
        vehicleNumber: "",
        model: "",
        brand: "",
        year: new Date().getFullYear(),
        purchaseDate: "",
      });
      fetchVehicles();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (!error) {
        fetchVehicles();
      }
    }
  };

  const getWarrantyStatus = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    if (diffDays < 0) {
      return {
        text: "Expired",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    } else if (diffDays < 90) {
      return {
        text: `${diffDays} days left`,
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    } else {
      return {
        text: "Active",
        color: "bg-green-100 text-green-800 border-green-200",
      };
    }
  };

  // ================= FORM VIEW =================
  if (showForm) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500 p-3 rounded-xl">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Vehicle
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Number
              </label>
              <input
                type="text"
                value={formData.vehicleNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicleNumber: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="AB-1234"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                value={formData.brand}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    brand: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Brand"
                required
              />

              <input
                type="text"
                value={formData.model}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    model: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                placeholder="Model"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="number"
                value={formData.year}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    year: parseInt(e.target.value),
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />

              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    purchaseDate: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg"
              >
                Add Vehicle
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // ================= LIST VIEW =================
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">My Vehicles</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : vehicles.length === 0 ? (
        <p>No Vehicles Yet</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => {
            const warrantyStatus = getWarrantyStatus(
              vehicle.warranty_expiry_date
            );

            return (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="bg-blue-500 p-4 text-white">
                  <div className="flex justify-between">
                    <Car />
                    <Trash2
                      onClick={() => handleDelete(vehicle.id)}
                      className="cursor-pointer"
                    />
                  </div>
                  <h3 className="text-xl font-bold">
                    {vehicle.brand}
                  </h3>
                  <p>{vehicle.model}</p>
                </div>

                <div className="p-6">
                  <p>
                    <strong>Number:</strong>{" "}
                    {vehicle.vehicle_number}
                  </p>
                  <p>
                    <strong>Year:</strong> {vehicle.year}
                  </p>
                  <p>
                    <strong>Expires:</strong>{" "}
                    {new Date(
                      vehicle.warranty_expiry_date
                    ).toLocaleDateString()}
                  </p>

                  <span
                    className={`px-2 py-1 text-xs rounded-full border ${warrantyStatus.color}`}
                  >
                    {warrantyStatus.text}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;