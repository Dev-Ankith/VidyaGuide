import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Trash2, Download, Briefcase, GraduationCap, User, Wrench } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumeBuilder() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        personalInfo: { fullName: '', email: '', phone: '', linkedin: '', location: '' },
        summary: '',
        experience: [{ role: '', company: '', duration: '', description: '' }],
        education: [{ degree: '', school: '', year: '' }],
        skills: ''
    });

    // Handlers
    const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value } });
    };

    const handleExpChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const newExp = [...formData.experience];
        newExp[index] = { ...newExp[index], [e.target.name]: e.target.value };
        setFormData({ ...formData, experience: newExp });
    };

    const addExperience = () => {
        setFormData({ ...formData, experience: [...formData.experience, { role: '', company: '', duration: '', description: '' }] });
    };

    const removeExperience = (index: number) => {
        const newExp = formData.experience.filter((_, i) => i !== index);
        setFormData({ ...formData, experience: newExp });
    };

    const handleEduChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newEdu = [...formData.education];
        newEdu[index] = { ...newEdu[index], [e.target.name]: e.target.value };
        setFormData({ ...formData, education: newEdu });
    };

    const addEducation = () => {
        setFormData({ ...formData, education: [...formData.education, { degree: '', school: '', year: '' }] });
    };

    const removeEducation = (index: number) => {
        const newEdu = formData.education.filter((_, i) => i !== index);
        setFormData({ ...formData, education: newEdu });
    };

    const generateResume = async () => {
        if (!formData.personalInfo.fullName) {
            toast.error("Please enter your full name");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/generate-resume', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error("Failed to generate");

            // Handle File Download
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${formData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            toast.success("Resume downloaded successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate resume. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">AI Resume Builder</h1>
                <p className="text-muted-foreground">Enter your details and let AI format it perfectly for you.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <Input placeholder="Full Name" name="fullName" onChange={handlePersonalChange} value={formData.personalInfo.fullName} />
                    <Input placeholder="Email" name="email" onChange={handlePersonalChange} value={formData.personalInfo.email} />
                    <Input placeholder="Phone Number" name="phone" onChange={handlePersonalChange} value={formData.personalInfo.phone} />
                    <Input placeholder="Location (e.g. New York, NY)" name="location" onChange={handlePersonalChange} value={formData.personalInfo.location} />
                    <Input placeholder="LinkedIn URL (Optional)" name="linkedin" className="md:col-span-2" onChange={handlePersonalChange} value={formData.personalInfo.linkedin} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Professional Summary</CardTitle></CardHeader>
                <CardContent>
                    <Textarea placeholder="Write a brief introduction about yourself..." value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-primary" /> Experience</CardTitle>
                    <Button variant="outline" size="sm" onClick={addExperience}><Plus className="w-4 h-4 mr-2" /> Add Role</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {formData.experience.map((exp, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg bg-slate-50 relative group">
                            {formData.experience.length > 1 && (
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeExperience(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                            <div className="grid md:grid-cols-2 gap-3">
                                <Input placeholder="Job Title" name="role" value={exp.role} onChange={(e) => handleExpChange(index, e)} />
                                <Input placeholder="Company Name" name="company" value={exp.company} onChange={(e) => handleExpChange(index, e)} />
                            </div>
                            <Input placeholder="Duration (e.g. Jan 2020 - Present)" name="duration" value={exp.duration} onChange={(e) => handleExpChange(index, e)} />
                            <Textarea placeholder="Job Description (Bulleted points supported)" name="description" value={exp.description} onChange={(e) => handleExpChange(index, e)} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary" /> Education</CardTitle>
                    <Button variant="outline" size="sm" onClick={addEducation}><Plus className="w-4 h-4 mr-2" /> Add Education</Button>
                </CardHeader>
                <CardContent className="space-y-6">
                    {formData.education.map((edu, index) => (
                        <div key={index} className="space-y-3 p-4 border rounded-lg bg-slate-50 relative group">
                            {formData.education.length > 1 && (
                                <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeEducation(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                            <div className="grid md:grid-cols-2 gap-3">
                                <Input placeholder="Degree / Major" name="degree" value={edu.degree} onChange={(e) => handleEduChange(index, e)} />
                                <Input placeholder="School / University" name="school" value={edu.school} onChange={(e) => handleEduChange(index, e)} />
                            </div>
                            <Input placeholder="Year of Graduation" name="year" value={edu.year} onChange={(e) => handleEduChange(index, e)} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-primary" /> Skills</CardTitle>
                    <CardDescription>Separate skills with commas (e.g. React, Node.js, Leadership)</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea placeholder="List your key skills here..." value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} />
                </CardContent>
            </Card>

            <div className="flex justify-center pt-8 pb-20">
                <Button size="lg" className="w-full md:w-auto min-w-[300px] text-lg h-12 shadow-lg hover:shadow-xl transition-all" onClick={generateResume} disabled={loading}>
                    {loading ? "Generatng Document..." : <><Download className="mr-2 w-5 h-5" /> Generate & Download Resume</>}
                </Button>
            </div>
        </div>
    );
}
