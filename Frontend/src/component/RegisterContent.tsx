import { useState, useEffect } from 'react'
import { Upload, Trash2, ImagePlus, User, Mail, Clock, Calendar, BookOpen, UserCheck, Plus, X, ChevronDown } from 'lucide-react'
import { toast } from 'react-toastify';

function RegisterContent() {
    interface Subject {
        _id?: string;
        id: number;
        subjectId: string;
        subjectName: string;
        subjectCode: string;
        classStartTime: string;
        classEndTime: string;
        classDays: string[];
    }

    const [formData, setFormData] = useState<{
        name: string;
        instructor: string;
        email: string;
        enrollment: string;
        batch: string;
        subjects: Subject[];
    }>({
        name: '',
        instructor: '',
        email: '',
        enrollment: '',
        batch: '',
        subjects: []
    })
    const [imageFile, setImageFile] = useState(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [availableSubjects, setAvailableSubjects] = useState<{ _id: string; Code: string; name: string }[]>([])
    const [isLoadingSubjects, setIsLoadingSubjects] = useState(false)

    // Fetch available subjects on component mount
    useEffect(() => {
        fetchSubjects()
    }, [])

    const fetchSubjects = async () => {
        setIsLoadingSubjects(true)
        try {
            const response = await fetch('http://localhost:5000/api/register/subjects', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET',
            })
            if (response.ok) {
                const subjects = await response.json()
                setAvailableSubjects(subjects)
            } else {
                console.error('Failed to fetch subjects')
                toast.error('Failed to load subjects. Please refresh the page.')
            }
        } catch (error) {
            console.error('Error fetching subjects:', error)
            toast.error('Error loading subjects. Please check your connection.')
        } finally {
            setIsLoadingSubjects(false)
        }
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const addSubject = () => {
        setFormData((prev) => ({
            ...prev,
            subjects: [...prev.subjects, {
                id: Date.now(),
                subjectId: '',
                subjectName: '',
                subjectCode: '',
                classStartTime: '',
                classEndTime: '',
                classDays: []
            }]
        }))
    }

    const removeSubject = (subjectIndex: number) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((_, index) => index !== subjectIndex)
        }))
    }

    const updateSubject = (subjectIndex: number, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.map((subject, index) => {
                if (index === subjectIndex) {
                    if (field === 'subjectId') {
                        const selectedSubject: any = availableSubjects.find((s): any => (s?._id) === value)
                        return {
                            ...subject,
                            subjectId: value,
                            subjectName: selectedSubject?.name || '',
                            subjectCode: selectedSubject?.Code || ''
                        }
                    }
                    return { ...subject, [field]: value }
                }
                return subject
            })
        }))
    }

    const toggleDayForSubject = (subjectIndex: number, day: string) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.map((subject, index) => {
                if (index === subjectIndex) {
                    const alreadySelected = subject.classDays.includes(day)
                    return {
                        ...subject,
                        classDays: alreadySelected
                            ? subject.classDays.filter((d) => d !== day)
                            : [...subject.classDays, day],
                    }
                }
                return subject
            })
        }))
    }

    const handleImageChange = (e: any) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setImagePreview(null)
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!imageFile || !formData.enrollment) {
            toast.error('Please provide an image and enrollment number.')
            return
        }

        if (formData.subjects.length === 0) {
            toast.error('Please add at least one subject.')
            return
        }
        for (let i = 0; i < formData.subjects.length; i++) {
            const subject = formData.subjects[i]
            if (!subject.subjectId || !subject.classStartTime || !subject.classEndTime || subject.classDays.length === 0) {
                toast.error(`Please complete all fields for subject ${i + 1}.`)
                return
            }
        }
        setIsSubmitting(true)
        const submissionData = new FormData()
        submissionData.append('image', imageFile)
        submissionData.append('filename', `${formData.enrollment}.jpg`)
        submissionData.append('name', formData.name)
        submissionData.append('instructor', formData.instructor)
        submissionData.append('batch', formData.batch)
        submissionData.append('email', formData.email)
        submissionData.append('enrollment', formData.enrollment)
        submissionData.append('subjects', JSON.stringify(formData.subjects))

        try {
            console.log("Submitting data:", {
                ...formData,
                subjects: formData.subjects,
                imageFile
            })
            const response = await fetch('http://localhost:5000/api/register/', {
                method: 'POST',
                body: submissionData,
                credentials: 'include',
            })
            if (response.ok) {
                setFormData({
                    instructor: '',
                    name: '',
                    email: '',
                    enrollment: '',
                    batch: '',
                    subjects: [],
                })
                setImageFile(null)
                setImagePreview(null)
                toast.success('Student registered successfully!')
            } else {
                const errorData = await response.json()
                toast.error(errorData?.message || 'Upload failed. Please try again.')
            }
        } catch (error) {
            console.error('Error:', error)
            toast.error('Something went wrong.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center">
                        <h2 className="text-3xl font-bold text-white mb-2">Student Registration</h2>
                        <p className="text-blue-100">Complete the form below to register a new student</p>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Image Upload Section */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <label className="flex items-center gap-2 mb-4 text-lg font-semibold text-gray-700">
                                <User className="w-5 h-5" />
                                Student Photo
                            </label>
                            {!imagePreview ? (
                                <div className="flex items-center justify-center w-full h-48 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-200">
                                    <label htmlFor="image-upload" className="flex flex-col items-center justify-center text-blue-500 cursor-pointer">
                                        <ImagePlus className="w-12 h-12 mb-2" />
                                        <span className="text-lg font-medium">Click to upload photo</span>
                                        <span className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</span>
                                    </label>
                                    <input
                                        id="image-upload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            ) : (
                                <div className="relative w-full max-w-sm mx-auto">
                                    <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow-md" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Personal Information */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700 mb-6">
                                <User className="w-5 h-5" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter student's full name"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Enrollment Number</label>
                                    <input
                                        type="text"
                                        name="enrollment"
                                        value={formData.enrollment}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter enrollment number"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                        <Mail className="w-4 h-4" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="student@example.com"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Batch</label>
                                    <input
                                        type="text"
                                        name="batch"
                                        value={formData.batch}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="e.g., 2024-2025"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-6">
                                <div className="space-y-2">
                                    <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                        <UserCheck className="w-4 h-4" />
                                        Instructor Name
                                    </label>
                                    <input
                                        type="text"
                                        name="instructor"
                                        value={formData.instructor}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Enter instructor name"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Subjects Section */}
                        <div className="bg-gray-50 rounded-xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                                    <BookOpen className="w-5 h-5" />
                                    Subjects & Schedules
                                </h3>
                                <button
                                    type="button"
                                    onClick={addSubject}
                                    disabled={isLoadingSubjects}
                                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Subject
                                </button>
                            </div>

                            {isLoadingSubjects && (
                                <div className="text-center py-4">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <p className="mt-2 text-gray-600">Loading subjects...</p>
                                </div>
                            )}

                            {formData.subjects.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                    <p className="text-lg">No subjects added yet</p>
                                    <p className="text-sm">Click "Add Subject" to get started</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {formData.subjects.map((subject, index) => (
                                        <div key={subject?._id} className="bg-white rounded-lg p-6 border-2 border-gray-200 relative">
                                            <button
                                                type="button"
                                                onClick={() => removeSubject(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            <h4 className="text-md font-semibold text-gray-800 mb-4">Subject {index + 1}</h4>

                                            <div className="mb-6">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select or Type Subject
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        list={`subjects-list-${index}`}
                                                        value={subject.subjectName}
                                                        onChange={(e): any => {
                                                            const typedValue = e.target.value;
                                                            const matchedSubject = availableSubjects.find(
                                                                (s) => `${s.Code} - ${s.name}`.toLowerCase() === typedValue.toLowerCase()
                                                            );
                                                            { console.log("matchedSubject:", availableSubjects, " ", matchedSubject) }
                                                            if (matchedSubject) {
                                                                updateSubject(index, "subjectId", matchedSubject._id);
                                                                updateSubject(index, "subjectName", matchedSubject.name);
                                                                updateSubject(index, "subjectCode", matchedSubject.Code);
                                                            } else {
                                                                updateSubject(index, "subjectId", typedValue); // custom value as ID
                                                                updateSubject(index, "subjectName", typedValue);
                                                                updateSubject(index, "subjectCode", ""); // leave Code empty
                                                            }
                                                        }}
                                                        placeholder="Select or type a subject..."
                                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 
                 focus:border-transparent transition-all duration-200 
                 appearance-none bg-white"
                                                        required
                                                    />

                                                    {/* Unique datalist for each subject row */}
                                                    <datalist id={`subjects-list-${index}`}>
                                                        {availableSubjects.map((subj) => (
                                                            <option key={subj._id} value={`${subj.Code} - ${subj.name}`} />
                                                        ))}
                                                    </datalist>

                                                    {/* Chevron icon */}
                                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    You can select from the list or type a new subject.
                                                </p>
                                            </div>


                                            {/* Schedule for this subject */}
                                            <div className="space-y-6">
                                                {/* Class Time */}
                                                <div>
                                                    <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-3">
                                                        <Clock className="w-4 h-4" />
                                                        Class Time
                                                    </label>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="block text-xs font-medium text-gray-600">Start Time</label>
                                                            <input
                                                                type="time"
                                                                value={subject.classStartTime}
                                                                onChange={(e) => updateSubject(index, 'classStartTime', e.target.value)}
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                required
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="block text-xs font-medium text-gray-600">End Time</label>
                                                            <input
                                                                type="time"
                                                                value={subject.classEndTime}
                                                                onChange={(e) => updateSubject(index, 'classEndTime', e.target.value)}
                                                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Class Days */}
                                                <div>
                                                    <label className="flex items-center gap-2 block text-sm font-medium text-gray-700 mb-3">
                                                        <Calendar className="w-4 h-4" />
                                                        Class Days
                                                    </label>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                                                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                                            <label key={day} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={subject.classDays.includes(day)}
                                                                    onChange={() => toggleDayForSubject(index, day)}
                                                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                                />
                                                                <span className="text-sm font-medium text-gray-700">{day.slice(0, 3)}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || formData.subjects.length === 0}
                                className={`w-full flex justify-center items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 ${isSubmitting || formData.subjects.length === 0 ? 'opacity-60 cursor-not-allowed' : 'hover:from-blue-700 hover:to-indigo-800'}`}
                            >
                                <Upload className="w-5 h-5" />
                                {isSubmitting ? 'Registering Student...' : 'Register Student'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterContent