import { motion } from 'framer-motion';
import { Briefcase, Building2, UserSearch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface RecruiterRecommendationsProps {
    recruiters: string[];
}

export function RecruiterRecommendations({ recruiters }: RecruiterRecommendationsProps) {
    if (!recruiters || recruiters.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
        >
            <Card className="border-green-500/20 bg-green-500/5">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-green-500/10 text-green-600">
                            <UserSearch className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle className="text-xl">Top Recruiter Recommendations</CardTitle>
                            <CardDescription>
                                Since you scored above 75%, here are top companies and queries to target.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {recruiters.map((recruiter, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="flex items-start gap-3 p-3 rounded-lg bg-background border border-border shadow-sm"
                            >
                                <div className="mt-1">
                                    <Building2 className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="text-sm font-medium text-foreground">
                                    {recruiter}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
