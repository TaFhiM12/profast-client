import { FiTruck, FiPlus, FiMapPin, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router';
import { useState } from 'react';
import { useEffect } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardIndex = () => {
  const navigate = useNavigate();
  const [totalParcels , setTotalParcels] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosSecure.get('/statsCount');
        setTotalParcels(response.data.totalParcels);
        setTotalPending(response.data.totalPending);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [axiosSecure]);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Parcels Sent',
        data: [12, 19, 8, 15, 12, 17],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
      },
      {
        label: 'Parcels Delivered',
        data: [10, 15, 5, 12, 10, 14],
        backgroundColor: 'rgba(16, 185, 129, 0.7)',
      },
    ],
  };

  return (
    <div className="space-y-6 p-4">
      {/* 1. Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Parcels</p>
              <p className="text-3xl font-bold mt-1">{totalParcels}</p>
            </div>
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-600">
              <FiTruck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-500 mt-2">↑ 12% from last month</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-3xl font-bold mt-1">{totalPending}</p>
            </div>
            <div className="p-3 rounded-full bg-amber-50 text-amber-600">
              <FiClock className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-red-500 mt-2">↑ 2 from yesterday</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Transit</p>
              <p className="text-3xl font-bold mt-1">14</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50 text-blue-600">
              <FiTruck className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-500 mt-2">5 arriving today</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-3xl font-bold mt-1">20</p>
            </div>
            <div className="p-3 rounded-full bg-green-50 text-green-600">
              <FiCheckCircle className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm text-green-500 mt-2">↑ 18% from last month</p>
        </div>
      </div>

      {/* 2. Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/dashboard/addParcel')}
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
      </div>

      {/* 3. Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4">Monthly Shipment Overview</h2>
        <div className="h-80">
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 5
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardIndex;