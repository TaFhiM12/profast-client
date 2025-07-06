import { 
  TruckIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  MapPinIcon,
  UsersIcon,
  StarIcon,
  CheckCircleIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOffice2Icon 
} from '@heroicons/react/24/outline';

const AboutUs = () => {
    const features = [
        {
            icon: <TruckIcon className="w-8 h-8" />,
            title: "Door-to-Door Delivery",
            description: "Complete pickup and delivery service right from your doorstep across Bangladesh"
        },
        {
            icon: <ShieldCheckIcon className="w-8 h-8" />,
            title: "Secure & Reliable",
            description: "Digital proof of delivery and real-time tracking for complete transparency"
        },
        {
            icon: <ClockIcon className="w-8 h-8" />,
            title: "Fast Processing",
            description: "Quick booking, efficient routing, and timely deliveries every time"
        },
        {
            icon: <MapPinIcon className="w-8 h-8" />,
            title: "Wide Coverage",
            description: "Extensive service center network covering major districts across Bangladesh"
        }
    ];

    const stats = [
        { number: "1000+", label: "Happy Customers" },
        { number: "50+", label: "Service Centers" },
        { number: "200+", label: "Active Riders" },
        { number: "99%", label: "Delivery Success" }
    ];

    const teamRoles = [
        {
            role: "Users",
            icon: <UsersIcon className="w-12 h-12" />,
            description: "Book parcels, track deliveries, and provide feedback",
            color: "text-primary"
        },
        {
            role: "Admins",
            icon: <BuildingOffice2Icon  className="w-12 h-12" />,
            description: "Manage logistics, assign riders, and oversee operations",
            color: "text-secondary"
        },
        {
            role: "Riders",
            icon: <TruckIcon className="w-12 h-12" />,
            description: "Handle pickups, deliveries, and ensure safe transport",
            color: "text-accent"
        }
    ];

    return (
        <div className="min-h-screen bg-base-100 mt-4">
            <div className="hero min-h-[60vh] bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="hero-content text-center">
                    <div className="max-w-4xl">
                        <h1 className="text-5xl font-bold text-primary mb-6">
                            About <span className="text-secondary">ZAPSHIFT</span>
                        </h1>
                        <p className="text-xl text-base-content/80 leading-relaxed mb-8">
                            Revolutionizing parcel delivery across Bangladesh with our comprehensive 
                            door-to-door pickup and delivery system. We streamline booking, tracking, 
                            and delivery processes to enhance efficiency and customer satisfaction.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <div className="badge badge-primary badge-lg p-4">
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Fast & Reliable
                            </div>
                            <div className="badge badge-secondary badge-lg p-4">
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Real-time Tracking
                            </div>
                            <div className="badge badge-accent badge-lg p-4">
                                <CheckCircleIcon className="w-4 h-4 mr-2" />
                                Digital Proof
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <div className="card bg-primary/5 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-3xl text-primary mb-4">Our Mission</h2>
                                <p className="text-lg text-base-content/80 leading-relaxed">
                                    To provide businesses and individuals across Bangladesh with the most 
                                    efficient, transparent, and reliable parcel delivery service. We aim to 
                                    simplify logistics while ensuring fast delivery operations with complete 
                                    digital tracking and proof of delivery.
                                </p>
                            </div>
                        </div>
                        <div className="card bg-secondary/5 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title text-3xl text-secondary mb-4">Our Vision</h2>
                                <p className="text-lg text-base-content/80 leading-relaxed">
                                    To become Bangladesh's leading parcel delivery platform, connecting every 
                                    district through our extensive service center network and dedicated riders, 
                                    making parcel delivery as simple as a few clicks.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-20 bg-base-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">Why Choose ZAPSHIFT?</h2>
                        <p className="text-xl text-base-content/70">
                            Experience the future of parcel delivery with our innovative features
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="card-body items-center text-center">
                                    <div className="text-primary mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="card-title text-lg mb-2">{feature.title}</h3>
                                    <p className="text-base-content/70">{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">Our Impact</h2>
                        <p className="text-xl text-base-content/70">
                            Numbers that speak for our commitment to excellence
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl shadow-lg">
                                <div className="stat-value text-primary text-4xl font-bold">{stat.number}</div>
                                <div className="stat-desc text-base-content/70 text-lg font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Team Roles Section */}
            <div className="py-20 bg-base-200">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">Our Team Structure</h2>
                        <p className="text-xl text-base-content/70">
                            Three core roles working together for seamless delivery experience
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {teamRoles.map((team, index) => (
                            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                                <div className="card-body items-center text-center">
                                    <div className={`${team.color} mb-4`}>
                                        {team.icon}
                                    </div>
                                    <h3 className="card-title text-2xl mb-2">{team.role}</h3>
                                    <p className="text-base-content/70 text-center">{team.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-primary mb-4">How ZAPSHIFT Works</h2>
                        <p className="text-xl text-base-content/70">
                            Simple steps to send your parcel anywhere in Bangladesh
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="card bg-gradient-to-br from-primary/10 to-primary/5 shadow-xl">
                            <div className="card-body items-center text-center">
                                <div className="badge badge-primary badge-lg text-white font-bold mb-4">1</div>
                                <h3 className="card-title text-lg mb-2">Book Online</h3>
                                <p className="text-base-content/70">Fill pickup and delivery details with parcel information</p>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-secondary/10 to-secondary/5 shadow-xl">
                            <div className="card-body items-center text-center">
                                <div className="badge badge-secondary badge-lg text-white font-bold mb-4">2</div>
                                <h3 className="card-title text-lg mb-2">Make Payment</h3>
                                <p className="text-base-content/70">Pay online and get your unique tracking number</p>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-accent/10 to-accent/5 shadow-xl">
                            <div className="card-body items-center text-center">
                                <div className="badge badge-accent badge-lg text-white font-bold mb-4">3</div>
                                <h3 className="card-title text-lg mb-2">Pickup & Transit</h3>
                                <p className="text-base-content/70">Our rider collects your parcel and updates status</p>
                            </div>
                        </div>
                        <div className="card bg-gradient-to-br from-success/10 to-success/5 shadow-xl">
                            <div className="card-body items-center text-center">
                                <div className="badge badge-success badge-lg text-white font-bold mb-4">4</div>
                                <h3 className="card-title text-lg mb-2">Delivery</h3>
                                <p className="text-base-content/70">Safe delivery with digital proof to recipient</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-gradient-to-r from-primary to-secondary">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        Ready to Experience Fast & Reliable Delivery?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Join thousands of satisfied customers who trust ZAPSHIFT for their parcel delivery needs
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button className="btn btn-white btn-lg">
                            <TruckIcon className="w-5 h-5 mr-2" />
                            Send a Parcel
                        </button>
                        <button className="btn btn-outline btn-white btn-lg">
                            <MapPinIcon className="w-5 h-5 mr-2" />
                            Track Parcel
                        </button>
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="py-16 bg-base-200">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-primary mb-4">Get in Touch</h2>
                        <p className="text-lg text-base-content/70">
                            Have questions? We're here to help you with your delivery needs
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body items-center text-center">
                                <PhoneIcon className="w-8 h-8 text-primary mb-2" />
                                <h3 className="font-semibold mb-2">Call Us</h3>
                                <p className="text-base-content/70">+880-XXXX-XXXX</p>
                            </div>
                        </div>
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body items-center text-center">
                                <EnvelopeIcon className="w-8 h-8 text-primary mb-2" />
                                <h3 className="font-semibold mb-2">Email Us</h3>
                                <p className="text-base-content/70">support@zapshift.com</p>
                            </div>
                        </div>
                        <div className="card bg-base-100 shadow-lg">
                            <div className="card-body items-center text-center">
                                <BuildingOffice2Icon className="w-8 h-8 text-primary mb-2" />
                                <h3 className="font-semibold mb-2">Visit Us</h3>
                                <p className="text-base-content/70">Dhaka, Bangladesh</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;