import React from 'react';
import useAuth from '../../../Hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import Loading from '../../../Components/Loading';
import { FiDollarSign, FiCreditCard, FiCalendar, FiHash } from 'react-icons/fi';
import { FaBoxOpen } from 'react-icons/fa';

const PaymentHistory = () => {
    const {user} = useAuth();
    const axiosSecure = useAxiosSecure();

    const {data: payments = [], isPending} = useQuery({
        queryKey: ['payments', user?.email],
        queryFn: async () => {
            const response = await axiosSecure.get(`/payments?email=${user?.email}`);
            return response.data;
        }
    });

    if(isPending){
        return <Loading/>;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatAmount = (amount) => {
        return (amount / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FiDollarSign className="text-lime-600" />
                    Payment History
                </h2>
                <p className="text-gray-600">View all your past transactions</p>
            </div>

            {payments.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <FaBoxOpen className="mx-auto text-4xl text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">No payment history found</h3>
                    <p className="text-gray-500 mt-2">You haven't made any payments yet.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <FiHash className="text-gray-400" />
                                            Transaction ID
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <FaBoxOpen className="text-gray-400" />
                                            Parcel
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <FiDollarSign className="text-gray-400" />
                                            Amount
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <FiCreditCard className="text-gray-400" />
                                            Method
                                        </div>
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            <FiCalendar className="text-gray-400" />
                                            Date
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap group relative">
                                            <div className="text-sm font-medium text-gray-900">
                                                {payment.transactionId.substring(0, 8)}...
                                            </div>
                                            <div className="absolute z-10 left-0 ml-6 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {payment.transactionId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap group relative">
                                            <div className="text-sm text-gray-500">
                                                {payment.parcelId.substring(0, 8)}...
                                            </div>
                                            <div className="absolute z-10 left-0 ml-6 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                {payment.parcelId}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-lime-600">
                                                {formatAmount(payment.amount)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                                                {payment.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(payment.paidAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Mobile View */}
            <div className="mt-4 md:hidden">
                {payments.map((payment) => (
                    <div key={payment._id} className="bg-white rounded-lg shadow p-4 mb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="group relative">
                                    <h3 className="font-medium text-gray-900">
                                        {payment.transactionId.substring(0, 8)}...
                                    </h3>
                                    <div className="absolute z-10 left-0 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {payment.transactionId}
                                    </div>
                                </div>
                                <div className="group relative mt-1">
                                    <p className="text-sm text-gray-500">
                                        Parcel: {payment.parcelId.substring(0, 8)}...
                                    </p>
                                    <div className="absolute z-10 left-0 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        {payment.parcelId}
                                    </div>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-lime-600">
                                {formatAmount(payment.amount)}
                            </span>
                        </div>
                        <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                                {payment.paymentMethod}
                            </span>
                            <span className="text-xs text-gray-500">
                                {formatDate(payment.paidAt)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PaymentHistory;