// import React from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
// import { Upload, User, Mail, Phone, Briefcase } from "lucide-react";

// export default function Form({
//   formData,
//   onInputChange,
//   selectedFile,
//   onFileChange,
//   isSubmitting,
//   onSubmit,
// }) {
//   return (
//     <form onSubmit={onSubmit} className="bg-white rounded-lg shadow-lg overflow-hidden">
//       {/* Header */}
//       <div className="bg-blue-600 text-white text-center py-4">
//         <h2 className="text-xl font-semibold">Join Our Exclusive Talent Network</h2>
//         <p className="text-sm opacity-90">Submit your details to get notified of new roles</p>
//       </div>

//       {/* Form Fields */}
//       <div className="p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <FormInput
//             id="fullName"
//             label="Full Name *"
//             icon={User}
//             value={formData.fullName}
//             onChange={onInputChange}
//           />

//           <FormInput
//             id="designation"
//             label="Current/Last Designation *"
//             icon={Briefcase}
//             value={formData.designation}
//             onChange={onInputChange}
//           />

//           <FormInput
//             id="email"
//             label="Professional Email *"
//             icon={Mail}
//             value={formData.email}
//             onChange={onInputChange}
//           />

//           <FormInput
//             id="contactNumber"
//             label="Contact Number *"
//             icon={Phone}
//             value={formData.contactNumber}
//             onChange={onInputChange}
//           />

//           {/* Field of Expertise */}
//           <div className="space-y-2">
//             <Label>Field of Expertise *</Label>
//             <Select
//               value={formData.fieldOfExpertise}
//               onValueChange={(val) => onInputChange("fieldOfExpertise", val)}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Select your field" />
//               </SelectTrigger>
//               <SelectContent>
//                 {[
//                   "Information Technology",
//                   "Finance & Banking",
//                   "Healthcare",
//                   "Marketing & Sales",
//                   "Engineering",
//                   "Education",
//                   "Design & Creative",
//                   "Other",
//                 ].map((field, idx) => (
//                   <SelectItem key={idx} value={field.toLowerCase().replace(/\s+/g, "-")}>
//                     {field}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Employment Status */}
//           <div className="space-y-2">
//             <Label>Current Employment Status *</Label>
//             <RadioGroup
//               value={formData.employmentStatus}
//               onValueChange={(val) => onInputChange("employmentStatus", val)}
//               className="flex flex-col space-y-2"
//             >
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="still-working" id="still-working" />
//                 <Label htmlFor="still-working">Still Working</Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <RadioGroupItem value="actively-seeking" id="actively-seeking" />
//                 <Label htmlFor="actively-seeking">Actively Seeking</Label>
//               </div>
//             </RadioGroup>
//           </div>
//         </div>

//         {/* CV Upload */}
//         <div className="mt-8 space-y-4">
//           <Label>Upload Your Updated CV *</Label>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
//             <p className="text-sm text-gray-600">PDF, DOC, or DOCX (Max: 5MB)</p>
//             <div className="relative">
//               <input
//                 type="file"
//                 accept=".pdf,.doc,.docx"
//                 onChange={onFileChange}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//               />
//               <Button className="bg-blue-600 hover:bg-blue-700 text-white">
//                 <Upload className="mr-2 h-4 w-4" /> Choose File
//               </Button>
//             </div>
//             {selectedFile && <p className="text-sm text-green-600">Selected: {selectedFile.name}</p>}
//           </div>
//         </div>

//         {/* Submit */}
//         <div className="mt-8 text-center">
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 text-lg"
//           >
//             {isSubmitting ? "Submitting..." : "Submit Application"}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// }

// function FormInput({ id, label, icon: Icon, value, onChange }) {
//   return (
//     <div className="space-y-2">
//       <Label htmlFor={id}>{label}</Label>
//       <div className="relative">
//         <Icon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//         <Input
//           id={id}
//           value={value}
//           onChange={(e) => onChange(id, e.target.value)}
//           className="pl-10"
//         />
//       </div>
//     </div>
//   );
// }
