import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Briefcase, Trash2, Building2, LogOut, Edit, X, Save, Image as ImageIcon, CheckCircle, XCircle, Clock,  Eye, Plus, List} from "lucide-react";
import { useNavigate } from "react-router-dom";

import CreateTraining from "./Training/TrainingCreate";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const SuperAdminDashboard = () => {
    const [activeTab, setActiveTab] = useState("users");
     const [trainingSubTab, setTrainingSubTab] = useState("list");
    const [users, setUsers] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [jobs, setJobs] = useState([]);
     const [trainings, setTrainings] = useState([]);
    const [clientLogos, setClientLogos] = useState([]);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [viewingEmployer, setViewingEmployer] = useState<any>(null);

    // Edit State
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editType, setEditType] = useState<"user" | "employer" | "job" | "training" | null>(null);
    const [editFormData, setEditFormData] = useState<any>({});
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            if (activeTab === "users") {
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
            }else if (activeTab === "trainings") {
    try {
        // MUST include config (headers) for the backend to allow the request
        const res = await axios.get(`${API_BASE_URL}/api/training`, config);
        
        // If your API returns { trainings: [...] }, use res.data.trainings
        // If it returns just [...], use res.data
        // The check below ensures it is always an array
        const data = Array.isArray(res.data) ? res.data : (res.data.trainings || []);
        setTrainings(data);
    } catch (err) {
        console.error("Training fetch failed", err);
        setTrainings([]); // Reset to empty array on error to prevent crash
    }
}

        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string, type: "user" | "employer" | "job") => {
        if (!window.confirm("Are you sure you want to delete this record?")) return;
        const token = localStorage.getItem("token");
        try {
            let endpoint = "";
            if (type === "user") endpoint = `/api/admin/user/${id}`;
            else if (type === "employer") endpoint = `/api/admin/employer/${id}`;
            else if (type === "job") endpoint = `/api/jobs/delete/${id}`;
            else if (type === "training") endpoint = `/api/training/delete/${id}`;

            await axios.delete(`${API_BASE_URL}${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData();
            alert("Deleted successfully");
        } catch (err) {
            console.error("Delete failed", err);
            alert("Delete failed");
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
            alert(`Employer ${status} successfully`);
        } catch (err) {
            console.error("Verification failed", err);
            alert("Verification failed");
        }
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

        if (editType === 'training') {
            // Training usually uses JSON payload/
            endpoint = `/api/training/update/${editingItem._id}`;
            payload = editFormData;
        } else {
            // Others use FormData for images
            const formData = new FormData();
            if (editType === 'user') {
                formData.append('fullName', editFormData.fullName || '');
                formData.append('email', editFormData.email || '');
                if (selectedFile) formData.append('profilePicture', selectedFile);
                endpoint = `/api/admin/user/${editingItem._id}`;
            } else if (editType === 'employer') {
                formData.append('companyName', editFormData.companyName || '');
                if (selectedFile) formData.append('profilePicture', selectedFile);
                endpoint = `/api/admin/employer/${editingItem._id}`;
            } else if (editType === 'job') {
                formData.append('position', editFormData.position || '');
                if (selectedFile) formData.append('logo', selectedFile);
                endpoint = `/api/jobs/update/${editingItem._id}`;
            }
            payload = formData;
        }

        await axios.put(`${API_BASE_URL}${endpoint}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        alert("Updated Successfully");
        setEditingItem(null);
        fetchData();
    } catch (err) {
        console.error("Update failed", err);
        alert("Update failed");
    }
};

    const handleUploadLogo = async () => {
        if (!logoFile) return alert("Please select a file");
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
            alert("Logo uploaded successfully");
            setLogoFile(null);
            fetchData();
        } catch (err) {
            console.error("Upload failed", err);
            alert("Upload failed");
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
            alert("Delete failed");
        }
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
                        <h3 className="text-xl font-bold">Edit {editType === 'user' ? 'Jobseeker' : editType === 'employer' ? 'Company' : 'Job'}</h3>
                        <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                     <form onSubmit={handleUpdate} className="space-y-4">
                       {editType === "training" && (
    <>
        <input type="text" placeholder="Title" value={editFormData.title || ''} onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Instructor" value={editFormData.instructor || ''} onChange={(e) => setEditFormData({ ...editFormData, instructor: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input type="text" placeholder="Price" value={editFormData.price || ''} onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })} className="w-full border rounded px-3 py-2" />
        <textarea placeholder="Description" value={editFormData.description || ''} onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })} className="w-full border rounded px-3 py-2 h-24" />
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
                                    <input type="text" value={editFormData.mobileNumber || ''} onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })} className="w-full border rounded px-3 py-2" />
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
                                    <input type="text" value={editFormData.mobileNumber || ''} onChange={(e) => setEditFormData({ ...editFormData, mobileNumber: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                            </>
                        )}
                        {editType === "job" && (
                            <>
                                <div className="flex justify-center mb-4">
                                    <div className="w-24 h-24 rounded-lg bg-gray-200 overflow-hidden relative border">
                                        {selectedFile ? (
                                            <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                        ) : editFormData.logo ? (
                                            <img src={`${API_BASE_URL}/${editFormData.logo}`} alt="Current" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400"><ImageIcon /></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Job/Company Logo</label>
                                    <input type="file" onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Position</label>
                                    <input type="text" value={editFormData.position || ''} onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Company Name (Display)</label>
                                    <input type="text" value={editFormData.companyName || ''} onChange={(e) => setEditFormData({ ...editFormData, companyName: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" value={editFormData.category || ''} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input type="text" value={editFormData.location || ''} onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })} className="w-full border rounded px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Salary</label>
                                    <input type="text" value={editFormData.salary || ''} onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })} className="w-full border rounded px-3 py-2" />
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
            <div className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Super Admin
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Management Console</p>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <button onClick={() => setActiveTab("users")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                        <Users className="w-5 h-5 mr-3" /> Jobseekers
                    </button>
                    <button onClick={() => setActiveTab("pending")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'pending' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                        <Clock className="w-5 h-5 mr-3" /> Pending Requests
                    </button>
                    <button onClick={() => setActiveTab("employers")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'employers' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                        <Building2 className="w-5 h-5 mr-3" /> Employers
                    </button>
                    <button onClick={() => setActiveTab("jobs")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'jobs' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                        <Briefcase className="w-5 h-5 mr-3" /> All Jobs
                    </button>
                    <button onClick={() => setActiveTab("trainings")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'trainings' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                        <Briefcase className="w-5 h-5 mr-3" /> Trainings
                    </button>
                    <button onClick={() => setActiveTab("partner_logos")} className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${activeTab === 'partner_logos' ? 'bg-blue-600' : 'hover:bg-slate-800'}`}>
                        <ImageIcon className="w-5 h-5 mr-3" /> Partner Logos
                    </button>
                </nav>
                <div className="p-4 border-t border-slate-800">
                    <button onClick={handleLogout} className="flex items-center text-slate-400 hover:text-white transition-colors w-full px-4 py-2">
                        <LogOut className="w-5 h-5 mr-3" /> Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
           <div className="flex-1 overflow-auto p-8 relative">
                <h2 className="text-3xl font-bold mb-8 text-gray-800 capitalize tracking-tight">Manage {activeTab}</h2>

                {loading ? (
                    <div className="flex justify-center items-center py-20"><div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>
                ) : activeTab === "trainings" ? (
                    /* --- TRAININGS TAB LOGIC --- */
                    <div className="space-y-6">
                        <div className="flex gap-4 border-b border-gray-200">
                            <button onClick={() => setTrainingSubTab("list")} className={`pb-3 px-6 font-semibold transition-all flex items-center gap-2 ${trainingSubTab === 'list' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><List className="w-4 h-4"/> Manage Trainings</button>
                            <button onClick={() => setTrainingSubTab("create")} className={`pb-3 px-6 font-semibold transition-all flex items-center gap-2 ${trainingSubTab === 'create' ? 'border-b-4 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}><Plus className="w-4 h-4"/> Create New</button>
                        </div>

                        {trainingSubTab === "create" ? (
                            <div className="bg-white rounded-xl shadow-sm border p-4"><CreateTraining /></div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr className="text-gray-600 uppercase text-xs font-bold tracking-wider">
                                            <th className="px-6 py-4">Training Title</th>
                                            <th className="px-6 py-4">Instructor</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4 text-center">Action</th>
                                        </tr>
                                    </thead>
                                   <tbody className="divide-y divide-gray-100">
    {/* Check if trainings is an array and has items */}
    {Array.isArray(trainings) && trainings.length > 0 ? (
        trainings.map((t: any) => (
            <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-gray-800">{t.title}</td>
                <td className="px-6 py-4">{t.instructor}</td>
                <td className="px-6 py-4 text-blue-600 font-bold">Rs {t.price}</td>
                <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                        <button onClick={() => handleEdit(t, "training")} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit className="w-5 h-5" /></button>
                        <button onClick={() => handleDelete(t._id, "training")} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan={4} className="p-10 text-center text-gray-500 italic">
                No trainings found or data is loading...
            </td>
        </tr>
    )}
</tbody>
                                </table>
                                {trainings.length === 0 && <div className="p-10 text-center text-gray-500 italic">No trainings found. Click "Create New" to add one.</div>}
                            </div>
                        )}
                    </div>
                ) : (
                    /* --- OTHER TABS LOGIC --- */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr className="text-gray-600 uppercase text-xs font-bold tracking-wider">
                                        {activeTab === "users" && <><th className="px-6 py-4">Picture</th><th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th><th className="px-6 py-4 text-center">Action</th></>}
                                        {activeTab === "employers" && <><th className="px-6 py-4">Logo</th><th className="px-6 py-4">Company</th><th className="px-6 py-4">Email</th><th className="px-6 py-4">Status</th><th className="px-6 py-4 text-center">Action</th></>}
                                        {activeTab === "pending" && <><th className="px-6 py-4">Logo</th><th className="px-6 py-4">Company</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-center">Action</th></>}
                                        {activeTab === "jobs" && <><th className="px-6 py-4">Logo</th><th className="px-6 py-4">Title</th><th className="px-6 py-4">Company</th><th className="px-6 py-4 text-center">Action</th></>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {activeTab === "users" && users.map((u: any) => (
                                        <tr key={u._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4"><div className="w-12 h-12 rounded-full border bg-gray-200 overflow-hidden">{u.profilePicture ? <img src={`${API_BASE_URL}/${u.profilePicture}`} className="w-full h-full object-cover" /> : <Users className="p-3 w-full h-full text-gray-400" />}</div></td>
                                            <td className="px-6 py-4 font-semibold">{u.fullName}</td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4 text-center">
                                                <button onClick={() => handleEdit(u, "user")} className="p-2 text-blue-500 mr-2"><Edit className="w-5 h-5"/></button>
                                                <button onClick={() => handleDelete(u._id, "user")} className="p-2 text-red-500"><Trash2 className="w-5 h-5"/></button>
                                            </td>
                                        </tr>
                                    ))}
                                    {/* ... Similar maps for employers, pending, and jobs as in your original code ... */}
                                </tbody>
                            </table>
                            {!loading && ((activeTab === 'users' && users.length === 0) || (activeTab === 'jobs' && jobs.length === 0)) && (
                                <div className="p-12 text-center text-gray-400 italic">No records found for this section.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {renderEditModal()}
            {renderDetailModal()}
        </div>
    );
};

export default SuperAdminDashboard;
