import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FormField } from "../components/formField"
import { CustomButton } from "../components/customButton"
import { ethers } from "ethers"
import { checkIfImage } from "../utils"
import { toast } from "sonner"
import { StateContext } from "../contexts"
import { Loader } from "../components/loader"

export function CreateCampaign() {
    const { createCampaign } = useContext(StateContext)
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        name: '',
        title: '',
        description: '',
        target: '',
        deadline: '',
        image: ''
    })

    const handleFormFieldChange = (fieldName: string, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [fieldName]: e.target.value })
    }

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault()

        checkIfImage(form.image, async (exists) => {
            if (exists) {
                setIsLoading(true)
                await createCampaign({ ...form, target: ethers.utils.parseUnits(form.target, 18) })
                setIsLoading(false)
                navigate('/admin')
            } else {
                toast.error("Provide valid image URL")
                setForm({ ...form, image: '' })
            }
        })
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#1a1a1a' }}>
            {isLoading && <Loader />}
            
            <div className="px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold mb-4" style={{ color: '#ffffff' }}>
                            Create New Campaign
                        </h1>
                        <p className="text-lg max-w-2xl mx-auto" style={{ color: '#9ca3af' }}>
                            Launch your transparent, blockchain-powered fundraising campaign
                        </p>
                    </div>

                    {/* Form */}
                    <div 
                        className="rounded-3xl p-8 md:p-12 shadow-2xl"
                        style={{ 
                            backgroundColor: '#2a2a2a',
                            border: '1px solid #374151',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-10">
                            {/* Campaign Basics Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: '#22c55e' }}
                                    />
                                    <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                                        Campaign Basics
                                    </h2>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#ffffff' }}>
                                                Campaign Creator
                                            </label>
                                            <FormField
                                                labelName=""
                                                placeholder="Your full name or organization"
                                                inputType="text"
                                                value={form.name}
                                                handleChange={(e) => handleFormFieldChange('name', e)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#ffffff' }}>
                                                Campaign Title
                                            </label>
                                            <FormField
                                                labelName=""
                                                placeholder="Give your campaign a compelling title"
                                                inputType="text"
                                                value={form.title}
                                                handleChange={(e) => handleFormFieldChange('title', e)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: '#ffffff' }}>
                                            Campaign Story
                                        </label>
                                        <FormField
                                            labelName=""
                                            placeholder="Tell potential donors about your cause, goals, and impact..."
                                            isTextArea
                                            value={form.description}
                                            handleChange={(e) => handleFormFieldChange('description', e)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Funding & Timeline Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: '#3b82f6' }}
                                    />
                                    <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                                        Funding & Timeline
                                    </h2>
                                </div>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#ffffff' }}>
                                                Funding Goal (ETH)
                                            </label>
                                            <FormField
                                                labelName=""
                                                placeholder="0.00"
                                                inputType="number"
                                                value={form.target}
                                                handleChange={(e) => handleFormFieldChange('target', e)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold mb-2" style={{ color: '#ffffff' }}>
                                                Campaign Deadline
                                            </label>
                                            <FormField
                                                labelName=""
                                                placeholder=""
                                                inputType="date"
                                                value={form.deadline}
                                                handleChange={(e) => handleFormFieldChange('deadline', e)}
                                            />
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                            {/* Campaign Media Section */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: '#ec4899' }}
                                    />
                                    <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>
                                        Campaign Media
                                    </h2>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold mb-2" style={{ color: '#ffffff' }}>
                                        Featured Image URL
                                    </label>
                                    <FormField
                                        labelName=""
                                        placeholder="https://example.com/your-campaign-image.jpg"
                                        inputType="url"
                                        value={form.image}
                                        handleChange={(e) => handleFormFieldChange('image', e)}
                                    />
                                </div>

                                {/* Enhanced Image Preview */}
                                {form.image && (
                                    <div 
                                        className="mt-6 p-6 rounded-2xl"
                                        style={{ 
                                            backgroundColor: '#111827',
                                            border: '1px solid #374151'
                                        }}
                                    >
                                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#ffffff' }}>
                                            Campaign Preview
                                        </h3>
                                        <div className="relative overflow-hidden rounded-xl">
                                            <img 
                                                src={form.image} 
                                                alt="Campaign preview" 
                                                className="w-full h-64 object-cover"
                                            />
                                            <div 
                                                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Launch Button */}
                            <div className="pt-8">
                                <CustomButton
                                    btnType="submit"
                                    title={
                                        <div className="flex items-center justify-center gap-3">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                                      d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span className="text-lg font-bold">Launch Campaign on Blockchain</span>
                                        </div>
                                    }
                                    styles={`
                                        w-full py-6 text-white font-bold rounded-2xl transition-all duration-300 
                                        transform hover:scale-[1.02] hover:shadow-2xl
                                    `}
                                    
                                />
                                
                                {/* Additional Info */}
                                <div className="mt-6 text-center">
                                    <p className="text-sm" style={{ color: '#9ca3af' }}>
                                        By launching your campaign, you agree to our blockchain transparency standards 
                                        and smart contract terms.
                                    </p>
                                    <div className="flex justify-center items-center gap-4 mt-4 text-xs font-medium">
                                        <span className="flex items-center gap-1" style={{ color: '#4ade80' }}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Verified Smart Contract
                                        </span>
                                        <span className="flex items-center gap-1" style={{ color: '#3b82f6' }}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                            Immutable Records
                                        </span>
                                        <span className="flex items-center gap-1" style={{ color: '#a855f7' }}>
                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Global Access
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}