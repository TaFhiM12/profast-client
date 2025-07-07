import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import Loading from "../../Components/Loading";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { FaBox, FaMoneyBillWave, FaMapMarkerAlt, FaClock, FaTruck, FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaCalendar } from "react-icons/fa";
import Swal from "sweetalert2";

const CompletedDeleveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  
  const { data: completedDelivery = [], isLoading, refetch } = useQuery({
    queryKey: ["completedDelivery", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/completed/delivery?email=${user?.email}`
      );
      return response.data;
    },
  });

  // Calculate earnings and time-based earnings
  const calculateEarnings = (deliveries, timeRange) => {
    const now = new Date();
    let filteredDeliveries = deliveries;

    if (timeRange === 'today') {
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      filteredDeliveries = deliveries.filter(d => new Date(d.delivered_at) >= todayStart);
    } else if (timeRange === 'week') {
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      filteredDeliveries = deliveries.filter(d => new Date(d.delivered_at) >= weekStart);
    } else if (timeRange === 'month') {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      filteredDeliveries = deliveries.filter(d => new Date(d.delivered_at) >= monthStart);
    } else if (timeRange === 'year') {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      filteredDeliveries = deliveries.filter(d => new Date(d.delivered_at) >= yearStart);
    }

    return filteredDeliveries.reduce((sum, delivery) => {
      const isSameDistrict = delivery.senderRegion === delivery.receiverRegion;
      const earnings = isSameDistrict ? delivery.cost * 0.8 : delivery.cost * 0.3;
      return sum + (delivery.cashoutStatus === 'paid' ? 0 : earnings);
    }, 0).toFixed(2);
  };

  const todayEarnings = calculateEarnings(completedDelivery, 'today');
  const weekEarnings = calculateEarnings(completedDelivery, 'week');
  const monthEarnings = calculateEarnings(completedDelivery, 'month');
  const yearEarnings = calculateEarnings(completedDelivery, 'year');

  // Cashout mutation
  const { mutate: cashout } = useMutation({
    mutationFn: () => axiosSecure.post('/rider/cashout', { email: user?.email }),
    onSuccess: () => {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Cashout Successful!",
        showConfirmButton: false,
        timer: 1500
      });
      refetch();
    }
  });

  // Calculate earnings for each delivery
  const deliveriesWithEarnings = completedDelivery.map(delivery => {
    const isSameDistrict = delivery.senderRegion === delivery.receiverRegion;
    const earnings = isSameDistrict ? delivery.cost * 0.8 : delivery.cost * 0.3;
    
    return {
      ...delivery,
      earnings: earnings.toFixed(2),
      isPaid: delivery.cashoutStatus === 'paid',
      deliveredDate: delivery.delivered_at ? new Date(delivery.delivered_at) : null
    };
  });

  const pendingEarnings = deliveriesWithEarnings.reduce((sum, delivery) => 
    sum + (delivery.isPaid ? 0 : parseFloat(delivery.earnings)), 0).toFixed(2);

  const handleCashout = () => {
    if (pendingEarnings <= 0) {
      Swal.fire({
        icon: "warning",
        title: "No pending earnings",
        text: "You have no available balance to cashout",
      });
      return;
    }

    Swal.fire({
      title: `Cashout $${pendingEarnings}?`,
      text: "This action cannot be undone",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Confirm Cashout"
    }).then((result) => {
      if (result.isConfirmed) cashout();
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FaTruck className="text-lime-600" /> Completed Deliveries
            </h1>
            <p className="text-gray-600 mt-1">Delivery history and earnings</p>
          </div>
          
          <button 
            onClick={handleCashout}
            disabled={pendingEarnings <= 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold ${
              pendingEarnings > 0 
                ? 'bg-lime-600 hover:bg-lime-700 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <FaMoneyBillWave />
            Cashout ${pendingEarnings}
          </button>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <EarningsCard 
            icon={<FaCalendarDay className="text-blue-500" size={20} />}
            title="Today"
            amount={todayEarnings}
            bgColor="bg-blue-50"
          />
          <EarningsCard 
            icon={<FaCalendarWeek className="text-purple-500" size={20} />}
            title="This Week"
            amount={weekEarnings}
            bgColor="bg-purple-50"
          />
          <EarningsCard 
            icon={<FaCalendarAlt className="text-green-500" size={20} />}
            title="This Month"
            amount={monthEarnings}
            bgColor="bg-green-50"
          />
          <EarningsCard 
            icon={<FaCalendar className="text-orange-500" size={20} />}
            title="This Year"
            amount={yearEarnings}
            bgColor="bg-orange-50"
          />
        </div>

        {/* Delivery Cards */}
        <div className="space-y-6">
          {deliveriesWithEarnings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FaBox className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700">No completed deliveries</h3>
            </div>
          ) : (
            deliveriesWithEarnings.map((delivery) => (
              <div key={delivery._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <FaBox className="text-lime-600" /> {delivery.tracking_id}
                    </h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    delivery.isPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {delivery.isPaid ? 'Paid' : 'Pending'}
                  </span>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-lime-500" /> Route
                    </p>
                    <p className="font-medium mt-1">
                      {delivery.senderRegion} → {delivery.receiverRegion}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FaClock className="text-lime-500" /> Delivered On
                    </p>
                    <p className="font-medium mt-1">
                      {delivery.deliveredDate ? delivery.deliveredDate.toLocaleDateString() : 'N/A'}
                    </p>
                    {delivery.deliveredDate && (
                      <p className="text-xs text-gray-500 mt-1">
                        {delivery.deliveredDate.toLocaleTimeString()}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <FaMoneyBillWave className="text-lime-500" /> Earnings
                    </p>
                    <p className="text-xl font-bold text-lime-600 mt-1">
                      ${delivery.earnings}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {delivery.senderRegion === delivery.receiverRegion 
                        ? "Same district (80%)" 
                        : "Different district (30%)"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Earnings Card Component
const EarningsCard = ({ icon, title, amount, bgColor }) => (
  <div className={`${bgColor} p-4 rounded-lg shadow-sm border border-gray-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold mt-1">${amount}</p>
      </div>
      <div className="p-3 rounded-full bg-white">
        {icon}
      </div>
    </div>
  </div>
);

export default CompletedDeleveries;