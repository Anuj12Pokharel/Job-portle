import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { MapPin, Calendar, Briefcase, DollarSign, Filter, Search } from "lucide-react";
import { LiaMoneyCheckSolid } from "react-icons/lia";
import { FaBusinessTime } from "react-icons/fa";

interface Job {
    _id: string;
    companyName: string;
    logo?: string;
    position: string;
    location: string;
    expiryDate?: string;
    jobLevel?: string;
    jobType: string;
    salary?: string;
    experience?: string;
    category?: string;
    description?: string;
    createdAt?: string;
}

interface Category {
    name: string;
    count: number;
}

export default function Jobs() {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";

    const [jobs, setJobs] = useState<Job[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(search);
    const [locationTerm, setLocationTerm] = useState(location);
    const [selectedCategory, setSelectedCategory] = useState(category);
    const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

    const backendBase =
        import.meta.env.VITE_API_BASE_URL ||
        "https://job-portle-backend-fsai.onrender.com";

    const buildLogoUrl = (logo?: string) => {
        if (!logo || String(logo) === "undefined" || String(logo) === "null") return "";
        const cleaned = String(logo).replace(/\\/g, "/");
        // If it's already a full http URL, use it directly
        if (cleaned.startsWith("http")) return cleaned;
        // Extract the relative part starting from 'uploads/'
        const uploadsIndex = cleaned.indexOf("uploads/");
        const relativePath = uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : cleaned.replace(/^\/+/, "");
        return `${backendBase}/${relativePath}`;
    };

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${backendBase}/api/jobs/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, [backendBase]);

    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (category) params.append("category", category);
                if (search) params.append("search", search);
                if (location) params.append("location", location);

                const url = `${backendBase}/api/jobs/get${params.toString() ? `?${params.toString()}` : ""}`;
                const res = await axios.get(url);
                setJobs(res.data);
            } catch (err) {
                console.error("Failed to fetch jobs:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [category, search, location, backendBase]);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedCategory) params.append("category", selectedCategory);
        if (searchTerm.trim()) params.append("search", searchTerm.trim());
        if (locationTerm.trim()) params.append("location", locationTerm.trim());
        setSearchParams(params);
    };

    const handleCategoryChange = (newCategory: string) => {
        setSelectedCategory(newCategory);
        const params = new URLSearchParams();
        if (newCategory) params.append("category", newCategory);
        if (search) params.append("search", search);
        if (location) params.append("location", location);
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSelectedCategory("");
        setSearchTerm("");
        setLocationTerm("");
        setSearchParams({});
    };

    const sortedJobs = [...jobs].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar - Filters */}
                    <div className="lg:w-80 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 sticky top-32">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5" />
                                Filters
                            </h2>

                            {/* Search Box */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Jobs
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder="Job title, keyword..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                    <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Location Search Box */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Location
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={locationTerm}
                                        onChange={(e) => setLocationTerm(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder="City or region..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                    />
                                    <MapPin className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Job Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((cat) => (
                                        <option key={cat.name} value={cat.name}>
                                            {cat.name} ({cat.count})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Apply & Clear Buttons */}
                            <div className="space-y-2">
                                <button
                                    onClick={handleSearch}
                                    className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition font-medium"
                                >
                                    Apply Filters
                                </button>
                                {(selectedCategory || searchTerm) && (
                                    <button
                                        onClick={clearFilters}
                                        className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                                    >
                                        Clear All
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Job Listings */}
                    <div className="flex-1">
                        {/* Sort & View Options */}
                        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{sortedJobs.length}</span> jobs
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 font-medium">Sort by:</span>
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value as "newest" | "oldest")}
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="oldest">Oldest First</option>
                                </select>
                            </div>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="grid grid-cols-1 gap-4">
                                {Array.from({ length: 6 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-xl shadow-md p-6 animate-pulse"
                                    >
                                        <div className="flex gap-4">
                                            <div className="w-16 h-16 bg-gray-200 rounded"></div>
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Jobs Found */}
                        {!loading && sortedJobs.length === 0 && (
                            <div className="bg-white rounded-xl shadow-md p-12 text-center">
                                <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    No jobs found
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Try adjusting your filters or search criteria
                                </p>
                                {(selectedCategory || searchTerm) && (
                                    <button
                                        onClick={clearFilters}
                                        className="text-cyan-600 hover:text-cyan-700 font-medium"
                                    >
                                        Clear all filters
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Job Cards */}
                        {!loading && sortedJobs.length > 0 && (
                            <div className="grid grid-cols-1 gap-4">
                                {sortedJobs.map((job) => (
                                    <div
                                        key={job._id}
                                        className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                                    >
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            {/* Company Logo */}
                                            <div className="flex-shrink-0">
                                                {buildLogoUrl(job.logo) ? (
                                                    <img
                                                        src={buildLogoUrl(job.logo)}
                                                        alt={job.companyName}
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center rounded-lg">
                                                        <Briefcase className="w-8 h-8 text-cyan-600" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Job Details */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 hover:text-cyan-600 transition">
                                                            <Link to={`/jobs/${job._id}`}>{job.position}</Link>
                                                        </h3>
                                                        <p className="text-gray-600 font-medium">{job.companyName}</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {job.jobLevel && (
                                                            <span className="bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium rounded-full border border-blue-100">
                                                                {job.jobLevel}
                                                            </span>
                                                        )}
                                                        <span className="bg-green-50 text-green-700 px-3 py-1 text-xs font-medium rounded-full border border-green-100">
                                                            {job.jobType}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Job Meta Info */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <span className="truncate">{job.location || "Not specified"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <FaBusinessTime className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <span>{job.experience || "Not specified"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <LiaMoneyCheckSolid className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <span>{job.salary || "Not disclosed"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <span>
                                                            {job.expiryDate
                                                                ? `${Math.ceil(
                                                                    (new Date(job.expiryDate).getTime() - Date.now()) /
                                                                    (1000 * 60 * 60 * 24)
                                                                )} days left`
                                                                : "No expiry"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Job Description Preview */}
                                                {job.description && (
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {job.description}
                                                    </p>
                                                )}

                                                {/* Action Button */}
                                                <div className="flex gap-3">
                                                    <Link
                                                        to={`/jobs/${job._id}`}
                                                        className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition font-medium text-sm"
                                                    >
                                                        View Details
                                                    </Link>
                                                    <Link
                                                        to={`/apply-job/${job._id}`}
                                                        className="bg-white border-2 border-cyan-600 text-cyan-600 px-6 py-2 rounded-lg hover:bg-cyan-50 transition font-medium text-sm"
                                                    >
                                                        Apply Now
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
