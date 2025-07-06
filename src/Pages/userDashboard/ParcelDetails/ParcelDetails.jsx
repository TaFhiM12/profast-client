import { useParams } from 'react-router';
import { FiTruck, FiClock, FiCheckCircle, FiMapPin, FiPhone, FiMail, FiDollarSign, FiBox, FiLayers, FiAlertCircle } from 'react-icons/fi';
import { FaWeightHanging, FaRoute, FaSignature } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import useAxiosSecure from '../../../Hooks/useAxiosSecure';
import PageLoader from '../../Shared/PageLoader';

const ParcelDetails = () => {
    const { id } = useParams();
    const [parcel, setParcel] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchParcel = async () => {
            try {
                const response = await axiosSecure.get(`/parcel/${id}`);
                setParcel(response.data);
            } catch (error) {
                console.error("Error fetching parcel:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchParcel();
    }, [id, axiosSecure]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending':
                return <span className="badge badge-warning gap-2"><FiClock /> Pending</span>;
            case 'in_transit':
                return <span className="badge badge-info gap-2"><FiTruck /> In Transit</span>;
            case 'delivered':
                return <span className="badge badge-success gap-2"><FiCheckCircle /> Delivered</span>;
            default:
                return <span className="badge badge-neutral gap-2">{status}</span>;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <PageLoader/>
    }

    if (!parcel) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <FiAlertCircle size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-600">Parcel not found</h3>
                <p className="text-gray-500">The requested parcel could not be loaded</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-base-100 rounded-xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Parcel Details</h1>
                    <div className="flex items-center gap-4">
                        <div className="font-mono text-lg font-semibold text-primary">
                            {parcel.parcelId}
                        </div>
                        {getStatusBadge(parcel.status)}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="btn btn-primary">
                        <FiTruck className="mr-2" />
                        Track Parcel
                    </button>
                    <button className="btn btn-outline">
                        Print Details
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Parcel Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Parcel Summary Card */}
                    <div className="card bg-white shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-xl flex items-center gap-2">
                                <FiBox />
                                Parcel Information
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                    <h3 className="font-medium text-gray-500">Title</h3>
                                    <p className="text-lg">{parcel.title}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-500">Type</h3>
                                    <p className="text-lg capitalize">{parcel.type}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-500 flex items-center gap-1">
                                        <FaWeightHanging />
                                        Weight
                                    </h3>
                                    <p className="text-lg">{parcel.weight} kg</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-500 flex items-center gap-1">
                                        <FiDollarSign />
                                        Value
                                    </h3>
                                    <p className="text-lg">৳{parcel.value || 'Not specified'}</p>
                                </div>
                                <div className="md:col-span-2">
                                    <h3 className="font-medium text-gray-500">Contents Description</h3>
                                    <p className="text-lg">{parcel.contentsDescription || 'No description provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Route Information */}
                    <div className="card bg-white shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-xl flex items-center gap-2">
                                <FaRoute />
                                Route Information
                            </h2>
                            <div className="mt-4 space-y-6">
                                {/* Sender Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-500">Sender</h3>
                                        <p className="text-lg font-medium">{parcel.senderName}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500 flex items-center gap-1">
                                            <FiPhone />
                                            Contact
                                        </h3>
                                        <p className="text-lg">{parcel.senderContact}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500 flex items-center gap-1">
                                            <FiMapPin />
                                            Region
                                        </h3>
                                        <p className="text-lg">{parcel.senderRegion}</p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <h3 className="font-medium text-gray-500">Address</h3>
                                        <p className="text-lg">{parcel.senderAddress}</p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <h3 className="font-medium text-gray-500">Pickup Instructions</h3>
                                        <p className="text-lg">{parcel.pickupInstructions}</p>
                                    </div>
                                </div>

                                {/* Receiver Info */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-green-50 rounded-lg">
                                    <div>
                                        <h3 className="font-medium text-gray-500">Receiver</h3>
                                        <p className="text-lg font-medium">{parcel.receiverName}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500 flex items-center gap-1">
                                            <FiPhone />
                                            Contact
                                        </h3>
                                        <p className="text-lg">{parcel.receiverContact}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-500 flex items-center gap-1">
                                            <FiMapPin />
                                            Region
                                        </h3>
                                        <p className="text-lg">{parcel.receiverRegion}</p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <h3 className="font-medium text-gray-500">Address</h3>
                                        <p className="text-lg">{parcel.receiverAddress}</p>
                                    </div>
                                    <div className="md:col-span-3">
                                        <h3 className="font-medium text-gray-500">Delivery Instructions</h3>
                                        <p className="text-lg">{parcel.deliveryInstructions}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Timeline and Actions */}
                <div className="space-y-6">
                    {/* Timeline */}
                    <div className="card bg-white shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-xl flex items-center gap-2">
                                <FiClock />
                                Tracking History
                            </h2>
                            <div className="mt-4">
                                <ul className="timeline timeline-vertical">
                                    {parcel.trackingHistory.map((event, index) => (
                                        <li key={index}>
                                            <div className="timeline-start">
                                                <div className="text-xs text-gray-500">
                                                    {formatDate(event.timestamp)}
                                                </div>
                                            </div>
                                            <div className="timeline-middle">
                                                <div className={`w-4 h-4 rounded-full ${
                                                    index === 0 ? 'bg-primary' : 
                                                    event.status === 'delivered' ? 'bg-success' : 
                                                    'bg-info'
                                                }`}></div>
                                            </div>
                                            <div className="timeline-end timeline-box">
                                                <div className="font-medium capitalize">{event.status.replace('_', ' ')}</div>
                                                <div className="text-sm text-gray-600">{event.location}</div>
                                                {event.notes && (
                                                    <div className="text-xs mt-1">{event.notes}</div>
                                                )}
                                            </div>
                                            {index < parcel.trackingHistory.length - 1 && <hr />}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Actions */}
                    <div className="card bg-white shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-xl flex items-center gap-2">
                                <FiDollarSign />
                                Payment Information
                            </h2>
                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Shipping Cost:</span>
                                    <span className="font-bold">৳{parcel.cost || '--'}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Payment Status:</span>
                                    <span className={`badge ${
                                        parcel.paymentStatus === 'paid' ? 'badge-success' : 
                                        parcel.paymentStatus === 'failed' ? 'badge-error' : 
                                        'badge-warning'
                                    }`}>
                                        {parcel.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium">{parcel.paymentMethod || 'Not specified'}</span>
                                </div>
                                <div className="divider"></div>
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span>৳{parcel.cost || '--'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="card bg-white shadow-sm">
                        <div className="card-body">
                            <h2 className="card-title text-xl">Quick Actions</h2>
                            <div className="mt-4 space-y-2">
                                <button className="btn btn-block btn-outline btn-primary">
                                    Update Delivery Instructions
                                </button>
                                <button className="btn btn-block btn-outline btn-secondary">
                                    Request Pickup Change
                                </button>
                                {parcel.paymentStatus !== 'paid' && (
                                    <button className="btn btn-block btn-success">
                                        Make Payment
                                    </button>
                                )}
                                {parcel.status !== 'delivered' && (
                                    <button onClick={handleDeleteDeliveryProcess} className="btn btn-block btn-error btn-outline">
                                        Cancel Shipment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParcelDetails;