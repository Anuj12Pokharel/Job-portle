import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Users, Briefcase, Trash2, Building2, LogOut, Edit, X, Save, Image as ImageIcon, CheckCircle, XCircle, Clock, Eye, LayoutDashboard, PlusCircle, History as HistoryIcon, BookOpen, UserPlus, Mail, FileText, HelpCircle, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import CreateTraining from "./Training/TrainingCreate";
import Createblog from "./Createblog";
import CreateTeam from "./CreateTeam";
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [trainingSubTab, setTrainingSubTab] = useState("list");
    const [blogSubTab, setBlogSubTab] = useState("list");
    const [teamSubTab, setTeamSubTab] = useState("list");
    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [teams, setTeams] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [enrollments, setEnrollments] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [serviceInquiries, setServiceInquiries] = useState([]);
    const [userForms, setUserForms] = useState([]);
    const [clientLogos, setClientLogos] = useState([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const buildImageUrl = (imagePath?: string) => {
        if (!imagePath || String(imagePath) === "undefined" || String(imagePath) === "null") return "";
        const cleaned = String(imagePath).replace(/\\/g, "/");
        if (cleaned.startsWith("http")) return cleaned;
        const uploadsIndex = cleaned.indexOf("uploads/");
        const relativePath = uploadsIndex !== -1 ? cleaned.slice(uploadsIndex) : cleaned.replace(/^\/+/, "");
        return `${API_BASE_URL}/${relativePath}`;
    };

    const formatDate = (dateValue: any, fallbackValue: any = null) => {
        if (!dateValue && !fallbackValue) return "—";
        const date = new Date(dateValue || fallbackValue);
        if (isNaN(date.getTime())) return "—";
        return date.toLocaleDateString();
    };

    // Job Posting State
    const [jobData, setJobData] = useState({
        companyName: "",
        position: "",
        category: "",
        jobType: "Full-time",
        location: "",
        description: "",
        salary: "",
        experience: "",
        educationLevel: "",
        aboutCompany: "",
        companyWebsite: "",
        noOfOpenings: "",
        industry: "",
        skills: "",
        expiryDate: "",
        desiredCandidate: "",
        additionalInformation: "",
        isFeatured: false
    });
    const [companies, setCompanies] = useState<any[]>([]);
    const [showCompanySuggestions, setShowCompanySuggestions] = useState(false);
    const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [historyTotal, setHistoryTotal] = useState(0);
    const [historyFilter, setHistoryFilter] = useState<string>("all");
    const [viewingEmployer, setViewingEmployer] = useState<any>(null);


    // Edit State
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editType, setEditType] = useState<"user" | "employer" | "job" | "training" | "blog" | "team" | null>(null);
    const [editFormData, setEditFormData] = useState<any>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [stats, setStats] = useState({ totalJobs: 0, totalJobseekers: 0, totalEmployers: 0, rejectedApplications: 0 });
    const [successMessage, setSuccessMessage] = useState("");

    // Banner State
    const [bannerData, setBannerData] = useState({
        _id: "",
        type: "job-search",
        title: "",
        subtitle: "",
        isActive: true
    });
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerImgSrc, setBannerImgSrc] = useState("");
    const [bannerCrop, setBannerCrop] = useState<Crop>();
    const [bannerCompletedCrop, setBannerCompletedCrop] = useState<PixelCrop | null>(null);
    const bannerImgRef = useRef<HTMLImageElement>(null);
    const [showCropModal, setShowCropModal] = useState(false);
    // Platform Stats State
    const [platformStats, setPlatformStats] = useState({
        totalCandidates: 0,
        dailyJobs: 0,
        totalCompanies: 0,
        platformYears: 0,
        dailyVisits: 0,
        totalJobs: 0,
        studentsTrained: 0,
        coursesAvailable: 0,
        successRate: 95,
        supportAvailable: "24/7",
        isManual: false
    });


    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/super-admin-login");
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };

            if (activeTab === "dashboard") {
                // Fetch all stats for dashboard
                const [usersRes, employersRes, jobsRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/api/admin/users`, config),
                    axios.get(`${API_BASE_URL}/api/admin/employers`, config),
                    axios.get(`${API_BASE_URL}/api/jobs/get`, config)
                ]);

                // Count rejected applications
                let rejectedCount = 0;
                const applicantPromises = jobsRes.data.map((job: any) =>
                    axios.get(`${API_BASE_URL}/api/jobs/${job._id}/applicants`, config)
                        .catch(() => ({ data: [] }))
                );
                const applicantResults = await Promise.all(applicantPromises);
                applicantResults.forEach((result: any) => {
                    if (result.data) {
                        rejectedCount += result.data.filter((app: any) => app.status === 'rejected').length;
                    }
                });

                setStats({
                    totalJobs: jobsRes.data.length,
                    totalJobseekers: usersRes.data.length,
                    totalEmployers: employersRes.data.filter((e: any) => e.status === 'approved').length,
                    rejectedApplications: rejectedCount
                });
            } else if (activeTab === "post_job") {
                // Fetch all employers for company name autocomplete
                const res = await axios.get(`${API_BASE_URL}/api/admin/employers`, config);
                setCompanies(res.data.filter((e: any) => e.status === 'approved'));
            } else if (activeTab === "users") {
                const res = await axios.get(`${API_BASE_URL}/api/admin/users`, config);
                setUsers(res.data);
            } else if (activeTab === "employers") {
                const res = await axios.get(`${API_BASE_URL}/api/admin/employers`, config);
                setEmployers(res.data);
            } else if (activeTab === "pending") {
                const res = await axios.get(`${API_BASE_URL}/api/admin/employers`, config);
                // Filter only pending and sort by newest first
                const pendingEmployers = res.data
                    .filter((emp: any) => !emp.status || emp.status === 'pending')
                    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setEmployers(pendingEmployers);
            } else if (activeTab === "jobs") {
                const res = await axios.get(`${API_BASE_URL}/api/jobs/get`, config);
                setJobs(res.data);
            } else if (activeTab === "partner_logos") {
                const res = await axios.get(`${API_BASE_URL}/api/client-logos/get`);
                setClientLogos(res.data);
            } else if (activeTab === "trainings") {
                const res = await axios.get(`${API_BASE_URL}/api/training`);
                setTrainings(res.data.data);
            } else if (activeTab === "blogs") {
                const res = await axios.get(`${API_BASE_URL}/api/blogs?limit=100`);
                setBlogs(res.data.blogs);
            } else if (activeTab === "user_forms") {
                const res = await axios.get(`${API_BASE_URL}/api/talent/all`, config);
                setUserForms(res.data);
            } else if (activeTab === "contact_messages") {
                const res = await axios.get(`${API_BASE_URL}/api/contact/get`, config);
                setContacts(res.data);
            } else if (activeTab === "service_inquiries") {
                const res = await axios.get(`${API_BASE_URL}/api/service-inquiry/all`, config);
                setServiceInquiries(res.data);
            } else if (activeTab === "course_enrollments") {
                const res = await axios.get(`${API_BASE_URL}/api/enrollments`, config);
                setEnrollments(res.data);
            }
            else if (activeTab === "teams") {
                const res = await axios.get(`${API_BASE_URL}/api/team/get`);
                setTeams(res.data);
            }
            else if (activeTab === "history") {
                const res = await axios.get(`${API_BASE_URL}/api/history`, config);
                setHistory(res.data.history || []);
                setHistoryTotal(res.data.total || 0);
            }
            else if (activeTab === "banners") {
                try {
                    const res = await axios.get(`${API_BASE_URL}/api/banners/job-search`);
                    if (res.data.success && res.data.data) {
                        setBannerData({
                            _id: res.data.data._id || "",
                            type: res.data.data.type || "job-search",
                            title: res.data.data.title || "",
                            subtitle: res.data.data.subtitle || "",
                            isActive: res.data.data.isActive !== false
                        });
                    } else {
                        setBannerData({
                            _id: "",
                            type: "job-search",
                            title: "",
                            subtitle: "",
                            isActive: true
                        });
                    }
                } catch (err) {
                    console.log("No existing banner or error fetching");
                }
            } else if (activeTab === "platform_stats") {
                try {
                    const res = await axios.get(`${API_BASE_URL}/api/statistics`);
                    if (res.data.success) {
                        setPlatformStats(res.data.data);
                    }
                } catch (err) {
                    console.error("Error fetching platform stats", err);
                }
            }
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: "user" | "employer" | "job" | "training" | "blog" | "team") => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const token = localStorage.getItem("token");
        try {
            let endpoint = "";
            if (type === "user") endpoint = `/api/admin/user/${id}`;
            else if (type === "employer") endpoint = `/api/admin/employer/${id}`;
            else if (type === "job") endpoint = `/api/jobs/delete/${id}`;
            else if (type === "training") endpoint = `/api/training/delete/${id}`;
            else if (type === "blog") endpoint = `/api/blogs/delete/${id}`;
            else if (type === "team") endpoint = `/api/team/delete/${id}`;

            await axios.delete(`${API_BASE_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
            toast.success("Deleted successfully");
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Delete failed");
        }
    };

    const handleVerify = async (id: string, status: "approved" | "rejected") => {
        const token = localStorage.getItem("token");
        try {
            await axios.put(`${API_BASE_URL}/api/admin/verify-employer/${id}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchData();
            toast.success(`Employer ${status} successfully`);
        } catch (err) {
            console.error("Verification failed", err);
            toast.error("Verification failed");
        }
    };

    const downloadUserExcel = () => {
        const dataToExport = users.map((u: any, index: number) => ({
            "S.N": index + 1,
            "Name": u.fullName,
            "Email": u.email,
            "Mobile": u.mobileNumber,
            "Permanent Address": u.permanentAddress || 'N/A',
            "Temporary Address": u.temporaryAddress || 'N/A',
            "Academic (Last Degree)": u.academicDegree || 'N/A',
            "Registration Date": u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
            "Profile Update Date": u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : 'N/A',
        }));

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Jobseekers");
        XLSX.writeFile(workbook, "Jobseekers_List.xlsx");
    };

    const handleEdit = (item: any, type: any) => {
        setEditingItem(item);
        setEditType(type);
        setEditFormData({ ...item });
        setSelectedFile(null); // Reset file
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        try {
            let endpoint = "";
            let payload: any;

            if (editType === 'user') {
                const formData = new FormData();
                formData.append('fullName', editFormData.fullName || '');
                formData.append('email', editFormData.email || '');
                formData.append('mobileNumber', editFormData.mobileNumber || '');
                formData.append('permanentAddress', editFormData.permanentAddress || '');
                formData.append('temporaryAddress', editFormData.temporaryAddress || '');
                formData.append('academicDegree', editFormData.academicDegree || '');
                if (selectedFile) formData.append('profilePicture', selectedFile);
                endpoint = `/api/admin/user/${editingItem._id}`;
                payload = formData;
            } else if (editType === 'employer') {
                const formData = new FormData();
                formData.append('companyName', editFormData.companyName || '');
                formData.append('companyLocation', editFormData.companyLocation || '');
                formData.append('email', editFormData.email || '');
                formData.append('mobileNumber', editFormData.mobileNumber || '');
                if (selectedFile) formData.append('profilePicture', selectedFile);
                endpoint = `/api/admin/employer/${editingItem._id}`;
                payload = formData;
            } else if (editType === 'job') {
                const formData = new FormData();
                formData.append('position', editFormData.position || '');
                formData.append('companyName', editFormData.companyName || '');
                formData.append('location', editFormData.location || '');
                formData.append('salary', editFormData.salary || '');
                formData.append('description', editFormData.description || '');
                formData.append('jobType', editFormData.jobType || '');
                formData.append('noOfOpenings', editFormData.noOfOpenings || '');
                formData.append('industry', editFormData.industry || '');
                formData.append('educationLevel', editFormData.educationLevel || '');
                formData.append('experience', editFormData.experience || '');
                formData.append('expiryDate', editFormData.expiryDate || '');
                formData.append('skills', editFormData.skills || '');
                formData.append('desiredCandidate', editFormData.desiredCandidate || '');
                formData.append('aboutCompany', editFormData.aboutCompany || '');
                formData.append('companyWebsite', editFormData.companyWebsite || '');
                formData.append('additionalInformation', editFormData.additionalInformation || '');
                formData.append('isFeatured', String(editFormData.isFeatured || false));
                if (selectedFile) formData.append('logo', selectedFile);
                endpoint = `/api/jobs/update/${editingItem._id}`;
                payload = formData;
            } else if (editType === 'training') {
                const formData = new FormData();
                formData.append('title', editFormData.title || '');
                formData.append('instructor', editFormData.instructor || '');
                formData.append('price', editFormData.price || '');
                formData.append('description', editFormData.description || '');
                formData.append('duration', editFormData.duration || '');
                formData.append('startDate', editFormData.startDate || '');
                formData.append('students', String(editFormData.students || 0));
                formData.append('shiftTiming', editFormData.shiftTiming || '');

                // Handle shifts: convert to array/string format backend expects
                let shiftsVal = editFormData.shifts;
                if (typeof shiftsVal === 'string') {
                    // It's a comma separated string from the input
                    const shiftsArray = shiftsVal.split(',').map((s: string) => s.trim()).filter((s: string) => s !== "");
                    shiftsArray.forEach(s => formData.append('shifts[]', s));
                } else if (Array.isArray(shiftsVal)) {
                    shiftsVal.forEach(s => formData.append('shifts[]', s));
                }

                if (selectedFile) formData.append('image', selectedFile);
                endpoint = `/api/training/update/${editingItem._id}`;
                payload = formData;
            } else if (editType === 'blog') {
                const formData = new FormData();
                formData.append('title', editFormData.title || '');
                formData.append('author', editFormData.author || '');
                formData.append('body', editFormData.body || '');
                formData.append('date', editFormData.date || '');
                if (selectedFile) formData.append('image', selectedFile);
                endpoint = `/api/blogs/update/${editingItem._id}`;
                payload = formData;
            } else if (editType === 'team') {
                const formData = new FormData();
                formData.append('name', editFormData.name || '');
                formData.append('designation', editFormData.designation || '');
                formData.append('bio', editFormData.bio || '');
                if (selectedFile) formData.append('image', selectedFile);
                endpoint = `/api/team/update/${editingItem._id}`;
                payload = formData;
            }

            // Perform the API call using the determined endpoint and payload
            await axios.put(`${API_BASE_URL}${endpoint}`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Axios automatically sets content-type for FormData, 
                    // but for JSON it uses application/json
                }
            });

            setSuccessMessage("Updated Successfully");
            setTimeout(() => {
                setSuccessMessage("");
                setEditingItem(null);
                setEditType(null);
            }, 1000);
            fetchData();
        } catch (err) {
            console.error("Update failed", err);
            toast.error("Update failed");
        }
    };
    const handleUploadLogo = async () => {
        if (!logoFile) return toast.warning("Please select a file");
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("logo", logoFile);

        try {
            await axios.post(`${API_BASE_URL}/api/client-logos/add`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Logo uploaded successfully");
            setLogoFile(null);
            fetchData();
        } catch (err) {
            console.error("Upload failed", err);
            toast.error("Upload failed");
        }
    };

    const handleDeleteLogo = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API_BASE_URL}/api/client-logos/delete/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error("Delete failed", err);
            toast.error("Delete failed");
        }
    };

    const handlePostJob = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        Object.entries(jobData).forEach(([key, value]) => {
            if (key === 'isFeatured') {
                formData.append(key, String(value));
            } else {
                formData.append(key, value as string);
            }
        });

        try {
            await axios.post(`${API_BASE_URL}/api/jobs/create`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                },
            });
            alert("Job Posted Successfully!");
            setActiveTab("jobs");
            fetchData();
            setJobData({
                companyName: "", position: "", category: "", jobType: "Full-time",
                location: "", description: "", salary: "", experience: "",
                educationLevel: "", aboutCompany: "", companyWebsite: "",
                noOfOpenings: "", industry: "", skills: "",
                expiryDate: "", desiredCandidate: "", additionalInformation: "", isFeatured: false,
            });
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || "Failed to post job";
            toast.error(msg);
        }
    };

    const handleBannerUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("type", "job-search");
        formData.append("title", bannerData.title);
        formData.append("subtitle", bannerData.subtitle);
        formData.append("isActive", String(bannerData.isActive));
        if (bannerFile) formData.append("backgroundImage", bannerFile);

        try {
            await axios.post(`${API_BASE_URL}/api/banners`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            toast.success("Banner updated successfully");
            setBannerFile(null);
            fetchData(); // Refresh to see changes if needed
        } catch (err) {
            console.error("Banner update failed", err);
            toast.error("Banner update failed");
        }
    };

    const handleRemoveBanner = async () => {
        if (!bannerData._id) return;
        if (!window.confirm("Are you sure you want to remove the banner and return to default?")) return;
        
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`${API_BASE_URL}/api/banners/${bannerData._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Banner removed successfully");
            setBannerData({
                _id: "",
                type: "job-search",
                title: "",
                subtitle: "",
                isActive: true
            });
            setBannerFile(null);
            fetchData();
        } catch (err) {
            console.error("Failed to remove banner", err);
            toast.error("Failed to remove banner");
        }
    };

    const onSelectBannerFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setBannerCrop(undefined);
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setBannerImgSrc(reader.result?.toString() || '');
                setShowCropModal(true);
            });
            reader.readAsDataURL(e.target.files[0]);
            // Clear input so selecting same file again triggers change event
            e.target.value = '';
        }
    };

    const getCroppedBannerImg = async () => {
        if (!bannerCompletedCrop || !bannerImgRef.current) return;
        
        const image = bannerImgRef.current;
        const canvas = document.createElement('canvas');
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        
        // Setup canvas
        canvas.width = bannerCompletedCrop.width;
        canvas.height = bannerCompletedCrop.height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;
        
        ctx.drawImage(
            image,
            bannerCompletedCrop.x * scaleX,
            bannerCompletedCrop.y * scaleY,
            bannerCompletedCrop.width * scaleX,
            bannerCompletedCrop.height * scaleY,
            0,
            0,
            bannerCompletedCrop.width,
            bannerCompletedCrop.height
        );
        
        canvas.toBlob((blob) => {
            if (!blob) return;
            const newFile = new File([blob], 'cropped_banner.jpg', { type: 'image/jpeg' });
            setBannerFile(newFile);
            setShowCropModal(false);
            setBannerImgSrc('');
        }, 'image/jpeg', 0.95);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("storage"));
        navigate("/");
    };

    const renderEditModal = () => {
        if (!editingItem) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Edit {editType === 'user' ? 'Jobseeker' : editType === 'employer' ? 'Company' : editType === 'job' ? 'Job' : editType === 'training' ? 'Training' : editType === 'blog' ? 'Blog' : 'Team Member'}</h3>
                        <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-4">
                        {successMessage && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                                <strong className="font-bold">Success! </strong>
                                <span className="block sm:inline">{successMessage}</span>
                            </div>
                        )}
                        {editType === "training" && (
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="w-full h-32 rounded-lg bg-gray-200 overflow-hidden relative border">
                                        {selectedFile ? (
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editFormData.image ? (
                                            <img src={`${API_BASE_URL}${editFormData.image}`} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon /></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Training Image</label>
                                    <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input type="text" placeholder="Title" value={editFormData.title || ''} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructor</label>
                                    <input type="text" placeholder="Instructor" value={editFormData.instructor || ''} onChange={(e) => setEditFormData({ ...editFormData, instructor: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                                    <input type="text" placeholder="Price" value={editFormData.price || ''} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <input type="text" placeholder="Duration (e.g. 6 Weeks)" value={editFormData.duration || ''} onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                                    <input type="date" value={editFormData.startDate ? editFormData.startDate.split('T')[0] : ''} onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shifts</label>
                                    <div className="flex gap-4 p-2 border rounded bg-white mt-1">
                                        {["Morning", "Day", "Evening"].map((shiftOption) => {
                                            const shiftsArray = Array.isArray(editFormData.shifts)
                                                ? editFormData.shifts
                                                : (typeof editFormData.shifts === 'string' && editFormData.shifts.length > 0)
                                                    ? editFormData.shifts.split(',').map((s: string) => s.trim())
                                                    : [];

                                            const isChecked = shiftsArray.includes(shiftOption);

                                            return (
                                                <label key={shiftOption} className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            const newShifts = e.target.checked
                                                                ? [...shiftsArray, shiftOption]
                                                                : shiftsArray.filter((s: string) => s !== shiftOption);
                                                            setEditFormData({ ...editFormData, shifts: newShifts });
                                                        }}
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">{shiftOption}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Shift Timing</label>
                                    <input type="text" placeholder="e.g. 7:00 AM - 9:00 AM" value={editFormData.shiftTiming || ''} onChange={(e) => setEditFormData({ ...editFormData, shiftTiming: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Candidates</label>
                                    <input type="number" placeholder="e.g. 200" min="0" value={editFormData.students || 0} onChange={(e) => setEditFormData({ ...editFormData, students: Number(e.target.value) })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea placeholder="Description" value={editFormData.description || ''} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className="w-full border rounded px-3 py-2 h-24" />
                                </div>
                            </>
                        )}
                        {editType === "blog" && (
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden relative border">
                                        {selectedFile ? (
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editFormData.image ? (
                                            <img src={buildImageUrl(editFormData.image)} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon /></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Cover Image</label>
                                    <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input type="text" placeholder="Title" value={editFormData.title || ''} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                    <input type="text" placeholder="Author" value={editFormData.author || ''} onChange={(e) => setEditFormData({ ...editFormData, author: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
                                    <input type="date" value={editFormData.date ? editFormData.date.split('T')[0] : ''} onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                                    <textarea placeholder="Content" value={editFormData.body || ''} onChange={(e) => setEditFormData({ ...editFormData, body: e.target.value })} className="w-full border rounded px-3 py-2 h-40" />
                                </div>
                            </>
                        )}
                        {editType === "team" && (
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative border">
                                        {selectedFile ? (
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editFormData.image ? (
                                            <img src={`${API_BASE_URL}/${editFormData.image}`} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon /></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Member Photo</label>
                                    <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input type="text" placeholder="Name" value={editFormData.name || ''} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                    <input type="text" placeholder="Designation" value={editFormData.designation || ''} onChange={(e) => setEditFormData({ ...editFormData, designation: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea placeholder="Bio" value={editFormData.bio || ''} onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })} className="w-full border rounded px-3 py-2 h-40" />
                                </div>
                            </>
                        )}

                        {editType === "user" && (
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative">
                                        {selectedFile ? (
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editFormData.profilePicture ? (
                                            <img src={`${API_BASE_URL}/${editFormData.profilePicture}`} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400"><Users /></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                                    <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input type="text" value={editFormData.fullName || ''} onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={editFormData.email || ''} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <input type="text" value={editFormData.mobileNumber || ''} onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 15) })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
                                    <input type="text" value={editFormData.permanentAddress || ''} onChange={(e) => setEditFormData({ ...editFormData, permanentAddress: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Temporary Address</label>
                                    <input type="text" value={editFormData.temporaryAddress || ''} onChange={(e) => setEditFormData({ ...editFormData, temporaryAddress: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Academic (Last Degree)</label>
                                    <input type="text" value={editFormData.academicDegree || ''} onChange={(e) => setEditFormData({ ...editFormData, academicDegree: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="e.g., Bachelor's in Computer Science" />
                                </div>
                            </>
                        )}
                        {editType === "employer" && (
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden relative border">
                                        {selectedFile ? (
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editFormData.profilePicture ? (
                                            <img src={`${API_BASE_URL}/${editFormData.profilePicture}`} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400"><Building2 /></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Logo</label>
                                    <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                    <input type="text" value={editFormData.companyName || ''} onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Location</label>
                                    <input type="text" value={editFormData.companyLocation || ''} onChange={(e) => setEditFormData({ ...editFormData, companyLocation: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={editFormData.email || ''} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Mobile</label>
                                    <input type="text" value={editFormData.mobileNumber || ''} onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value.replace(/\D/g, '').slice(0, 15) })} className="w-full border rounded px-3 py-2" />
                                </div>
                            </>
                        )}
                        {editType === "job" && (
                            <>
                                <div className="flex items-center gap-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6 transition-all hover:shadow-sm">
                                    <input
                                        type="checkbox"
                                        id="editIsFeatured"
                                        checked={editFormData.isFeatured || false}
                                        onChange={(e) => setEditFormData({ ...editFormData, isFeatured: e.target.checked })}
                                        className="w-6 h-6 text-yellow-600 rounded-lg border-yellow-300 focus:ring-yellow-500 cursor-pointer"
                                    />
                                    <label htmlFor="editIsFeatured" className="text-sm font-bold text-yellow-800 cursor-pointer select-none">🔥 Mark as Featured Job</label>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <input type="text" value={editFormData.position || ''} onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name (Display)</label>
                                        <input type="text" value={editFormData.companyName || ''} onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })} className="w-full border rounded px-3 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                                        <input type="text" value={editFormData.companyWebsite || ''} onChange={(e) => setEditFormData({ ...editFormData, companyWebsite: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="https://example.com" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input type="text" value={editFormData.category || ''} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="e.g. Software Development" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" value={editFormData.location || ''} onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })} className="w-full border rounded px-3 py-2" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                                        <input type="text" value={editFormData.salary || ''} onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })} className="w-full border rounded px-3 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                        <input type="text" value={editFormData.jobType || ''} onChange={(e) => setEditFormData({ ...editFormData, jobType: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="e.g. Full-time, Remote" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. of Openings</label>
                                        <input type="number" value={editFormData.noOfOpenings || ''} onChange={(e) => setEditFormData({ ...editFormData, noOfOpenings: e.target.value })} className="w-full border rounded px-3 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Required)</label>
                                        <input type="text" value={editFormData.experience || ''} onChange={(e) => setEditFormData({ ...editFormData, experience: e.target.value })} className="w-full border rounded px-3 py-2" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                        <input type="text" value={editFormData.industry || ''} onChange={(e) => setEditFormData({ ...editFormData, industry: e.target.value })} className="w-full border rounded px-3 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input type="date" value={editFormData.expiryDate ? new Date(editFormData.expiryDate).toISOString().split('T')[0] : ""} onChange={(e) => setEditFormData({ ...editFormData, expiryDate: e.target.value })} className="w-full border rounded px-3 py-2" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                    <textarea
                                        rows={4}
                                        value={editFormData.description || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        placeholder="Enter the job responsibilities and requirements..."
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = `${target.scrollHeight}px`;
                                        }}
                                    ></textarea>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">About Company</label>
                                    <textarea
                                        rows={2}
                                        value={editFormData.aboutCompany || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, aboutCompany: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                        placeholder="Write something about your company..."
                                        onInput={(e) => {
                                            const target = e.target as HTMLTextAreaElement;
                                            target.style.height = "auto";
                                            target.style.height = `${target.scrollHeight}px`;
                                        }}
                                    ></textarea>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                    <input type="text" value={editFormData.skills || ''} onChange={(e) => setEditFormData({ ...editFormData, skills: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="e.g. React, Node.js" />
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired Candidate</label>
                                    <textarea
                                        rows={3}
                                        value={editFormData.desiredCandidate || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, desiredCandidate: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="Describe the ideal candidate profile..."
                                    ></textarea>
                                </div>
                                <div className="mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                                    <textarea
                                        rows={4}
                                        value={editFormData.additionalInformation || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, additionalInformation: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="Any extra notes or details..."
                                    ></textarea>
                                </div>
                            </>
                        )}

                        <div className="flex justify-end gap-3 pt-4">
                            <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                                <Save className="w-4 h-4 mr-2" /> Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderDetailModal = () => {
        if (!viewingEmployer) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl overflow-y-auto max-h-[90vh]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">Employer Details</h3>
                        <button onClick={() => setViewingEmployer(null)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Profile Picture */}
                        <div className="flex justify-center">
                            <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden border-4 border-blue-100">
                                {viewingEmployer.profilePicture ? (
                                    <img src={`${API_BASE_URL}/${viewingEmployer.profilePicture}`} alt="Company Logo" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400"><Building2 size={64} /></div>
                                )}
                            </div>
                        </div>

                        {/* Company Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Company Name</label>
                                <p className="text-gray-800 font-medium">{viewingEmployer.companyName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Company Location</label>
                                <p className="text-gray-800 font-medium">{viewingEmployer.companyLocation}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Email</label>
                                <p className="text-gray-800 font-medium">{viewingEmployer.email}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Mobile Number</label>
                                <p className="text-gray-800 font-medium">{viewingEmployer.mobileNumber}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold 
                                    ${viewingEmployer.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        viewingEmployer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {viewingEmployer.status || 'pending'}
                                </span>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Registration Date</label>
                                <p className="text-gray-800 font-medium">
                                    {viewingEmployer.createdAt ? new Date(viewingEmployer.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    }) : 'N/A'}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {(!viewingEmployer.status || viewingEmployer.status === 'pending') && (
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={() => {
                                        handleVerify(viewingEmployer._id, "rejected");
                                        setViewingEmployer(null);
                                    }}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2 transition-colors"
                                >
                                    <XCircle className="w-5 h-5" /> Reject
                                </button>
                                <button
                                    onClick={() => {
                                        handleVerify(viewingEmployer._id, "approved");
                                        setViewingEmployer(null);
                                    }}
                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition-colors"
                                >
                                    <CheckCircle className="w-5 h-5" /> Confirm
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-cyan-600 text-white flex flex-col h-full">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                        Super Admin
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Management Console</p>
                </div>
                <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                    <button onClick={() => setActiveTab("dashboard")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
                    </button>
                    <button onClick={() => setActiveTab("users")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <Users className="w-5 h-5 mr-3" /> Jobseekers
                    </button>
                    <button onClick={() => setActiveTab("pending")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <Clock className="w-5 h-5 mr-3" /> Pending Requests
                    </button>
                    <button onClick={() => setActiveTab("post_job")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'post_job' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <PlusCircle className="w-5 h-5 mr-3" /> Post Job
                    </button>
                    <button onClick={() => setActiveTab("employers")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'employers' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <Building2 className="w-5 h-5 mr-3" /> Employers
                    </button>
                    <button onClick={() => setActiveTab("jobs")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <Briefcase className="w-5 h-5 mr-3" /> All Jobs
                    </button>
                    <button onClick={() => setActiveTab("trainings")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'trainings' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>

                        < BookOpen className="w-5 h-5 mr-3" /> Trainings
                    </button>
                    <button onClick={() => setActiveTab("blogs")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'blogs' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        < BookOpen className="w-5 h-5 mr-3" /> Blogs
                    </button>
                    <button onClick={() => setActiveTab("teams")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'teams' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <Users className="w-5 h-5 mr-3" /> Teams
                    </button>

                    <button onClick={() => setActiveTab("partner_logos")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'partner_logos' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <ImageIcon className="w-5 h-5 mr-3" /> Partner Logos
                    </button>
                    <button onClick={() => setActiveTab("banners")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'banners' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <ImageIcon className="w-5 h-5 mr-3" /> Banners
                    </button>
                    <button onClick={() => setActiveTab("user_forms")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'user_forms' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <FileText className="w-5 h-5 mr-3" /> New Opportunities
                    </button>
                    <button onClick={() => setActiveTab("contact_messages")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'contact_messages' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <Mail className="w-5 h-5 mr-3" /> Contact Messages
                    </button>
                    <button onClick={() => setActiveTab("service_inquiries")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'service_inquiries' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <HelpCircle className="w-5 h-5 mr-3" /> Service Inquiries
                    </button>
                    <button onClick={() => setActiveTab("course_enrollments")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'course_enrollments' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <GraduationCap className="w-5 h-5 mr-3" /> Course Enrollments
                    </button>
                    <button onClick={() => setActiveTab("history")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'history' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <HistoryIcon className="w-5 h-5 mr-3" /> History
                    </button>
                    <button onClick={() => setActiveTab("platform_stats")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'platform_stats' ? 'bg-cyan-800' : 'hover:bg-slate-900'}`}>
                        <Users className="w-5 h-5 mr-3" /> Platform Stats
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <header className="p-8 pb-4 bg-gray-100 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">
                        {activeTab === 'dashboard' ? 'Dashboard Overview' : `Manage ${activeTab === 'users' ? 'Jobseekers' : activeTab}`}
                    </h2>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {successMessage && (
                        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
                            {successMessage}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>
                    ) : activeTab === "dashboard" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Jobs Posted</h3>
                                    <Briefcase className="text-teal-500 w-6 h-6" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalJobs}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Jobseekers</h3>
                                    <Users className="text-blue-500 w-6 h-6" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalJobseekers}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Total Employers</h3>
                                    <Building2 className="text-purple-500 w-6 h-6" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{stats.totalEmployers}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-gray-500 text-sm font-medium">Rejected Applications</h3>
                                    <XCircle className="text-red-500 w-6 h-6" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">{stats.rejectedApplications}</p>
                            </div>
                        </div>
                    ) : activeTab === "post_job" ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Post New Job</h3>
                            <form onSubmit={handlePostJob} className="space-y-6">
                                <div className="flex items-center gap-2 bg-yellow-50 p-4 rounded-xl border border-yellow-100 mb-6 transition-all hover:shadow-sm">
                                    <input
                                        type="checkbox"
                                        id="postIsFeatured"
                                        checked={jobData.isFeatured || false}
                                        onChange={(e) => setJobData({ ...jobData, isFeatured: e.target.checked })}
                                        className="w-6 h-6 text-yellow-600 rounded-lg border-yellow-300 focus:ring-yellow-500 cursor-pointer"
                                    />
                                    <label htmlFor="postIsFeatured" className="text-sm font-bold text-yellow-800 cursor-pointer select-none">🔥 Mark as Featured Job</label>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            value={jobData.companyName}
                                            onChange={e => {
                                                const value = e.target.value;
                                                setJobData({ ...jobData, companyName: value });
                                                if (value.length > 0) {
                                                    const filtered = companies.filter(c =>
                                                        c.companyName.toLowerCase().includes(value.toLowerCase())
                                                    );
                                                    setFilteredCompanies(filtered);
                                                    setShowCompanySuggestions(true);
                                                } else {
                                                    setShowCompanySuggestions(false);
                                                }
                                            }}
                                            onFocus={() => {
                                                if (jobData.companyName.length > 0) {
                                                    setShowCompanySuggestions(true);
                                                }
                                            }}
                                            onBlur={() => {
                                                // Delay to allow click on suggestion
                                                setTimeout(() => setShowCompanySuggestions(false), 200);
                                            }}
                                            className="w-full border rounded-lg px-4 py-2"
                                            required
                                        />
                                        {showCompanySuggestions && filteredCompanies.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {filteredCompanies.map((company) => (
                                                    <div
                                                        key={company._id}
                                                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                                                        onMouseDown={() => {
                                                            setJobData({
                                                                ...jobData,
                                                                companyName: company.companyName,
                                                                location: company.companyLocation || jobData.location,
                                                                aboutCompany: company.aboutCompany || jobData.aboutCompany,
                                                                companyWebsite: company.companyWebsite || jobData.companyWebsite
                                                            });
                                                            setShowCompanySuggestions(false);
                                                        }}
                                                    >
                                                        <div className="font-medium text-gray-800">{company.companyName}</div>
                                                        {company.companyLocation && (
                                                            <div className="text-sm text-gray-500">{company.companyLocation}</div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Position / Job Title</label>
                                        <input type="text" value={jobData.position} onChange={e => setJobData({ ...jobData, position: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                        <input type="text" value={jobData.location} onChange={e => setJobData({ ...jobData, location: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                                        <input
                                            type="text"
                                            value={jobData.jobType}
                                            onChange={e => setJobData({ ...jobData, jobType: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            placeholder="e.g. Full-time, Remote, Hybrid"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            value={jobData.category}
                                            onChange={e => setJobData({ ...jobData, category: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2"
                                            placeholder="e.g. Software Development"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                                        <input type="text" value={jobData.salary} onChange={e => setJobData({ ...jobData, salary: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">No. of Openings</label>
                                        <input type="number" value={jobData.noOfOpenings} onChange={e => setJobData({ ...jobData, noOfOpenings: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                                        <input type="text" value={jobData.industry} onChange={e => setJobData({ ...jobData, industry: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                                        <input type="text" value={jobData.educationLevel} onChange={e => setJobData({ ...jobData, educationLevel: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Required)</label>
                                        <input type="text" value={jobData.experience} onChange={e => setJobData({ ...jobData, experience: e.target.value })} className="w-full border rounded-lg px-4 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                        <input type="date" value={jobData.expiryDate} onChange={e => setJobData({ ...jobData, expiryDate: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                                        <input type="text" value={jobData.skills} onChange={e => setJobData({ ...jobData, skills: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Website</label>
                                        <input type="text" value={jobData.companyWebsite} onChange={e => setJobData({ ...jobData, companyWebsite: e.target.value })} className="w-full border rounded-lg px-4 py-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">About Company</label>
                                        <textarea
                                            rows={2}
                                            value={jobData.aboutCompany}
                                            onChange={e => setJobData({ ...jobData, aboutCompany: e.target.value })}
                                            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                            placeholder="Write something about your company..."
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = "auto";
                                                target.style.height = `${target.scrollHeight}px`;
                                            }}
                                        ></textarea>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Desired Candidate</label>
                                    <textarea rows={3} value={jobData.desiredCandidate} onChange={e => setJobData({ ...jobData, desiredCandidate: e.target.value })} className="w-full border rounded-lg px-4 py-2"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
                                    <textarea rows={5} value={jobData.description} onChange={e => setJobData({ ...jobData, description: e.target.value })} className="w-full border rounded-lg px-4 py-2"></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <textarea
                                        rows={4}
                                        value={jobData.additionalInformation}
                                        onChange={e => setJobData({ ...jobData, additionalInformation: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="Any extra notes, instructions, or details about this job..."
                                    ></textarea>
                                </div>

                                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                                    Post Job
                                </button>
                            </form>
                        </div>
                    ) : activeTab === "trainings" ? (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Manage Trainings</h3>
                                    <button
                                        onClick={() => setTrainingSubTab(trainingSubTab === "list" ? "create" : "list")}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                                    >
                                        {trainingSubTab === "list" ? <><PlusCircle className="w-5 h-5 mr-2" /> Add Training</> : <><LayoutDashboard className="w-5 h-5 mr-2" /> Training List</>}
                                    </button>
                                </div>

                                {trainingSubTab === "create" ? (
                                    <CreateTraining />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Image</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Instructor</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Price</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {trainings.map((t: any) => (
                                                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="w-16 h-10 rounded bg-gray-200 overflow-hidden">
                                                                {t.image ? <img src={`${API_BASE_URL}${t.image}`} alt="" className="w-full h-full object-cover" /> : <BookOpen className="p-2 w-full h-full text-gray-400" />}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">{t.title}</td>
                                                        <td className="px-6 py-4">{t.instructor}</td>
                                                        <td className="px-6 py-4">{t.price}</td>
                                                        <td className="px-6 py-4 flex gap-2">
                                                            <button onClick={() => handleEdit(t, "training")} className="text-blue-500 hover:text-blue-700" title="Edit">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleDelete(t._id, "training")} className="text-red-500 hover:text-red-700" title="Delete">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {trainings.length === 0 && (
                                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No trainings found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === "blogs" ? (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Manage Blogs</h3>
                                    <button
                                        onClick={() => setBlogSubTab(blogSubTab === "list" ? "create" : "list")}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                                    >
                                        {blogSubTab === "list" ? <><PlusCircle className="w-5 h-5 mr-2" /> Add Blog</> : <><LayoutDashboard className="w-5 h-5 mr-2" /> Blog List</>}
                                    </button>
                                </div>

                                {blogSubTab === "create" ? (
                                    <Createblog />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Image</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Author</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {blogs.map((b: any) => (
                                                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                                                         <td className="px-6 py-4">
                                                            <div className="w-16 h-10 rounded bg-gray-200 overflow-hidden">
                                                                {b.image ? <img src={buildImageUrl(b.image)} alt="" className="w-full h-full object-cover" /> : <BookOpen className="p-2 w-full h-full text-gray-400" />}
                                                            </div>
                                                        </td>
                                                         <td className="px-6 py-4 font-medium">{b.title}</td>
                                                        <td className="px-6 py-4">{b.author}</td>
                                                        <td className="px-6 py-4">
                                                            {formatDate(b.date, b.createdAt)}
                                                        </td>
                                                        <td className="px-6 py-4 flex gap-2">
                                                            <button onClick={() => handleEdit(b, "blog")} className="text-blue-500 hover:text-blue-700" title="Edit">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleDelete(b._id, "blog")} className="text-red-500 hover:text-red-700" title="Delete">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {blogs.length === 0 && (
                                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No blogs found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : activeTab === "teams" ? (
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-800">Manage Team</h3>
                                    <button
                                        onClick={() => setTeamSubTab(teamSubTab === "list" ? "create" : "list")}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                                    >
                                        {teamSubTab === "list" ? <><PlusCircle className="w-5 h-5 mr-2" /> Add Team Member</> : <><LayoutDashboard className="w-5 h-5 mr-2" /> Team List</>}
                                    </button>
                                </div>

                                {teamSubTab === "create" ? (
                                    <CreateTeam />
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Photo</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Designation</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Bio</th>
                                                    <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {teams.map((t: any) => (
                                                    <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
                                                                {t.image ? <img src={`${API_BASE_URL}/${t.image}`} alt="" className="w-full h-full object-cover" /> : <Users className="p-2 w-full h-full text-gray-400" />}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">{t.name}</td>
                                                        <td className="px-6 py-4">{t.designation}</td>
                                                        <td className="px-6 py-4 text-sm max-w-xs truncate">{t.bio}</td>
                                                        <td className="px-6 py-4 flex gap-2">
                                                            <button onClick={() => handleEdit(t, "team")} className="text-blue-500 hover:text-blue-700" title="Edit">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleDelete(t._id, "team")} className="text-red-500 hover:text-red-700" title="Delete">
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {teams.length === 0 && (
                                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No team members found</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) :
                        (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                {activeTab === "users" && (
                                    <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                        <h3 className="font-bold text-gray-700">List of Jobseekers</h3>
                                        <button
                                            onClick={downloadUserExcel}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm text-sm font-semibold"
                                        >
                                            <Save className="w-4 h-4" /> Download Excel
                                        </button>
                                    </div>
                                )}
                                {activeTab === "user_forms" && (
                                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-700">New Opportunity Form Submissions (Home Page)</h3>
                                        <button
                                            onClick={() => {
                                                const data = userForms.map((f: any) => ({
                                                    "Full Name": f.fullName || "",
                                                    "Designation": f.designation || "",
                                                    "Email": f.email || "",
                                                    "Contact Number": f.phone || "",
                                                    "Field of Expertise": f.expertise || "",
                                                    "Employment Status": f.employmentStatus || "",
                                                    "CV": f.cv ? "Yes" : "No",
                                                    "Submitted Date": f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "",
                                                }));
                                                const ws = XLSX.utils.json_to_sheet(data);
                                                const wb = XLSX.utils.book_new();
                                                XLSX.utils.book_append_sheet(wb, ws, "Submissions");
                                                XLSX.writeFile(wb, `New_Opportunity_Submissions_${new Date().toISOString().slice(0, 10)}.xlsx`);
                                            }}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                                        >
                                            <FileText className="w-4 h-4" /> Export to Excel
                                        </button>
                                    </div>
                                )}
                                {activeTab === "contact_messages" && (
                                    <div className="p-4 border-b bg-gray-50">
                                        <h3 className="font-bold text-gray-700">Contact Us Messages</h3>
                                    </div>
                                )}
                                {activeTab === "service_inquiries" && (
                                    <div className="p-4 border-b bg-gray-50">
                                        <h3 className="font-bold text-gray-700">Service Inquiries</h3>
                                    </div>
                                )}
                                {activeTab === "course_enrollments" && (
                                    <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-700">Course Enrollment Requests</h3>
                                        <button
                                            onClick={() => {
                                                const data = enrollments.map((e: any) => ({
                                                    "Name": e.name || "",
                                                    "Course": e.course || "",
                                                    "Shift": e.shift || "",
                                                    "Email": e.email || "",
                                                    "Phone": e.phone || "",
                                                    "Status": e.status || "",
                                                    "Date": e.createdAt ? new Date(e.createdAt).toLocaleDateString() : "",
                                                }));
                                                const ws = XLSX.utils.json_to_sheet(data);
                                                const wb = XLSX.utils.book_new();
                                                XLSX.utils.book_append_sheet(wb, ws, "Enrollments");
                                                XLSX.writeFile(wb, `Course_Enrollments_${new Date().toISOString().slice(0, 10)}.xlsx`);
                                            }}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                                        >
                                            <FileText className="w-4 h-4" /> Export to Excel
                                        </button>
                                    </div>
                                )}
                                <div className="overflow-auto max-h-[calc(100vh-280px)]">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                            <tr>
                                                {activeTab === "users" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">S.N</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Picture</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Permanent Address</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Temporary Address</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Academic (Last Degree)</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Registration Date</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Profile Update Date</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Contact Number</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                    </>
                                                )}
                                                {activeTab === "employers" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Logo</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Company</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Mobile</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                    </>
                                                )}
                                                {activeTab === "pending" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Logo</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Company</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Registration Date</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                    </>
                                                )}
                                                {activeTab === "jobs" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Logo</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Title</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Company</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                    </>
                                                )}
                                                {activeTab === "user_forms" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Full Name</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Current/Last Designation</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Professional Email</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Contact Number</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Field of Expertise</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Employment Status</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">CV</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Submitted Date</th>
                                                    </>
                                                )}
                                                {activeTab === "contact_messages" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Email</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Phone</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Message</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                                    </>
                                                )}
                                                {activeTab === "service_inquiries" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Name/Company</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Service</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Company Size</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                                    </>
                                                )}
                                                {activeTab === "course_enrollments" && (
                                                    <>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Name</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Course</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Shift</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Contact</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Date</th>
                                                        <th className="px-6 py-4 font-semibold text-gray-600">Action</th>
                                                    </>
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {activeTab === "users" && users.map((u: any, index: number) => (
                                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                                                    <td className="px-6 py-4" onClick={() => handleEdit(u, "user")}>
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                            {u.profilePicture ? <img src={`${API_BASE_URL}/${u.profilePicture}`} alt="" className="w-full h-full object-cover" /> : <Users className="p-2 w-full h-full text-gray-400" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium" onClick={() => handleEdit(u, "user")}>{u.fullName}</td>
                                                    <td className="px-6 py-4 text-sm">{u.permanentAddress || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">{u.temporaryAddress || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">{u.academicDegree || 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">{u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : 'N/A'}</td>
                                                    <td className="px-6 py-4 text-sm">{u.mobileNumber || 'N/A'}</td>
                                                    <td className="px-6 py-4 flex gap-2">
                                                        <button onClick={() => handleEdit(u, "user")} className="text-blue-500 hover:text-blue-700" title="Edit">
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(u._id, "user")} className="text-red-500 hover:text-red-700" title="Delete">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeTab === "employers" && employers.map((u: any) => (
                                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4" onClick={() => handleEdit(u, "employer")}>
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                            {u.profilePicture ? <img src={`${API_BASE_URL}/${u.profilePicture}`} alt="" className="w-full h-full object-cover" /> : <Building2 className="p-2 w-full h-full text-gray-400" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium" onClick={() => handleEdit(u, "employer")}>{u.companyName}</td>
                                                    <td className="px-6 py-4">{u.email}</td>
                                                    <td className="px-6 py-4">{u.mobileNumber}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                    ${u.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                                u.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                            {u.status || 'pending'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 flex gap-2">
                                                        {(!u.status || u.status === 'pending') && (
                                                            <>
                                                                <button onClick={() => handleVerify(u._id, "approved")} className="text-green-500 hover:text-green-700" title="Approve">
                                                                    <CheckCircle className="w-5 h-5" />
                                                                </button>
                                                                <button onClick={() => handleVerify(u._id, "rejected")} className="text-red-500 hover:text-red-700" title="Reject">
                                                                    <XCircle className="w-5 h-5" />
                                                                </button>
                                                            </>
                                                        )}
                                                        <button onClick={() => handleEdit(u, "employer")} className="text-blue-500 hover:text-blue-700" title="Edit">
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(u._id, "employer")} className="text-red-500 hover:text-red-700" title="Delete">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeTab === "pending" && employers.map((u: any) => (
                                                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                                                            {u.profilePicture ? <img src={`${API_BASE_URL}/${u.profilePicture}`} alt="" className="w-full h-full object-cover" /> : <Building2 className="p-2 w-full h-full text-gray-400" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium">{u.companyName}</td>
                                                    <td className="px-6 py-4">{u.email}</td>
                                                    <td className="px-6 py-4">
                                                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }) : 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setViewingEmployer(u)}
                                                                className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 flex items-center gap-1 transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye className="w-4 h-4" /> Details
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerify(u._id, "approved")}
                                                                className="px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 flex items-center gap-1 transition-colors"
                                                                title="Confirm"
                                                            >
                                                                <CheckCircle className="w-4 h-4" /> Confirm
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerify(u._id, "rejected")}
                                                                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 flex items-center gap-1 transition-colors"
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-4 h-4" /> Reject
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeTab === "jobs" && jobs.map((j: any) => (
                                                <tr key={j._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4" onClick={() => handleEdit(j, "job")}>
                                                        <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                                                            {j.logo ? <img src={buildImageUrl(j.logo)} alt="" className="w-full h-full object-cover" /> : <Briefcase className="p-2 w-full h-full text-gray-400" />}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium" onClick={() => handleEdit(j, "job")}>{j.position}</td>
                                                    <td className="px-6 py-4">{j.companyName}</td>
                                                    <td className="px-6 py-4 flex gap-2">
                                                        <button onClick={() => handleEdit(j, "job")} className="text-blue-500 hover:text-blue-700" title="Edit">
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(j._id, "job")} className="text-red-500 hover:text-red-700" title="Delete">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeTab === "user_forms" && userForms.map((f: any) => (
                                                <tr key={f._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{f.fullName}</td>
                                                    <td className="px-6 py-4">{f.designation}</td>
                                                    <td className="px-6 py-4">{f.email}</td>
                                                    <td className="px-6 py-4">{f.phone}</td>
                                                    <td className="px-6 py-4">{f.expertise}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${f.employmentStatus === 'Still Working'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-orange-100 text-orange-700'
                                                            }`}>{f.employmentStatus || '—'}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {f.cv && (
                                                                <a href={`${API_BASE_URL}/${f.cv.replace(/\\/g, '/')}`} download className="flex items-center gap-1 bg-cyan-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-cyan-700 transition">
                                                                    <FileText className="w-3.5 h-3.5" /> Download CV
                                                                </a>
                                                            )}
                                                            <button
                                                                onClick={async () => {
                                                                    if (!window.confirm(`Delete submission from ${f.fullName}? This will also remove the CV file.`)) return;
                                                                    try {
                                                                        const token = localStorage.getItem("token");
                                                                        await axios.delete(`${API_BASE_URL}/api/talent/${f._id}`, { headers: { Authorization: `Bearer ${token}` } });
                                                                        setUserForms((prev: any[]) => prev.filter((u: any) => u._id !== f._id));
                                                                    } catch { alert("Failed to delete. Please try again."); }
                                                                }}
                                                                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">{f.createdAt ? new Date(f.createdAt).toLocaleDateString() : '—'}</td>
                                                </tr>
                                            ))}
                                            {activeTab === "contact_messages" && contacts.map((c: any) => (
                                                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{c.firstName} {c.lastName}</td>
                                                    <td className="px-6 py-4">{c.email}</td>
                                                    <td className="px-6 py-4">{c.phone}</td>
                                                    <td className="px-6 py-4 text-sm max-w-xs truncate" title={c.message}>{c.message}</td>
                                                    <td className="px-6 py-4 text-sm">{new Date(c.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {activeTab === "service_inquiries" && serviceInquiries.map((s: any) => (
                                                <tr key={s._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">
                                                        <div>{s.name}</div>
                                                        <div className="text-xs text-gray-500">{s.address}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div>{s.email}</div>
                                                        <div className="text-xs text-gray-500">{s.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">{s.service}</td>
                                                    <td className="px-6 py-4 font-medium">{s.company_size}</td>
                                                    <td className="px-6 py-4 text-sm">{new Date(s.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                            {activeTab === "course_enrollments" && enrollments.map((e: any) => (
                                                <tr key={e._id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 font-medium">{e.name}</td>
                                                    <td className="px-6 py-4">{e.course}</td>
                                                    <td className="px-6 py-4">{e.shift}</td>
                                                    <td className="px-6 py-4">
                                                        <div>{e.email}</div>
                                                        <div className="text-xs text-gray-500">{e.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                                            ${e.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                                                                e.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-yellow-100 text-yellow-800'}`}>
                                                            {e.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">{new Date(e.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            {e.status === 'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={async () => {
                                                                            try {
                                                                                const token = localStorage.getItem("token");
                                                                                await axios.put(`${API_BASE_URL}/api/enrollments/${e._id}`, { status: "enrolled" }, { headers: { Authorization: `Bearer ${token}` } });
                                                                                setEnrollments((prev: any[]) => prev.map((en: any) => en._id === e._id ? { ...en, status: "enrolled" } : en));
                                                                            } catch { alert("Failed to approve."); }
                                                                        }}
                                                                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-600 transition"
                                                                    >
                                                                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                                    </button>
                                                                    <button
                                                                        onClick={async () => {
                                                                            try {
                                                                                const token = localStorage.getItem("token");
                                                                                await axios.put(`${API_BASE_URL}/api/enrollments/${e._id}`, { status: "cancelled" }, { headers: { Authorization: `Bearer ${token}` } });
                                                                                setEnrollments((prev: any[]) => prev.map((en: any) => en._id === e._id ? { ...en, status: "cancelled" } : en));
                                                                            } catch { alert("Failed to reject."); }
                                                                        }}
                                                                        className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-lg text-xs hover:bg-red-600 transition"
                                                                    >
                                                                        <XCircle className="w-3.5 h-3.5" /> Reject
                                                                    </button>
                                                                </>
                                                            )}
                                                            {e.status === 'enrolled' && <span className="text-green-600 text-xs font-semibold">✓ Approved</span>}
                                                            {e.status === 'cancelled' && <span className="text-red-600 text-xs font-semibold">✗ Rejected</span>}
                                                            <button
                                                                onClick={async () => {
                                                                    if (!window.confirm(`Delete enrollment for ${e.name}?`)) return;
                                                                    try {
                                                                        const token = localStorage.getItem("token");
                                                                        await axios.delete(`${API_BASE_URL}/api/enrollments/${e._id}`, { headers: { Authorization: `Bearer ${token}` } });
                                                                        setEnrollments((prev: any[]) => prev.filter((en: any) => en._id !== e._id));
                                                                    } catch { alert("Failed to delete."); }
                                                                }}
                                                                className="flex items-center gap-1 bg-gray-400 text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-500 transition"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {activeTab === "partner_logos" && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4">
                                                        <div className="mb-6 flex gap-4 items-end bg-gray-50 p-4 rounded-lg">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Add New Client Logo</label>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={(e) => setLogoFile(e.target.files ? e.target.files[0] : null)}
                                                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={handleUploadLogo}
                                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                                                                disabled={!logoFile}
                                                            >
                                                                <Save className="w-4 h-4 mr-2" /> Upload
                                                            </button>
                                                        </div>

                                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                                            {clientLogos.map((logo: any) => (
                                                                <div key={logo._id} className="relative group bg-white border rounded-lg p-4 flex items-center justify-center hover:shadow-md transition-shadow">
                                                                    <img
                                                                        src={`${API_BASE_URL}/${logo.logo.replace(/\\/g, '/')}`}
                                                                        alt="Client Logo"
                                                                        className="h-20 w-full object-contain"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleDeleteLogo(logo._id)}
                                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        title="Delete Logo"
                                                                    >
                                                                        <X className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            {clientLogos.length === 0 && (
                                                                <div className="col-span-full text-center py-8 text-gray-500">
                                                                    No logos uploaded yet.
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                            {activeTab === "history" && (
                                                <tr>
                                                    <td colSpan={6} className="px-6 py-4">
                                                        {/* Filter Tabs */}
                                                        <div className="flex gap-2 mb-4 border-b">
                                                            <button
                                                                onClick={() => setHistoryFilter("all")}
                                                                className={`px-4 py-2 font-medium transition-colors ${historyFilter === "all"
                                                                    ? "border-b-2 border-blue-500 text-blue-600"
                                                                    : "text-gray-600 hover:text-gray-800"
                                                                    }`}
                                                            >
                                                                All History
                                                            </button>
                                                            <button
                                                                onClick={() => setHistoryFilter("application")}
                                                                className={`px-4 py-2 font-medium transition-colors ${historyFilter === "application"
                                                                    ? "border-b-2 border-blue-500 text-blue-600"
                                                                    : "text-gray-600 hover:text-gray-800"
                                                                    }`}
                                                            >
                                                                Applicant History
                                                            </button>
                                                            <button
                                                                onClick={() => setHistoryFilter("company")}
                                                                className={`px-4 py-2 font-medium transition-colors ${historyFilter === "company"
                                                                    ? "border-b-2 border-blue-500 text-blue-600"
                                                                    : "text-gray-600 hover:text-gray-800"
                                                                    }`}
                                                            >
                                                                Company History
                                                            </button>
                                                            <button
                                                                onClick={() => setHistoryFilter("job")}
                                                                className={`px-4 py-2 font-medium transition-colors ${historyFilter === "job"
                                                                    ? "border-b-2 border-blue-500 text-blue-600"
                                                                    : "text-gray-600 hover:text-gray-800"
                                                                    }`}
                                                            >
                                                                Job History
                                                            </button>
                                                            <button
                                                                onClick={() => setHistoryFilter("user")}
                                                                className={`px-4 py-2 font-medium transition-colors ${historyFilter === "user"
                                                                    ? "border-b-2 border-blue-500 text-blue-600"
                                                                    : "text-gray-600 hover:text-gray-800"
                                                                    }`}
                                                            >
                                                                User History
                                                            </button>
                                                        </div>
                                                        <div className="overflow-x-auto">
                                                            <table className="min-w-full">
                                                                <thead className="bg-gray-100">
                                                                    <tr>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Entity Type</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Action</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Details</th>
                                                                        <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Performed By</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {history.filter(record => historyFilter === "all" || record.entityType === historyFilter).length === 0 ? (
                                                                        <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No {historyFilter !== "all" ? historyFilter : ""} history records found</td></tr>
                                                                    ) : (
                                                                        history.filter(record => historyFilter === "all" || record.entityType === historyFilter).map((record: any) => (
                                                                            <tr key={record._id} className="border-t hover:bg-gray-50">
                                                                                <td className="px-4 py-3 text-sm">{new Date(record.createdAt).toLocaleString()}</td>
                                                                                <td className="px-4 py-3 text-sm capitalize">
                                                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${record.entityType === 'job' ? 'bg-blue-100 text-blue-800' :
                                                                                        record.entityType === 'company' ? 'bg-purple-100 text-purple-800' :
                                                                                            record.entityType === 'user' ? 'bg-green-100 text-green-800' :
                                                                                                'bg-yellow-100 text-yellow-800'
                                                                                        }`}>{record.entityType}</span>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm capitalize">
                                                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${record.action === 'created' ? 'bg-green-100 text-green-800' :
                                                                                        record.action === 'deleted' ? 'bg-red-100 text-red-800' :
                                                                                            record.action === 'updated' ? 'bg-blue-100 text-blue-800' :
                                                                                                record.action === 'accepted' ? 'bg-teal-100 text-teal-800' :
                                                                                                    record.action === 'rejected' ? 'bg-orange-100 text-orange-800' :
                                                                                                        'bg-gray-100 text-gray-800'
                                                                                        }`}>{record.action}</span>
                                                                                </td>
                                                                                <td className="px-4 py-3 text-sm text-gray-700">{record.details || 'N/A'}</td>
                                                                                <td className="px-4 py-3 text-sm">{record.performedBy?.fullName || record.performedBy?.email || 'System'}</td>
                                                                            </tr>
                                                                        ))
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                            {history.length > 0 && (
                                                                <div className="mt-4 text-sm text-gray-600">Total: {historyTotal} records</div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                    {!loading && (
                                        (activeTab === 'users' && users.length === 0) ||
                                        (activeTab === 'employers' && employers.length === 0) ||
                                        (activeTab === 'pending' && employers.length === 0) ||
                                        (activeTab === 'jobs' && jobs.length === 0) ||
                                        (activeTab === 'user_forms' && userForms.length === 0) ||
                                        (activeTab === 'contact_messages' && contacts.length === 0) ||
                                        (activeTab === 'service_inquiries' && serviceInquiries.length === 0) ||
                                        (activeTab === 'course_enrollments' && enrollments.length === 0)
                                    ) && (
                                            <div className="p-8 text-center text-gray-500">No records found</div>
                                        )}
                                </div>
                            </div>
                        )}

                    {activeTab === "banners" && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Manage Job Search Banner</h3>
                            <form onSubmit={handleBannerUpload} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
                                            <input
                                                type="text"
                                                value={bannerData.title}
                                                onChange={(e) => setBannerData({ ...bannerData, title: e.target.value })}
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="e.g., Find Your Dream Job"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Banner Subtitle</label>
                                            <input
                                                type="text"
                                                value={bannerData.subtitle}
                                                onChange={(e) => setBannerData({ ...bannerData, subtitle: e.target.value })}
                                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                                placeholder="e.g., Connecting Talent with Opportunity"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Background Image</label>
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                                <div className="space-y-1 text-center">
                                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                                                            <span>Select or drag image</span>
                                                            <input
                                                                type="file"
                                                                className="sr-only"
                                                                accept="image/*"
                                                                onChange={onSelectBannerFile}
                                                            />
                                                        </label>
                                                    </div>
                                                    <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Section */}
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Current/Preview Banner</label>
                                        <div className="flex-1 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center relative group">
                                            {bannerData._id || bannerFile ? (
                                                <div className="w-full h-full relative">
                                                    <img
                                                        src={bannerFile ? URL.createObjectURL(bannerFile) : (bannerData._id ? `${API_BASE_URL}/uploads/banners/${bannerData._id}.jpg` : '')}
                                                        alt="Banner Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            // Fallback if the path logic above is too simple
                                                            const target = e.target as HTMLImageElement;
                                                            if (bannerData._id && !target.src.includes('blob')) {
                                                                fetch(`${API_BASE_URL}/api/banners/job-search`)
                                                                    .then(r => r.json())
                                                                    .then(d => {
                                                                        if (d.data?.backgroundImage) target.src = `${API_BASE_URL}${d.data.backgroundImage}`;
                                                                    });
                                                            }
                                                        }}
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-4 text-center">
                                                        <h4 className="text-xl font-bold truncate w-full">{bannerData.title || "Your Heading"}</h4>
                                                        <p className="text-sm opacity-90 truncate w-full">{bannerData.subtitle || "Your Subtitle goes here"}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-gray-400 text-center p-6">
                                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                                    <p className="text-sm italic">No custom banner active</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                    {bannerFile && (
                                        <div className="mt-2 text-sm text-green-600 flex items-center justify-between bg-green-50 p-2 rounded border border-green-200">
                                            <span>Selected: {bannerFile.name} (Cropped)</span>
                                            <button type="button" onClick={() => setBannerFile(null)} className="text-red-500 hover:text-red-700">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}

                                    {/* Crop Modal / Section */}
                                    {showCropModal && bannerImgSrc && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                                                <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-xl">
                                                    <h3 className="text-lg font-bold text-gray-800">Crop Banner Image</h3>
                                                    <button type="button" onClick={() => { setShowCropModal(false); setBannerImgSrc(''); }} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                                                        <X className="w-6 h-6 text-gray-600" />
                                                    </button>
                                                </div>
                                                <div className="p-4 flex-1 overflow-auto flex justify-center bg-gray-100">
                                                    <ReactCrop
                                                        crop={bannerCrop}
                                                        onChange={(c) => setBannerCrop(c)}
                                                        onComplete={(c) => setBannerCompletedCrop(c)}
                                                        aspect={21 / 9} // optional: force a banner aspect ratio
                                                    >
                                                        <img
                                                            ref={bannerImgRef}
                                                            src={bannerImgSrc}
                                                            alt="Crop me"
                                                            style={{ maxHeight: '60vh', width: 'auto' }}
                                                        />
                                                    </ReactCrop>
                                                </div>
                                                <div className="p-4 border-t flex justify-end gap-3 bg-gray-50 rounded-b-xl">
                                                    <button
                                                        type="button"
                                                        onClick={() => { setShowCropModal(false); setBannerImgSrc(''); }}
                                                        className="px-5 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={getCroppedBannerImg}
                                                        className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                    >
                                                        Confirm Crop
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                
                                <div className="flex justify-end gap-4">
                                    {bannerData._id && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveBanner}
                                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center shadow-md transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Banner
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-md transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save Banner Settings
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === "platform_stats" && (
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-4xl mx-auto mt-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Customizable Platform Statistics</h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-gray-700">Manual Override</span>
                                    <button
                                        onClick={() => setPlatformStats({ ...platformStats, isManual: !platformStats.isManual })}
                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${platformStats.isManual ? 'bg-cyan-600' : 'bg-gray-200'}`}
                                    >
                                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${platformStats.isManual ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-500 mb-6 italic">
                                Note: These stats are shown on the home page. When "Manual Override" is active, your custom values will be used.
                            </p>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const token = localStorage.getItem("token");
                                    await axios.put(`${API_BASE_URL}/api/statistics`, platformStats, {
                                        headers: { Authorization: `Bearer ${token}` }
                                    });
                                    setSuccessMessage("Statistics updated successfully!");
                                    setTimeout(() => setSuccessMessage(""), 3000);
                                } catch (err) {
                                    console.error("Failed to update statistics", err);
                                    alert("Failed to update statistics");
                                }
                            }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Candidates</label>
                                    <input
                                        type="number"
                                        value={platformStats.totalCandidates}
                                        onChange={e => setPlatformStats({ ...platformStats, totalCandidates: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 10000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Jobs Daily</label>
                                    <input
                                        type="number"
                                        value={platformStats.dailyJobs}
                                        onChange={e => setPlatformStats({ ...platformStats, dailyJobs: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Companies</label>
                                    <input
                                        type="number"
                                        value={platformStats.totalCompanies}
                                        onChange={e => setPlatformStats({ ...platformStats, totalCompanies: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Platform Years</label>
                                    <input
                                        type="number"
                                        value={platformStats.platformYears}
                                        onChange={e => setPlatformStats({ ...platformStats, platformYears: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 5"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Daily Visits</label>
                                    <input
                                        type="number"
                                        value={platformStats.dailyVisits}
                                        onChange={e => setPlatformStats({ ...platformStats, dailyVisits: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 2000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Jobs (Cumulative)</label>
                                    <input
                                        type="number"
                                        value={platformStats.totalJobs}
                                        onChange={e => setPlatformStats({ ...platformStats, totalJobs: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 5000"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 pt-6 pb-2">
                                    <h4 className="text-lg font-bold text-gray-800 border-b pb-2">Training Statistics</h4>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Students Trained</label>
                                    <input
                                        type="number"
                                        value={platformStats.studentsTrained}
                                        onChange={e => setPlatformStats({ ...platformStats, studentsTrained: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 5000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Courses Available</label>
                                    <input
                                        type="number"
                                        value={platformStats.coursesAvailable}
                                        onChange={e => setPlatformStats({ ...platformStats, coursesAvailable: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Success Rate (%)</label>
                                    <input
                                        type="number"
                                        value={platformStats.successRate}
                                        onChange={e => setPlatformStats({ ...platformStats, successRate: parseInt(e.target.value) || 0 })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 95"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Support Available</label>
                                    <input
                                        type="text"
                                        value={platformStats.supportAvailable}
                                        onChange={e => setPlatformStats({ ...platformStats, supportAvailable: e.target.value })}
                                        className="w-full border rounded-lg px-4 py-2"
                                        placeholder="e.g. 24/7"
                                    />
                                </div>
                                <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center shadow-md transition-colors"
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save Statistics
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
            {renderEditModal()}
            {renderDetailModal()}
        </div>
    );
};

export default SuperAdminDashboard;
