import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const RegistrationPending = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Thank you very much for your registration
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your registration has been sent for approval. You will receive updates within a few hours.
                    </p>
                    <div className="mt-6">
                        <Link
                            to="/"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPending;
