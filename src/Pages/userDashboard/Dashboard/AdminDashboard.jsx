import {
  FiTruck,
  FiPlus,
  FiMapPin,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
} from "react-icons/fi";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useNavigate } from "react-router";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Components/Loading";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: countStatus, isLoading } = useQuery({
    queryKey: ["countStatus"],
    queryFn: async () => {
      const response = await axiosSecure.get("/parcel/delivery/status");
      return response.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const deliveryStatus = countStatus.statusCounts;
  const totalParcel = countStatus.total;

  const statusChartData = {
    labels: deliveryStatus.map((status) =>
      status._id.replace("_", " ").toUpperCase()
    ),
    datasets: [
      {
        label: "Number of Parcels",
        data: deliveryStatus.map((status) => status.count),
        backgroundColor: [
          "rgba(16, 185, 129, 0.7)", // Delivered - green
          "rgba(239, 68, 68, 0.7)", // Not collected - red
          "rgba(59, 130, 246, 0.7)", // In transit - blue
          "rgba(249, 115, 22, 0.7)", // Pending - orange (add your fourth color)
        ],
        borderColor: [
          "rgba(16, 185, 129, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(249, 115, 22, 1)", // Add your fourth border color
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6 p-4">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Parcels</p>
              <p className="text-3xl font-bold mt-1">{totalParcel}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <FiTruck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {deliveryStatus[0]._id}
              </p>
              <p className="text-3xl font-bold mt-1">
                {deliveryStatus[0].count}
              </p>
            </div>
            <div className="p-3 rounded-full bg-amber-50 text-amber-600">
              <FiClock className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {deliveryStatus[1]._id}
              </p>
              <p className="text-3xl font-bold mt-1">
                {deliveryStatus[1].count}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <FiTruck className="w-6 h-6" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {deliveryStatus[2]._id}
              </p>
              <p className="text-3xl font-bold mt-1">
                {deliveryStatus[2].count}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                {deliveryStatus[3]._id}
              </p>
              <p className="text-3xl font-bold mt-1">
                {deliveryStatus[3].count}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Quick Actions */}
      {/* <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            onClick={() => navigate("/dashboard/addParcel")}
          >
            <div className="p-3 rounded-full bg-lime-100 text-lime-600 mb-2">
              <FiPlus className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">New Parcel</span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-2">
              <FiMapPin className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Track Parcel</span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-2">
              <FiDollarSign className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Make Payment</span>
          </button>

          <button className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="p-3 rounded-full bg-amber-100 text-amber-600 mb-2">
              <FiClock className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Schedule Pickup</span>
          </button>
        </div>
      </div> */}

      {/* 3. Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Parcel Status Overview</h2>
        <div className="h-80">
          <Pie
            data={statusChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
