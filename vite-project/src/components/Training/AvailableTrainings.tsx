import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock, Calendar, DollarSign, User } from "lucide-react";

interface Training {
    id: number;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    price: string;
    startDate: string;
    image: string;
}

const AvailableTrainings = () => {
    const [trainings, setTrainings] = useState<Training[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/training");
                setTrainings(response.data.data);
            } catch (err) {
                console.error("Error fetching trainings:", err);
                setError("Failed to load trainings");
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
                    Available Training Courses
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {trainings.map((training) => (
                        <div
                            key={training.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                        >
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={training.image}
                                    alt={training.title}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {training.title}
                                </h3>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {training.description}
                                </p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-gray-600">
                                        <User className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm">{training.instructor}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Clock className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm">{training.duration}</span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                                        <span className="text-sm">Starts: {training.startDate}</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                    <div className="flex items-center font-bold text-blue-600 text-lg">
                                        <DollarSign className="h-5 w-5" />
                                        <span>{training.price.replace('$', '')}</span>
                                    </div>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                                        Enroll Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AvailableTrainings;
