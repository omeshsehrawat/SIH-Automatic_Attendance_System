import React, { useState } from 'react'
import { Upload, Trash2, ImagePlus } from 'lucide-react'
import { toast } from 'react-toastify'

function RegisterContent() {
    const [formData, setFormData] = useState({
        name: '',
        instructor: '',
        email: '',
        enrollment: '',
        batch: '',
        code: '',
        subjectName: '',
        classTime: '',
        classDays: [] as string[],
    })
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const toggleDay = (day: string) => {
        setFormData((prev) => {
            const alreadySelected = prev.classDays.includes(day)
            return {
                ...prev,
                classDays: alreadySelected
                    ? prev.classDays.filter((d) => d !== day)
                    : [...prev.classDays, day],
            }
        })
    }


    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!imageFile || !formData.enrollment) {
            alert('Please provide an image and enrollment number.')
            return
        }

        setIsSubmitting(true)

        const submissionData = new FormData()
        submissionData.append('image', imageFile);
        submissionData.append('filename', `${formData.enrollment}.jpg`);
        submissionData.append('name', formData.name);
        submissionData.append('code', formData.code);
        submissionData.append('instructor', formData.instructor);
        submissionData.append('batch', formData.batch);
        submissionData.append('subjectName', formData.subjectName);
        submissionData.append('classTime', formData.classTime);
        submissionData.append('email', formData.email);
        submissionData.append('enrollment', formData.enrollment);
        submissionData.append('classDays', JSON.stringify(formData.classDays));

        try {
            const response = await fetch('http://localhost:5000/api/register/', {
                method: 'POST',
                body: submissionData,
                credentials: 'include',
            })
            if (response.ok) {
                setFormData({
                    instructor: '',
                    name: '',
                    code: '',
                    email: '',
                    enrollment: '',
                    batch: '',
                    subjectName: '',
                    classTime: '',
                    classDays: [],
                });
                setImageFile(null);
                setImagePreview(null);
                toast.success('Student registered successfully!');
            } else {
                const errorData = await response.json();
                toast.error(errorData?.message || 'Upload failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Something went wrong.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className=" mx-50 border mt-10 p-6 rounded-md shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Register Student</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-2 font-medium text-blue-900">Student Image</label>
                    {!imagePreview ? (
                        <div className="flex items-center justify-center w-full h-40 border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition">
                            <label htmlFor="image-upload" className="flex flex-col items-center justify-center text-blue-500">
                                <ImagePlus className="w-8 h-8 mb-1" />
                                <span className="text-sm">Click to upload</span>
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
                        <div className="relative w-full">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-md" />
                            <button
                                type="button"
                                onClick={removeImage}
                                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                <div className='flex justify-between'>
                    <div>
                        <label className=" mb-1 font-medium text-blue-900">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    <div>
                        <label className="  mb-1 font-medium text-blue-900">Enrollment No.</label>
                        <input
                            type="text"
                            name="enrollment"
                            value={formData.enrollment}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="  mb-1 font-medium text-blue-900">Batch</label>
                        <input
                            type="text"
                            name="batch"
                            value={formData.batch}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                </div>
                <div className='flex gap-20'>
                    <div>
                        <label className=" mb-1 font-medium text-blue-900">Subject Name</label>
                        <input
                            type="text"
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className="  mb-1 font-medium text-blue-900">Subject Code</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className=" mb-1 font-medium text-blue-900">Instructor Name</label>
                        <input
                            type="text"
                            name="instructor"
                            value={formData.instructor}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className=" mb-1 font-medium text-blue-900">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                    <div>
                        <label className=" mb-1 font-medium text-blue-900">Class Time</label>
                        <input
                            type="time"
                            name="classTime"
                            value={formData.classTime}
                            onChange={handleChange}
                            className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-2 font-medium text-blue-900">Class Days</label>
                    <div className="grid grid-cols-3 gap-2">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                            <label key={day} className="flex items-center gap-2 text-blue-800">
                                <input
                                    type="checkbox"
                                    checked={formData.classDays.includes(day)}
                                    onChange={() => toggleDay(day)}
                                    className="accent-blue-600"
                                />
                                <span className="text-sm">{day}</span>
                            </label>
                        ))}
                    </div>
                </div>


                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    )
}

export default RegisterContent
